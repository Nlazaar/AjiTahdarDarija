import type { Theme } from './types';

export const couleursTheme: Theme = {
  id: 'couleurs',
  slug: 'les-couleurs',
  title: 'Les Couleurs',
  description: 'Décris le monde en couleurs avec le Darija marocain.',
  level: 1,
  icon: '🎨',
  color: '#c9941a',
  lessons: [
    {
      slug: 'les-couleurs-lecon-1',
      title: 'Les couleurs principales',
      subtitle: 'حمر، زرق، خضر',
      order: 1,
      items: [
        { type: 'word', id: 'hmar',     darija: 'حمر',      latin: 'hmar',     fr: 'Rouge',   example: { darija: 'الجلابة حمرا',       fr: 'La djellaba est rouge' } },
        { type: 'word', id: 'zraq',     darija: 'زرق',      latin: 'zraq',     fr: 'Bleu',    example: { darija: 'السما زرقة',          fr: 'Le ciel est bleu' } },
        { type: 'word', id: 'khdar',    darija: 'خضر',      latin: 'khdar',    fr: 'Vert',    example: { darija: 'الشجرة خضرة',         fr: "L'arbre est vert" } },
        { type: 'word', id: 'sfar',     darija: 'صفر',      latin: 'sfar',     fr: 'Jaune',   example: { darija: 'الشمس صفرة',          fr: 'Le soleil est jaune' } },
        { type: 'word', id: 'bortqali', darija: 'برتقالي',  latin: 'bortqali', fr: 'Orange',  example: { darija: 'البرتقالة برتقالية',  fr: "L'orange est orange" } },
        { type: 'word', id: 'bnfsji',   darija: 'بنفسجي',   latin: 'bnfsji',   fr: 'Violet',  example: { darija: 'الزهر بنفسجي',        fr: 'La fleur est violette' } },
      ],
    },
    {
      slug: 'les-couleurs-lecon-2',
      title: 'Blanc, noir, marron',
      subtitle: 'بيض، كحل، بنيني',
      order: 2,
      items: [
        { type: 'word', id: 'byad',   darija: 'بيض',    latin: 'byad',    fr: 'Blanc',   example: { darija: 'الثلج بياض',      fr: 'La neige est blanche' } },
        { type: 'word', id: 'khal',   darija: 'كحل',    latin: 'khal',    fr: 'Noir',    example: { darija: 'الليل كحل',       fr: 'La nuit est noire' } },
        { type: 'word', id: 'bnini',  darija: 'بنيني',  latin: 'bnini',   fr: 'Marron',  example: { darija: 'التربة بنينية',   fr: 'La terre est marron' } },
        { type: 'word', id: 'rmadi',  darija: 'رمادي',  latin: 'rmadi',   fr: 'Gris',    example: { darija: 'السما رمادية',    fr: 'Le ciel est gris' } },
        { type: 'word', id: 'wardi',  darija: 'وردي',   latin: 'wardi',   fr: 'Rose',    example: { darija: 'الوردة وردية',    fr: 'La rose est rose' } },
        { type: 'word', id: 'dhbi',   darija: 'دهبي',   latin: 'dhbi',    fr: 'Doré',    example: { darija: 'الخاتم دهبي',     fr: 'La bague est dorée' } },
      ],
    },
    {
      slug: 'les-couleurs-lecon-3',
      title: 'Décrire les objets',
      subtitle: 'هاد الشي...',
      order: 3,
      items: [
        { type: 'phrase', id: 'had_chi_hmar',  darija: 'هاد الشي حمر',   latin: 'had chi hmar',    fr: 'Cet objet est rouge',   context: 'Décrire la couleur d\'un objet' },
        { type: 'phrase', id: 'chnu_lun',      darija: 'شنو لون ديالو؟',  latin: 'chnu lun dyalu?', fr: 'De quelle couleur est-il ?', context: 'Demander la couleur' },
        { type: 'word',   id: 'lun',           darija: 'لون',             latin: 'lun',             fr: 'Couleur',              example: { darija: 'شنو لونو؟',  fr: 'De quelle couleur ?' } },
        { type: 'phrase', id: 'bhal_lun',      darija: 'بحال لون...',     latin: 'bhal lun...',     fr: 'De la même couleur que...', context: 'Comparer des couleurs' },
        { type: 'word',   id: 'fatiH',         darija: 'فاتح',            latin: 'fateh',           fr: 'Clair (couleur)',       example: { darija: 'زرق فاتح',   fr: 'Bleu clair' } },
        { type: 'word',   id: 'ghamq',         darija: 'غامق',            latin: 'ghamq',           fr: 'Foncé (couleur)',       example: { darija: 'خضر غامق',   fr: 'Vert foncé' } },
      ],
    },
  ],
};
