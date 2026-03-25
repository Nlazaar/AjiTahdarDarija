import type { Theme } from './types';

export const directionsTheme: Theme = {
  id: 'directions',
  slug: 'les-directions',
  title: 'Les Directions',
  description: 'Demande ton chemin et comprends les indications en Darija.',
  level: 2,
  icon: '🗺️',
  color: '#7b2d8b',
  lessons: [
    {
      slug: 'les-directions-lecon-1',
      title: 'Demander son chemin',
      subtitle: 'فين كاين...؟',
      order: 1,
      items: [
        { type: 'phrase', id: 'fin_kayn',    darija: 'فين كاين...؟',     latin: 'fin kayn...?',      fr: 'Où est... ?',              context: 'Pour demander l\'emplacement' },
        { type: 'phrase', id: 'kifach_nmchi',darija: 'كيفاش نمشي ل...؟', latin: 'kifach nmchi l...?', fr: 'Comment aller à... ?',    context: 'Pour demander le chemin' },
        { type: 'word',   id: 'ymin',        darija: 'يمين',              latin: 'ymin',               fr: 'Droite',                  example: { darija: 'دوز من يمينك', fr: 'Tourne à droite' } },
        { type: 'word',   id: 'lisar',       darija: 'ليسار',             latin: 'lisar',              fr: 'Gauche',                  example: { darija: 'خود من ليسار', fr: 'Prends à gauche' } },
        { type: 'word',   id: 'niyshan',     darija: 'نيشان',             latin: 'niyshan',            fr: 'Tout droit',              example: { darija: 'سير نيشان',    fr: 'Va tout droit' } },
        { type: 'word',   id: '3nd',         darija: 'عند',               latin: '3nd',                fr: 'Près de / Chez',          example: { darija: 'عند الجامع',   fr: 'Près de la mosquée' } },
      ],
    },
    {
      slug: 'les-directions-lecon-2',
      title: 'Les lieux de la ville',
      subtitle: 'السوق، الجامع، المستشفى',
      order: 2,
      items: [
        { type: 'word', id: 'swiq',      darija: 'السوق',       latin: 's-swiq',     fr: 'Le marché / Le souk', example: { darija: 'السوق قريب من هنا',   fr: 'Le marché est près d\'ici' } },
        { type: 'word', id: 'jama3',     darija: 'الجامع',      latin: 'l-jama3',    fr: 'La mosquée',          example: { darija: 'الجامع الكبير',        fr: 'La grande mosquée' } },
        { type: 'word', id: 'sbitar',    darija: 'السبيطار',    latin: 's-sbitar',   fr: 'L\'hôpital',          example: { darija: 'السبيطار بعيد',        fr: 'L\'hôpital est loin' } },
        { type: 'word', id: 'mahtta',    darija: 'المحطة',      latin: 'l-mahtta',   fr: 'La gare',             example: { darija: 'فين كاينة المحطة؟',   fr: 'Où est la gare ?' } },
        { type: 'word', id: 'bank',      darija: 'البنك',       latin: 'l-bank',     fr: 'La banque',           example: { darija: 'البنك مسدود اليوم',   fr: 'La banque est fermée aujourd\'hui' } },
        { type: 'word', id: 'mdina',     darija: 'المدينة',     latin: 'l-mdina',    fr: 'La médina / Ville',   example: { darija: 'المدينة القديمة',      fr: 'La vieille médina' } },
      ],
    },
    {
      slug: 'les-directions-lecon-3',
      title: 'Distances et repères',
      subtitle: 'قريب / بعيد',
      order: 3,
      items: [
        { type: 'word',   id: 'qrib',     darija: 'قريب',       latin: 'qrib',        fr: 'Proche',              example: { darija: 'قريب من هنا',       fr: 'Proche d\'ici' } },
        { type: 'word',   id: 'b3id',     darija: 'بعيد',       latin: 'b3id',        fr: 'Loin',                example: { darija: 'بعيد شوية',         fr: 'Un peu loin' } },
        { type: 'word',   id: 'hna',      darija: 'هنا',        latin: 'hna',         fr: 'Ici',                 example: { darija: 'أنا هنا',           fr: 'Je suis ici' } },
        { type: 'word',   id: 'tmma',     darija: 'تما',        latin: 'tmma',        fr: 'Là-bas',              example: { darija: 'الجامع تما',        fr: 'La mosquée est là-bas' } },
        { type: 'phrase', id: 'mn_b3d',   darija: 'من بعد...',  latin: 'mn b3d...',   fr: 'Après... (lieu)',      context: 'Pour donner des indications séquentielles' },
        { type: 'phrase', id: 'f_wst',    darija: 'في وسط المدينة', latin: 'f-wst l-mdina', fr: 'Au centre-ville',  context: 'Pour indiquer le centre' },
      ],
    },
  ],
};
