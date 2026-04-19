// ─── COURSES METADATA ─────────────────────────────────────────────────────────
//
// Source de vérité UI pour la hiérarchie Course → Unit.
// Les Lessons/Exercises restent servis par le backend (Prisma).
//
// Cette couche décrit :
//   - Les 3 Courses (Darija / MSA / Religion) avec nom, emoji, couleur
//   - Les Units (villes du Maroc, pays arabes, thèmes religieux)
//   - Le mapping moduleSlug → Unit via `moduleSlugPatterns` (substring match)
//
// Règle `enabled` :
//   - enabled: false → invisible pour l'utilisateur (dev pas encore validé)
//   - enabled: true  → visible, verrouillage géré par UserProgressContext
//
// Ajouter une Unit :
//   1. Ajouter l'entrée dans la liste units[] du Course concerné
//   2. Définir moduleSlugPatterns (slugs des modules backend à regrouper dedans)
//   3. Flipper enabled à true quand le contenu est prêt

export type CourseId = 'DARIJA' | 'MSA' | 'RELIGION';

export interface CityDescription {
  photoEmoji: string;
  photoCaption: string;
  photoUrl?: string;
  histoire: string;
  motTypique: { ar: string; latin: string; fr: string };
  specialite: string;
  faitCulturel: string;
  aVoir: string;
  musique: string;
}

export interface CourseUnit {
  id: string;
  number: number;
  title: string;
  titleAr: string;
  subtitle: string;
  emoji: string;
  color: string;
  enabled: boolean;
  moduleSlugPatterns: string[];
  description?: CityDescription;
}

export interface Course {
  id: CourseId;
  name: string;
  nameAr: string;
  description: string;
  emoji: string;
  color: string;
  enabled: boolean;
  units: CourseUnit[];
}

// ─── DARIJA — Voyage au Maroc (7 villes) ─────────────────────────────────────

const DARIJA: Course = {
  id: 'DARIJA',
  name: 'Darija',
  nameAr: 'الدارجة',
  description: 'Voyage au Maroc — apprends le dialecte marocain',
  emoji: '🇲🇦',
  color: '#2a9d8f',
  enabled: true,
  units: [
    {
      id: 'tanger',
      number: 1,
      title: 'Tanger',
      titleAr: 'طنجة',
      subtitle: 'Salutations & premiers mots',
      emoji: '🌊',
      color: '#1cb0f6',
      enabled: true,
      moduleSlugPatterns: ['salutations', 'presenter', 'se-presenter'],
      description: {
        photoEmoji: '🌊',
        photoCaption: 'Porte du détroit, entre Atlantique et Méditerranée',
        histoire:
          'Tanger est une ville portuaire millénaire, carrefour entre l\'Europe et l\'Afrique. Elle a longtemps été une zone internationale avant de rejoindre le Maroc indépendant en 1956.',
        motTypique: { ar: 'مَرْحَبا', latin: 'marḥaba', fr: 'bienvenue' },
        specialite: 'Poissons frais et thé à la menthe face au détroit',
        faitCulturel: 'Ville cosmopolite qui a inspiré Matisse, Burroughs et Bowles',
        aVoir: 'La Kasbah, le Cap Spartel et les grottes d\'Hercule',
        musique: 'Musique andalouse et rythmes gnaouas',
      },
    },
    {
      id: 'chefchaouen',
      number: 2,
      title: 'Chefchaouen',
      titleAr: 'شفشاون',
      subtitle: 'Couleurs & artisanat',
      emoji: '🔵',
      color: '#6a994e',
      enabled: true,
      moduleSlugPatterns: ['couleurs'],
      description: {
        photoEmoji: '🔵',
        photoCaption: 'La perle bleue du Rif',
        histoire:
          'Fondée en 1471, Chefchaouen est nichée dans les montagnes du Rif. Ses ruelles peintes en bleu indigo sont devenues son emblème mondial.',
        motTypique: { ar: 'زْوِينْ', latin: 'zwin', fr: 'joli / beau' },
        specialite: 'Fromage de chèvre frais et tajine au kefta',
        faitCulturel: 'Le bleu éloignerait les moustiques et rafraîchirait les maisons',
        aVoir: 'Place Outa el Hammam et la cascade d\'Akchour',
        musique: 'Chants soufis et musique andalouse du Nord',
      },
    },
    {
      id: 'fes',
      number: 3,
      title: 'Fès',
      titleAr: 'فاس',
      subtitle: 'Famille & métiers',
      emoji: '🏛️',
      color: '#c9941a',
      enabled: true,
      moduleSlugPatterns: ['famille', 'travail', 'metiers'],
      description: {
        photoEmoji: '🏛️',
        photoCaption: 'Capitale spirituelle et intellectuelle du Maroc',
        histoire:
          'Fondée en 789, Fès abrite la plus ancienne université du monde (Al Quaraouiyine, 859). Sa médina est classée au patrimoine mondial de l\'UNESCO.',
        motTypique: { ar: 'الحَمْدُ للهْ', latin: 'l-ḥamdu llāh', fr: 'Dieu merci' },
        specialite: 'Pastilla au pigeon et méchoui traditionnel',
        faitCulturel: 'Ville des artisans : tanneurs, potiers, brodeurs de génération en génération',
        aVoir: 'Tannerie Chouara, Médersa Bou Inania, Bab Boujloud',
        musique: 'Musique andalouse de Fès (noubat al-âla)',
      },
    },
    {
      id: 'marrakech',
      number: 4,
      title: 'Marrakech',
      titleAr: 'مراكش',
      subtitle: 'Souk & nourriture',
      emoji: '🏰',
      color: '#e76f51',
      enabled: true,
      moduleSlugPatterns: ['nourriture', 'achats', 'marche'],
      description: {
        photoEmoji: '🏰',
        photoCaption: 'La ville rouge au pied de l\'Atlas',
        histoire:
          'Fondée en 1062 par les Almoravides, Marrakech fut capitale impériale. Son nom aurait donné naissance au mot « Maroc ».',
        motTypique: { ar: 'بِشْحالْ؟', latin: 'bšḥāl?', fr: 'combien ?' },
        specialite: 'Tangia marrakchia et jus d\'orange de la place Jemaa el-Fna',
        faitCulturel: 'Jemaa el-Fna classée patrimoine oral de l\'humanité par l\'UNESCO',
        aVoir: 'Koutoubia, Jardin Majorelle, Palais Bahia',
        musique: 'Gnaoua, chaâbi et rythmes amazighs',
      },
    },
    {
      id: 'agadir',
      number: 5,
      title: 'Agadir',
      titleAr: 'أݣادير',
      subtitle: 'Plage & moderne',
      emoji: '🏖️',
      color: '#e9a84c',
      enabled: true,
      moduleSlugPatterns: ['directions', 'transports'],
      description: {
        photoEmoji: '🏖️',
        photoCaption: 'Station balnéaire reconstruite après 1960',
        histoire:
          'Détruite par un tremblement de terre en 1960, Agadir fut entièrement reconstruite en ville moderne. Son nom signifie « grenier fortifié » en amazigh.',
        motTypique: { ar: 'أَزُولْ', latin: 'azul', fr: 'bonjour (berbère)' },
        specialite: 'Poisson grillé du port et huile d\'argan',
        faitCulturel: 'Capitale du Souss, cœur de la culture amazighe du Sud',
        aVoir: 'La Kasbah d\'Agadir Oufella, la plage et la corniche',
        musique: 'Ahwach et musique amazighe du Souss',
      },
    },
    {
      id: 'ouarzazate',
      number: 6,
      title: 'Ouarzazate',
      titleAr: 'ورزازات',
      subtitle: 'Kasbahs & cinéma',
      emoji: '🎬',
      color: '#7b2d8b',
      enabled: true,
      moduleSlugPatterns: ['logement', 'maison', 'objets'],
      description: {
        photoEmoji: '🎬',
        photoCaption: 'Le Hollywood du désert',
        histoire:
          'Ancien poste militaire devenu capitale du cinéma marocain. De nombreux blockbusters y sont tournés : Gladiator, Game of Thrones, Lawrence d\'Arabie.',
        motTypique: { ar: 'بَرَّا', latin: 'barra', fr: 'dehors' },
        specialite: 'Tajine berbère et dattes du Drâa',
        faitCulturel: 'La kasbah d\'Aït Benhaddou est classée UNESCO',
        aVoir: 'Aït Benhaddou, studios Atlas, vallée du Drâa',
        musique: 'Ahidous et musique amazighe de l\'Atlas',
      },
    },
    {
      id: 'merzouga',
      number: 7,
      title: 'Merzouga',
      titleAr: 'مرزوݣة',
      subtitle: 'Sahara & temps',
      emoji: '🏜️',
      color: '#f4845f',
      enabled: true,
      moduleSlugPatterns: ['chiffres', 'temps', 'corps', 'sante'],
      description: {
        photoEmoji: '🏜️',
        photoCaption: 'Aux portes de l\'erg Chebbi',
        histoire:
          'Petit village saharien devenu porte d\'entrée des dunes de l\'erg Chebbi, hautes de 150 mètres. Terre des nomades sahraouis et berbères.',
        motTypique: { ar: 'شْوِيَّة', latin: 'šwiyya', fr: 'un peu' },
        specialite: 'Madfouna (pizza berbère) et thé dans les dunes',
        faitCulturel: 'Les nomades y lisent les étoiles pour voyager la nuit',
        aVoir: 'Dunes de l\'erg Chebbi, lever de soleil à dos de dromadaire',
        musique: 'Musique gnaouie et chants des caravaniers',
      },
    },
    {
      id: 'expressions',
      number: 8,
      title: 'Darija avancé',
      titleAr: 'الدارجة المتقدمة',
      subtitle: 'Expressions & fluidité',
      emoji: '🎓',
      color: '#457b9d',
      enabled: true,
      moduleSlugPatterns: ['expressions', 'avance'],
    },
  ],
};

// ─── MSA — Monde arabe (6 pays) ──────────────────────────────────────────────

const MSA: Course = {
  id: 'MSA',
  name: 'Arabe standard',
  nameAr: 'الفصحى',
  description: 'Monde arabe — apprends l’arabe standard moderne',
  emoji: '📖',
  color: '#7b2d8b',
  enabled: true,
  units: [
    {
      id: 'maroc-msa',
      number: 1,
      title: 'Maroc',
      titleAr: 'المغرب',
      subtitle: 'Premiers mots',
      emoji: '🇲🇦',
      color: '#2a9d8f',
      enabled: true,
      moduleSlugPatterns: ['alphabet', 'salutations', 'presenter'],
    },
    {
      id: 'egypte',
      number: 2,
      title: 'Égypte',
      titleAr: 'مصر',
      subtitle: 'Culture & histoire',
      emoji: '🏛️',
      color: '#e9a84c',
      enabled: true,
      moduleSlugPatterns: ['famille', 'chiffres'],
    },
    {
      id: 'liban',
      number: 3,
      title: 'Liban',
      titleAr: 'لبنان',
      subtitle: 'Gastronomie',
      emoji: '🌿',
      color: '#6a994e',
      enabled: true,
      moduleSlugPatterns: ['nourriture', 'achats', 'couleurs'],
    },
    {
      id: 'jordanie',
      number: 4,
      title: 'Jordanie',
      titleAr: 'الأردن',
      subtitle: 'Patrimoine',
      emoji: '🏺',
      color: '#c9941a',
      enabled: true,
      moduleSlugPatterns: ['logement', 'transports', 'directions'],
    },
    {
      id: 'arabie',
      number: 5,
      title: 'Arabie',
      titleAr: 'السعودية',
      subtitle: 'Traditions',
      emoji: '🐪',
      color: '#e76f51',
      enabled: true,
      moduleSlugPatterns: ['corps', 'sante', 'temps', 'travail'],
    },
    {
      id: 'irak',
      number: 6,
      title: 'Irak',
      titleAr: 'العراق',
      subtitle: 'Civilisation',
      emoji: '🌴',
      color: '#457b9d',
      enabled: true,
      moduleSlugPatterns: ['expressions', 'avance'],
    },
  ],
};

// ─── RELIGION — Parcours islamique (5 thèmes) ────────────────────────────────

const RELIGION: Course = {
  id: 'RELIGION',
  name: 'Religion',
  nameAr: 'الدين',
  description: 'Parcours islamique — fondements et pratiques',
  emoji: '🕌',
  color: '#6a994e',
  enabled: true,
  units: [
    {
      id: 'piliers',
      number: 1,
      title: 'Les 5 piliers',
      titleAr: 'أركان الإسلام',
      subtitle: 'Fondements',
      emoji: '🕋',
      color: '#c9941a',
      enabled: false,
      moduleSlugPatterns: ['piliers'],
    },
    {
      id: 'priere',
      number: 2,
      title: 'La Prière',
      titleAr: 'الصلاة',
      subtitle: '5 prières quotidiennes',
      emoji: '🤲',
      color: '#2a9d8f',
      enabled: false,
      moduleSlugPatterns: ['priere', 'salat'],
    },
    {
      id: 'coran',
      number: 3,
      title: 'Le Coran',
      titleAr: 'القرآن',
      subtitle: 'Sourates essentielles',
      emoji: '📖',
      color: '#457b9d',
      enabled: false,
      moduleSlugPatterns: ['coran', 'sourate'],
    },
    {
      id: 'hajj',
      number: 4,
      title: 'Le Hajj',
      titleAr: 'الحج',
      subtitle: 'Pèlerinage',
      emoji: '🕋',
      color: '#7b2d8b',
      enabled: false,
      moduleSlugPatterns: ['hajj', 'pelerinage'],
    },
    {
      id: 'ramadan',
      number: 5,
      title: 'Ramadan',
      titleAr: 'رمضان',
      subtitle: 'Mois sacré',
      emoji: '🌙',
      color: '#e76f51',
      enabled: false,
      moduleSlugPatterns: ['ramadan', 'sawm'],
    },
  ],
};

// ─── REGISTRY ────────────────────────────────────────────────────────────────

export const COURSES: Course[] = [DARIJA, MSA, RELIGION];

export function getCourse(id: CourseId): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

/**
 * Trouve la Unit à laquelle un moduleSlug appartient, dans le Course donné.
 * Matching par substring (lowercase). Retourne la 1re Unit dont au moins un
 * pattern matche le slug.
 */
export function findUnitForSlug(courseId: CourseId, moduleSlug: string): CourseUnit | null {
  const course = getCourse(courseId);
  if (!course) return null;
  const slug = moduleSlug.toLowerCase();
  for (const unit of course.units) {
    if (!unit.enabled) continue;
    if (unit.moduleSlugPatterns.some((p) => slug.includes(p))) return unit;
  }
  return null;
}
