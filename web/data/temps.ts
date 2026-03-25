import type { Theme } from './types';

export const tempsTheme: Theme = {
  id: 'temps',
  slug: 'le-temps-les-jours',
  title: 'Le Temps et les Jours',
  description: 'Parle du temps, des jours de la semaine et des mois en Darija.',
  level: 2,
  icon: '📅',
  color: '#264653',
  lessons: [
    {
      slug: 'le-temps-les-jours-lecon-1',
      title: 'Les jours de la semaine',
      subtitle: 'أيام الأسبوع',
      order: 1,
      items: [
        { type: 'word', id: 'lhad',     darija: 'الحد',      latin: 'l-had',      fr: 'Dimanche',  example: { darija: 'الحد نرتاح',        fr: 'Je me repose le dimanche' } },
        { type: 'word', id: 'tnin',     darija: 'التنين',    latin: 'l-tnin',     fr: 'Lundi',     example: { darija: 'التنين نبدا الخدمة', fr: 'Je commence le travail le lundi' } },
        { type: 'word', id: 'tlat',     darija: 'الثلاث',    latin: 'l-tlat',     fr: 'Mardi',     example: { darija: 'الثلاث عندي موعد',  fr: 'J\'ai rendez-vous mardi' } },
        { type: 'word', id: 'larb3',    darija: 'الأربعاء',  latin: "l-arb3",     fr: 'Mercredi',  example: { darija: 'الأربعاء نمشي للسوق', fr: 'Je vais au marché mercredi' } },
        { type: 'word', id: 'khmis',    darija: 'الخميس',    latin: 'l-khmis',    fr: 'Jeudi',     example: { darija: 'الخميس عطلة',       fr: 'Le jeudi est férié' } },
        { type: 'word', id: 'jm3a',     darija: 'الجمعة',    latin: 'l-jm3a',     fr: 'Vendredi',  example: { darija: 'الجمعة للصلاة',     fr: 'Le vendredi pour la prière' } },
        { type: 'word', id: 'sbt',      darija: 'السبت',     latin: 's-sbt',      fr: 'Samedi',    example: { darija: 'السبت ما كنخدمش',   fr: 'Je ne travaille pas le samedi' } },
      ],
    },
    {
      slug: 'le-temps-les-jours-lecon-2',
      title: 'L\'heure',
      subtitle: 'شحال هي الساعة؟',
      order: 2,
      items: [
        { type: 'phrase', id: 'chhal_sa3a',  darija: 'شحال هي الساعة؟',   latin: 'chhal hiya s-sa3a?', fr: 'Quelle heure est-il ?',    context: 'Pour demander l\'heure' },
        { type: 'phrase', id: 'sa3a_wahda',  darija: 'الساعة واحدة',       latin: 's-sa3a wahda',       fr: 'Il est une heure',         context: 'Dire l\'heure pile' },
        { type: 'word',   id: 'sa3a',        darija: 'ساعة',               latin: 'sa3a',               fr: 'Heure',                    example: { darija: 'نجيك بعد ساعة', fr: 'Je viens dans une heure' } },
        { type: 'word',   id: 'dqiqa',       darija: 'دقيقة',              latin: 'dqiqa',              fr: 'Minute',                   example: { darija: 'انتظرني خمس دقائق', fr: 'Attends-moi cinq minutes' } },
        { type: 'phrase', id: 'sbah',        darija: 'فالصباح',            latin: 'f-s-sbah',           fr: 'Le matin',                 context: 'Préciser le moment de la journée' },
        { type: 'phrase', id: 'l3shiya',     darija: 'فالعشية',            latin: 'f-l-3chiya',         fr: 'L\'après-midi / Le soir',  context: 'Préciser le moment de la journée' },
      ],
    },
    {
      slug: 'le-temps-les-jours-lecon-3',
      title: 'Les mois et les saisons',
      subtitle: 'الشهور والفصول',
      order: 3,
      items: [
        { type: 'word', id: 'yanayer',  darija: 'يناير',    latin: 'yanayer',   fr: 'Janvier',   example: { darija: 'يناير بارد',         fr: 'Janvier est froid' } },
        { type: 'word', id: 'ghucht',   darija: 'غشت',      latin: 'ghucht',    fr: 'Août',      example: { darija: 'غشت حار بزاف',       fr: 'Août est très chaud' } },
        { type: 'word', id: 'shita',    darija: 'شتا',      latin: 'chita',     fr: 'Hiver',     example: { darija: 'الشتا بارد هنا',     fr: 'L\'hiver est froid ici' } },
        { type: 'word', id: 'sayf',     darija: 'صيف',      latin: 'sayf',      fr: 'Été',       example: { darija: 'الصيف كنمشي للبحر', fr: 'L\'été je vais à la mer' } },
        { type: 'word', id: 'rbi3',     darija: 'ربيع',     latin: 'rbi3',      fr: 'Printemps', example: { darija: 'الربيع مزيان',       fr: 'Le printemps est agréable' } },
        { type: 'word', id: 'khrayf',   darija: 'خريف',     latin: 'khrif',     fr: 'Automne',   example: { darija: 'الخريف كيبدا فشتنبر', fr: 'L\'automne commence en septembre' } },
      ],
    },
  ],
};
