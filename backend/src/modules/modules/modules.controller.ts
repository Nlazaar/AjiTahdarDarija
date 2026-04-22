import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards, NotFoundException,
  UseInterceptors, UploadedFile, BadRequestException, Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import * as sharp from 'sharp';
import { CoursesService } from '../courses/courses.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { STORAGE, StorageService } from '../../storage/storage.service';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_MIME = /^image\/(jpe?g|png|webp|avif)$/i;

@Controller('modules')
export class ModulesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly prisma: PrismaService,
    @Inject(STORAGE) private readonly storage: StorageService,
  ) {}

  /** GET /modules?track=DARIJA|MSA|RELIGION (publique — uniquement publiés) */
  @Get()
  async findAll(@Query('track') track?: string) {
    return this.coursesService.findAll(track?.toUpperCase() as any);
  }

  @Get(':id/lessons')
  async lessons(@Param('id') id: string) {
    const lessons = await this.coursesService.findLessonsByModule(id);
    if (!lessons) throw new NotFoundException('Module not found');
    return lessons;
  }

  // ── Admin CRUD (header X-Admin-Token requis) ─────────────────────────────

  @UseGuards(AdminGuard)
  @Get('admin/all')
  listAllForAdmin() {
    return this.coursesService.listAllForAdmin();
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() body: any) {
    return this.coursesService.createModule(body);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.coursesService.updateModule(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Query('hard') hard?: string) {
    return this.coursesService.deleteModule(id, hard === 'true');
  }

  /**
   * Upload photo ville : multipart/form-data, champ "file".
   * Pipeline : multer(memory) → sharp (resize 1200px + WebP q80) → StorageService.
   * Nommage : `cities/{slug}-{kind}-{uuid}.webp` (slug + kind pour debug,
   * uuid pour éviter les collisions en cas de rename de ville).
   *
   * Query ?kind=section (défaut) → bandeau CityCard, écrit sur cityInfo.photoUrl
   *       ?kind=postcard          → carte postale révélée, écrit sur cityInfo.postcardUrl
   */
  @UseGuards(AdminGuard)
  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: MAX_UPLOAD_BYTES },
  }))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Query('kind') kind?: string,
  ) {
    if (!file) throw new BadRequestException('file is required');
    if (!ACCEPTED_MIME.test(file.mimetype)) {
      throw new BadRequestException('Format non supporté (jpg/png/webp/avif)');
    }
    const target: 'section' | 'postcard' = kind === 'postcard' ? 'postcard' : 'section';
    const field = target === 'postcard' ? 'postcardUrl' : 'photoUrl';

    const mod = await this.prisma.module.findUnique({ where: { id } });
    if (!mod) throw new NotFoundException('Module not found');

    const webp = await sharp(file.buffer)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const slugSafe = (mod.slug || 'module').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const key = `cities/${slugSafe}-${target}-${randomUUID()}.webp`;
    const saved = await this.storage.save(webp, key, 'image/webp');

    // Supprime l'ancienne image du même champ si elle pointait vers notre storage
    const previous = (mod.cityInfo as any)?.[field];
    if (typeof previous === 'string' && previous.startsWith('/uploads/')) {
      const prevKey = previous.replace(/^\/uploads\//, '');
      if (prevKey && prevKey !== key) {
        await this.storage.delete(prevKey).catch(() => undefined);
      }
    }

    const nextCityInfo = { ...((mod.cityInfo as any) ?? {}), [field]: saved.url };
    await this.prisma.module.update({
      where: { id },
      data: { cityInfo: nextCityInfo },
    });

    return { url: saved.url, key: saved.key, kind: target };
  }
}
