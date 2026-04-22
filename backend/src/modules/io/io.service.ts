import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

const KNOWN_TYPOLOGIES = new Set([
  'FlashCard',
  'ChoixLettre',
  'AssocierLettres',
  'TrouverLesPaires',
  'EntendreEtChoisir',
  'VraiFaux',
  'DicterRomanisation',
])

const VOCAB_REF_RE = /^__vocab\[(\d+)\]__$/

type ImportPayload =
  | { kind: 'section'; version?: number; data: SectionPayload }
  | { kind: 'lessons'; version?: number; data: LessonsPayload }
  | { kind: 'vocabulary'; version?: number; data: VocabularyPayload }
  | { kind: 'exercises'; version?: number; data: ExercisesPayload }

type SectionPayload = {
  module: ModuleInput
  lessons?: LessonInput[]
}

type LessonsPayload = {
  moduleSlug: string
  lessons: LessonInput[]
}

type VocabularyPayload = {
  lessonSlug: string
  vocabulary: VocabInput[]
}

type ExercisesPayload = {
  lessonSlug: string
  exercises: ExerciseInput[]
}

type ModuleInput = {
  slug: string
  title: string
  subtitle?: string | null
  description?: string | null
  level?: number
  track?: 'DARIJA' | 'MSA' | 'RELIGION'
  canonicalOrder?: number
  colorA?: string | null
  colorB?: string | null
  shadowColor?: string | null
  isPublished?: boolean
}

type LessonInput = {
  slug: string
  title: string
  languageCode: string
  subtitle?: string | null
  description?: string | null
  order?: number
  level?: number
  duration?: number | null
  videoUrl?: string | null
  videoPoster?: string | null
  isPublished?: boolean
  content?: any
  vocabulary?: VocabInput[]
  exercises?: ExerciseInput[]
}

type VocabInput = {
  word: string
  transliteration?: string | null
  translation?: any
  audioUrl?: string | null
  imageUrl?: string | null
  partOfSpeech?: string | null
  examples?: any
  tags?: string[]
  languageCode?: string
}

type ExerciseInput = {
  order?: number
  typology: string
  config?: any
}

@Injectable()
export class IoService {
  constructor(private readonly prisma: PrismaService) {}

  // ────────── IMPORT ──────────

  async import(payload: ImportPayload) {
    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('payload must be an object')
    }
    switch (payload.kind) {
      case 'section':    return this.importSection(payload.data)
      case 'lessons':    return this.importLessons(payload.data)
      case 'vocabulary': return this.importVocabulary(payload.data)
      case 'exercises':  return this.importExercises(payload.data)
      default:
        throw new BadRequestException(`unknown kind "${(payload as any).kind}"`)
    }
  }

  private async importSection(data: SectionPayload) {
    if (!data?.module?.slug?.trim()) throw new BadRequestException('module.slug is required')
    if (!data.module.title?.trim()) throw new BadRequestException('module.title is required')

    const moduleData = this.cleanModuleInput(data.module)
    const mod = await this.prisma.module.upsert({
      where: { slug: data.module.slug },
      create: moduleData,
      update: moduleData,
    })

    const lessonReports: any[] = []
    for (const lesson of data.lessons ?? []) {
      lessonReports.push(await this.upsertLesson(mod.id, lesson))
    }

    return {
      ok: true,
      module: { id: mod.id, slug: mod.slug, title: mod.title, created: !mod.updatedAt || mod.createdAt.getTime() === mod.updatedAt.getTime() },
      lessons: lessonReports,
    }
  }

  private async importLessons(data: LessonsPayload) {
    if (!data?.moduleSlug?.trim()) throw new BadRequestException('moduleSlug is required')
    if (!Array.isArray(data.lessons)) throw new BadRequestException('lessons must be an array')

    const mod = await this.prisma.module.findUnique({ where: { slug: data.moduleSlug } })
    if (!mod) throw new NotFoundException(`module "${data.moduleSlug}" not found`)

    const reports: any[] = []
    for (const lesson of data.lessons) {
      reports.push(await this.upsertLesson(mod.id, lesson))
    }
    return { ok: true, moduleSlug: data.moduleSlug, lessons: reports }
  }

  private async importVocabulary(data: VocabularyPayload) {
    if (!data?.lessonSlug?.trim()) throw new BadRequestException('lessonSlug is required')
    if (!Array.isArray(data.vocabulary)) throw new BadRequestException('vocabulary must be an array')

    const lesson = await this.prisma.lesson.findUnique({ where: { slug: data.lessonSlug } })
    if (!lesson) throw new NotFoundException(`lesson "${data.lessonSlug}" not found`)

    const created = await this.upsertVocabularyForLesson(lesson.id, lesson.languageId, data.vocabulary)
    return { ok: true, lessonSlug: data.lessonSlug, vocabularyCreated: created.length }
  }

  private async importExercises(data: ExercisesPayload) {
    if (!data?.lessonSlug?.trim()) throw new BadRequestException('lessonSlug is required')
    if (!Array.isArray(data.exercises)) throw new BadRequestException('exercises must be an array')

    const lesson = await this.prisma.lesson.findUnique({ where: { slug: data.lessonSlug } })
    if (!lesson) throw new NotFoundException(`lesson "${data.lessonSlug}" not found`)

    // Append mode : ne supprime pas l'existant, ajoute à la suite
    const existingCount = await this.prisma.lessonExercise.count({ where: { lessonId: lesson.id } })
    // Pour résoudre les __vocab[N]__ en append, on map via l'ordre actuel des items du cours.
    const vocabIds = await this.listVocabIdsForLesson(lesson.id)

    const created = await this.createAuthoredExercises(lesson.id, data.exercises, existingCount, vocabIds)
    return { ok: true, lessonSlug: data.lessonSlug, exercisesCreated: created.length, startOrder: existingCount }
  }

  // ────────── upsert helpers ──────────

  private async upsertLesson(moduleId: string, lesson: LessonInput) {
    if (!lesson.title?.trim()) throw new BadRequestException(`lesson : title required`)
    if (!lesson.languageCode?.trim()) throw new BadRequestException(`lesson "${lesson.title}" : languageCode required`)

    const lang = await this.prisma.language.findUnique({ where: { code: lesson.languageCode } })
    if (!lang) throw new BadRequestException(`language "${lesson.languageCode}" not found`)

    // slug auto-généré depuis le titre si absent (avec suffixe module pour unicité)
    const slug = lesson.slug?.trim() || await this.makeUniqueLessonSlug(moduleId, lesson.title)

    const lessonData = {
      moduleId,
      languageId: lang.id,
      title: lesson.title,
      slug,
      subtitle: lesson.subtitle ?? null,
      description: lesson.description ?? null,
      order: lesson.order ?? 0,
      level: lesson.level ?? 1,
      duration: lesson.duration ?? null,
      videoUrl: lesson.videoUrl ?? null,
      videoPoster: lesson.videoPoster ?? null,
      isPublished: lesson.isPublished ?? false,
      content: (lesson.content ?? {}) as any,
    }

    const existing = await this.prisma.lesson.findUnique({ where: { slug } })
    const saved = existing
      ? await this.prisma.lesson.update({ where: { id: existing.id }, data: lessonData })
      : await this.prisma.lesson.create({ data: lessonData })

    const vocabCreated = lesson.vocabulary?.length
      ? await this.upsertVocabularyForLesson(saved.id, saved.languageId, lesson.vocabulary)
      : []

    let exercisesCreated = 0
    let startOrder = 0
    if (lesson.exercises?.length) {
      // Append mode : on ne touche pas aux exercices existants
      startOrder = await this.prisma.lessonExercise.count({ where: { lessonId: saved.id } })
      const vocabIds = await this.listVocabIdsForLesson(saved.id)
      const created = await this.createAuthoredExercises(saved.id, lesson.exercises, startOrder, vocabIds)
      exercisesCreated = created.length
    }

    return {
      slug: saved.slug,
      id: saved.id,
      created: !existing,
      vocabularyCreated: vocabCreated.length,
      exercisesCreated,
    }
  }

  /** Crée les Vocabulary + lie-les via Exercise(type=MULTIPLE_CHOICE stub) pour qu'ils apparaissent dans /lessons/:id/vocabulary. */
  private async upsertVocabularyForLesson(lessonId: string, languageId: string, items: VocabInput[]) {
    const created: { id: string; word: string }[] = []
    for (const v of items) {
      if (!v?.word?.trim()) continue

      // dédup par (languageId, word) si déjà présent
      const existing = await this.prisma.vocabulary.findFirst({
        where: { languageId, word: v.word },
      })

      const vocab = existing
        ? await this.prisma.vocabulary.update({
            where: { id: existing.id },
            data: {
              transliteration: v.transliteration ?? existing.transliteration,
              translation: (v.translation ?? existing.translation) as any,
              audioUrl: v.audioUrl ?? existing.audioUrl,
              imageUrl: v.imageUrl ?? existing.imageUrl,
              partOfSpeech: (v.partOfSpeech as any) ?? existing.partOfSpeech,
              examples: (v.examples ?? existing.examples) as any,
              tags: v.tags ?? existing.tags,
            },
          })
        : await this.prisma.vocabulary.create({
            data: {
              word: v.word,
              transliteration: v.transliteration ?? null,
              translation: (v.translation ?? null) as any,
              audioUrl: v.audioUrl ?? null,
              imageUrl: v.imageUrl ?? null,
              partOfSpeech: (v.partOfSpeech as any) ?? null,
              examples: (v.examples ?? null) as any,
              tags: v.tags ?? [],
              languageId,
            },
          })

      // Liaison cours ↔ vocab via un Exercise stub (modèle existant — getVocabulary lit ce join).
      const linkExists = await this.prisma.exercise.findFirst({
        where: { lessonId, vocabularyId: vocab.id },
        select: { id: true },
      })
      if (!linkExists) {
        await this.prisma.exercise.create({
          data: {
            type: 'MULTIPLE_CHOICE',
            lessonId,
            vocabularyId: vocab.id,
            data: {} as any,
            answer: {} as any,
          },
        })
      }

      created.push({ id: vocab.id, word: vocab.word })
    }
    return created
  }

  private async listVocabIdsForLesson(lessonId: string): Promise<string[]> {
    const items = await this.prisma.exercise.findMany({
      where: { lessonId, vocabularyId: { not: null } },
      orderBy: { createdAt: 'asc' },
      distinct: ['vocabularyId'],
      select: { vocabularyId: true },
    })
    return items.map(i => i.vocabularyId!).filter(Boolean)
  }

  private async createAuthoredExercises(
    lessonId: string,
    exercises: ExerciseInput[],
    startOrder: number,
    vocabIds: string[],
  ) {
    const created: any[] = []
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i]
      if (!ex?.typology) throw new BadRequestException(`exercise[${i}] : typology required`)
      if (!KNOWN_TYPOLOGIES.has(ex.typology)) {
        throw new BadRequestException(`exercise[${i}] : unknown typology "${ex.typology}"`)
      }
      const config = this.resolveVocabRefs(ex.config ?? {}, vocabIds)
      const order = typeof ex.order === 'number' ? ex.order : startOrder + i
      const row = await this.prisma.lessonExercise.create({
        data: { lessonId, typology: ex.typology, config: config as any, order },
      })
      created.push({ id: row.id, typology: row.typology, order: row.order })
    }
    return created
  }

  /** Remplace récursivement les chaînes "__vocab[N]__" par le vrai vocabulary id. */
  private resolveVocabRefs(node: any, vocabIds: string[]): any {
    if (typeof node === 'string') {
      const m = VOCAB_REF_RE.exec(node)
      if (m) {
        const idx = Number(m[1])
        const id = vocabIds[idx]
        if (!id) throw new BadRequestException(`__vocab[${idx}]__ : index hors limites (${vocabIds.length} items)`)
        return id
      }
      return node
    }
    if (Array.isArray(node)) return node.map(n => this.resolveVocabRefs(n, vocabIds))
    if (node && typeof node === 'object') {
      const out: any = {}
      for (const k of Object.keys(node)) out[k] = this.resolveVocabRefs(node[k], vocabIds)
      return out
    }
    return node
  }

  private cleanModuleInput(m: ModuleInput) {
    return {
      slug: m.slug,
      title: m.title,
      subtitle: m.subtitle ?? null,
      description: m.description ?? null,
      level: m.level ?? 1,
      track: (m.track ?? 'MSA') as any,
      canonicalOrder: m.canonicalOrder ?? 0,
      colorA: m.colorA ?? null,
      colorB: m.colorB ?? null,
      shadowColor: m.shadowColor ?? null,
      isPublished: m.isPublished ?? false,
    }
  }

  // ────────── EXPORT ──────────

  async exportSection(moduleSlug: string) {
    const mod = await this.prisma.module.findUnique({
      where: { slug: moduleSlug },
      include: {
        lessons: {
          where: { isDeleted: false },
          orderBy: { order: 'asc' },
          include: { language: true },
        },
      },
    })
    if (!mod) throw new NotFoundException(`module "${moduleSlug}" not found`)

    const lessons = await Promise.all(mod.lessons.map(l => this.serializeLesson(l)))

    return {
      kind: 'section',
      version: 1,
      data: {
        module: this.serializeModule(mod),
        lessons,
      },
    }
  }

  async exportLessons(moduleSlug: string) {
    const mod = await this.prisma.module.findUnique({
      where: { slug: moduleSlug },
      include: {
        lessons: {
          where: { isDeleted: false },
          orderBy: { order: 'asc' },
          include: { language: true },
        },
      },
    })
    if (!mod) throw new NotFoundException(`module "${moduleSlug}" not found`)

    const lessons = await Promise.all(mod.lessons.map(l => this.serializeLesson(l)))
    return {
      kind: 'lessons',
      version: 1,
      data: { moduleSlug, lessons },
    }
  }

  async exportVocabulary(lessonSlug: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { slug: lessonSlug } })
    if (!lesson) throw new NotFoundException(`lesson "${lessonSlug}" not found`)

    const vocab = await this.fetchVocabularyForLesson(lesson.id)
    return {
      kind: 'vocabulary',
      version: 1,
      data: { lessonSlug, vocabulary: vocab },
    }
  }

  async exportExercises(lessonSlug: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { slug: lessonSlug } })
    if (!lesson) throw new NotFoundException(`lesson "${lessonSlug}" not found`)

    const vocabIds = await this.listVocabIdsForLesson(lesson.id)
    const rows = await this.prisma.lessonExercise.findMany({
      where: { lessonId: lesson.id },
      orderBy: { order: 'asc' },
    })
    const exercises = rows.map(r => ({
      order: r.order,
      typology: r.typology,
      config: this.encodeVocabRefs(r.config, vocabIds),
    }))
    return {
      kind: 'exercises',
      version: 1,
      data: { lessonSlug, exercises },
    }
  }

  private async serializeLesson(lesson: any) {
    const vocab = await this.fetchVocabularyForLesson(lesson.id)
    const vocabIds = await this.listVocabIdsForLesson(lesson.id)
    const exRows = await this.prisma.lessonExercise.findMany({
      where: { lessonId: lesson.id },
      orderBy: { order: 'asc' },
    })
    const exercises = exRows.map(r => ({
      order: r.order,
      typology: r.typology,
      config: this.encodeVocabRefs(r.config, vocabIds),
    }))

    return {
      slug: lesson.slug,
      title: lesson.title,
      languageCode: lesson.language?.code,
      subtitle: lesson.subtitle,
      description: lesson.description,
      order: lesson.order,
      level: lesson.level,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
      videoPoster: lesson.videoPoster,
      isPublished: lesson.isPublished,
      content: lesson.content ?? {},
      vocabulary: vocab,
      exercises,
    }
  }

  private async fetchVocabularyForLesson(lessonId: string) {
    const exercises = await this.prisma.exercise.findMany({
      where: { lessonId, vocabularyId: { not: null } },
      include: { vocabulary: true },
      orderBy: { createdAt: 'asc' },
      distinct: ['vocabularyId'],
    })
    return exercises
      .map(e => e.vocabulary)
      .filter(Boolean)
      .map(v => ({
        word: v!.word,
        transliteration: v!.transliteration,
        translation: v!.translation,
        audioUrl: v!.audioUrl,
        imageUrl: v!.imageUrl,
        partOfSpeech: v!.partOfSpeech,
        examples: v!.examples,
        tags: v!.tags,
      }))
  }

  private encodeVocabRefs(node: any, vocabIds: string[]): any {
    if (typeof node === 'string') {
      const idx = vocabIds.indexOf(node)
      return idx >= 0 ? `__vocab[${idx}]__` : node
    }
    if (Array.isArray(node)) return node.map(n => this.encodeVocabRefs(n, vocabIds))
    if (node && typeof node === 'object') {
      const out: any = {}
      for (const k of Object.keys(node)) out[k] = this.encodeVocabRefs(node[k], vocabIds)
      return out
    }
    return node
  }

  /** Génère un slug unique depuis un titre, suffixé par le slug du module. */
  private async makeUniqueLessonSlug(moduleId: string, title: string): Promise<string> {
    const mod = await this.prisma.module.findUnique({ where: { id: moduleId }, select: { slug: true } })
    const base = `${mod?.slug ?? 'lesson'}-${this.slugify(title)}`.replace(/^-+|-+$/g, '') || 'lesson'
    let candidate = base
    let n = 2
    while (await this.prisma.lesson.findUnique({ where: { slug: candidate }, select: { id: true } })) {
      candidate = `${base}-${n++}`
    }
    return candidate
  }

  private slugify(s: string): string {
    return s
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')           // diacritiques latines
      .replace(/[\u0610-\u061a\u064b-\u065f\u0670]/g, '')  // diacritiques arabes (harakat)
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06ff]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64)
  }

  private serializeModule(m: any): ModuleInput {
    return {
      slug: m.slug,
      title: m.title,
      subtitle: m.subtitle,
      description: m.description,
      level: m.level,
      track: m.track,
      canonicalOrder: m.canonicalOrder,
      colorA: m.colorA,
      colorB: m.colorB,
      shadowColor: m.shadowColor,
      isPublished: m.isPublished,
    }
  }
}
