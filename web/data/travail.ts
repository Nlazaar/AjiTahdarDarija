import type { Theme } from './types';

export const travailTheme: Theme = {
  id: 'travail',
  slug: 'les-metiers-et-travail',
  title: 'Le Travail',
  description: 'Parle des métiers et de la vie professionnelle en Darija marocain.',
  level: 3,
  icon: '💼',
  color: '#2d6a4f',
  lessons: [
    {
      slug: 'les-metiers-et-travail-lecon-1',
      title: 'Les métiers',
      subtitle: 'الحرف والمهن',
      order: 1,
      items: [
        { type: 'word', id: 'tabib',     darija: 'طبيب',      latin: 'tabib',      fr: 'Médecin',       example: { darija: 'هو طبيب فالسبيطار',     fr: 'Il est médecin à l\'hôpital' } },
        { type: 'word', id: 'mudarris',  darija: 'مدرس',      latin: 'mudarris',   fr: 'Enseignant(e)', example: { darija: 'أنا مدرسة فالمدرسة',     fr: 'Je suis enseignante à l\'école' } },
        { type: 'word', id: 'muhandis',  darija: 'مهندس',     latin: 'muhandis',   fr: 'Ingénieur',     example: { darija: 'هو مهندس فشركة كبيرة',   fr: 'Il est ingénieur dans une grande entreprise' } },
        { type: 'word', id: 'tujjar',    darija: 'تاجر',      latin: 'tajir',      fr: 'Commerçant(e)', example: { darija: 'باه تاجر فالسوق',        fr: 'Son père est commerçant au marché' } },
        { type: 'word', id: 'sarraf',    darija: 'صراف',      latin: 'sarraf',     fr: 'Caissier / Banquier', example: { darija: 'الصراف مشغول',     fr: 'Le caissier est occupé' } },
        { type: 'word', id: 'tabbakh',   darija: 'طباخ',      latin: 'tabbakh',    fr: 'Cuisinier',     example: { darija: 'الطباخ كيدير الطاجين بزاف مزيان', fr: 'Le cuisinier fait très bien le tajine' } },
      ],
    },
    {
      slug: 'les-metiers-et-travail-lecon-2',
      title: 'Au bureau',
      subtitle: 'فالمكتب',
      order: 2,
      items: [
        { type: 'word',   id: 'mktab',      darija: 'المكتب',      latin: 'l-mktab',      fr: 'Le bureau',        example: { darija: 'المكتب ديالي فالطابق الثالث', fr: 'Mon bureau est au troisième étage' } },
        { type: 'word',   id: 'mu3allim',   darija: 'المعلم',      latin: 'l-mu3allim',   fr: 'Le patron / Chef', example: { darija: 'المعلم غاضب اليوم',        fr: 'Le patron est en colère aujourd\'hui' } },
        { type: 'phrase', id: 'ana_mchghul', darija: 'أنا مشغول',  latin: 'ana mchghul',  fr: 'Je suis occupé(e)', context: 'Pour dire qu\'on est pris' },
        { type: 'phrase', id: 'mw3id',       darija: 'عندي موعد',   latin: '3ndi mw3id',   fr: 'J\'ai un rendez-vous', context: 'Pour justifier une absence' },
        { type: 'word',   id: '3utla',       darija: 'عطلة',        latin: '3utla',        fr: 'Congé / Vacances', example: { darija: 'عندي عطلة نهار الجمعة', fr: 'J\'ai congé vendredi' } },
        { type: 'phrase', id: 'sir_b_slama', darija: 'سير بسلامة', latin: 'sir bslama',   fr: 'Bonne journée',     context: 'Pour souhaiter une bonne journée en partant' },
      ],
    },
  ],
};
