import type { Theme } from './types';

export const corpsTheme: Theme = {
  id: 'corps',
  slug: 'le-corps-la-sante',
  title: 'Le Corps et la Santé',
  description: 'Décris le corps humain et explique tes symptômes chez le médecin en Darija.',
  level: 3,
  icon: '🏥',
  color: '#e07a8e',
  lessons: [
    {
      slug: 'le-corps-la-sante-lecon-1',
      title: 'Les parties du corps',
      subtitle: 'أعضاء الجسم',
      order: 1,
      items: [
        { type: 'word', id: 'ras',     darija: 'الراس',   latin: 'r-ras',    fr: 'La tête',    example: { darija: 'راسي كيدور',     fr: 'J\'ai la tête qui tourne' } },
        { type: 'word', id: '3yn',     darija: 'العين',   latin: 'l-3yn',    fr: 'L\'œil',     example: { darija: 'عيني حمرة',       fr: 'Mon œil est rouge' } },
        { type: 'word', id: 'yedd',    darija: 'اليد',    latin: 'l-yedd',   fr: 'La main',    example: { darija: 'يدي كتوجعني',     fr: 'Ma main me fait mal' } },
        { type: 'word', id: 'rjl',     darija: 'الرجل',   latin: 'r-rjl',    fr: 'La jambe / Le pied', example: { darija: 'رجلي محلولة',    fr: 'Ma jambe est engourdieée' } },
        { type: 'word', id: 'bitn',    darija: 'البطن',   latin: 'l-bitn',   fr: 'Le ventre',  example: { darija: 'بطني كيوجعني',    fr: 'J\'ai mal au ventre' } },
        { type: 'word', id: 'dhr',     darija: 'الظهر',   latin: 'd-dhr',    fr: 'Le dos',     example: { darija: 'ظهري كيضرب',      fr: 'J\'ai mal au dos' } },
      ],
    },
    {
      slug: 'le-corps-la-sante-lecon-2',
      title: 'Chez le médecin',
      subtitle: 'عند الطبيب',
      order: 2,
      items: [
        { type: 'phrase', id: 'kaywj3ni',   darija: 'كيوجعني هنا',       latin: 'kayuwj3ni hna',      fr: 'Ça me fait mal ici',        context: 'Pour décrire la douleur au médecin' },
        { type: 'phrase', id: '3ndi_hma',   darija: 'عندي حمى',          latin: '3ndi hma',           fr: 'J\'ai de la fièvre',        context: 'Symptôme courant' },
        { type: 'phrase', id: 'manqadrch',  darija: 'ما نقدرش نتنفس',    latin: 'manqadrch ntnfss',   fr: 'Je ne peux pas respirer',   context: 'Problème respiratoire' },
        { type: 'word',   id: 'dwa',        darija: 'الدواء',             latin: 'd-dwa',              fr: 'Le médicament',             example: { darija: 'الدواء فالفارمسيان', fr: 'Le médicament est en pharmacie' } },
        { type: 'word',   id: 'farmsiyan',  darija: 'الفارمسيان',         latin: 'l-farmsiyan',        fr: 'La pharmacie',              example: { darija: 'الفارمسيان مفتوح؟', fr: 'La pharmacie est-elle ouverte ?' } },
        { type: 'phrase', id: '3ndi_mw3d',  darija: 'عندي موعد مع الطبيب', latin: '3ndi mw3d m3 t-tbib', fr: 'J\'ai rendez-vous avec le médecin', context: 'Pour aller chez le médecin' },
      ],
    },
  ],
};
