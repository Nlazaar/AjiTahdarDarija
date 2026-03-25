import type { Theme } from './types';

export const transportsTheme: Theme = {
  id: 'transports',
  slug: 'les-transports',
  title: 'Les Transports',
  description: 'Prends les transports en commun et voyage à travers le Maroc en Darija.',
  level: 3,
  icon: '🚌',
  color: '#4a6fa5',
  lessons: [
    {
      slug: 'les-transports-lecon-1',
      title: 'Le bus et le taxi',
      subtitle: 'الطوبيس والطاكسي',
      order: 1,
      items: [
        { type: 'word',   id: 'tobis',      darija: 'طوبيس',          latin: 'tobis',          fr: 'Bus',                  example: { darija: 'الطوبيس مشا',       fr: 'Le bus est parti' } },
        { type: 'word',   id: 'taxi',       darija: 'طاكسي',          latin: 'taxi',           fr: 'Taxi',                 example: { darija: 'عطيني طاكسي',       fr: 'Appelle-moi un taxi' } },
        { type: 'phrase', id: 'wqf_hna',    darija: 'وقف هنا عفاك',   latin: 'wqf hna 3afak',  fr: 'Arrête-toi ici s\'il te plaît', context: 'Dans un taxi' },
        { type: 'phrase', id: 'fin_kaytmchi',darija: 'فين كيمشي هدا؟', latin: 'fin kmchi hda?', fr: 'Où va celui-ci ?',     context: 'Pour un bus ou grand taxi' },
        { type: 'word',   id: 'mahtta',     darija: 'محطة',           latin: 'mahtta',         fr: 'Arrêt / Gare',         example: { darija: 'المحطة قريبة',      fr: 'L\'arrêt est proche' } },
        { type: 'phrase', id: 'bghit_nmchi', darija: 'بغيت نمشي لـ...', latin: 'bghit nmchi l...', fr: 'Je veux aller à...', context: 'Pour indiquer sa destination' },
      ],
    },
    {
      slug: 'les-transports-lecon-2',
      title: 'Le train et les grands taxis',
      subtitle: 'القطار والطاكسي الكبير',
      order: 2,
      items: [
        { type: 'word',   id: 'qtar',        darija: 'القطار',          latin: 'l-qtar',         fr: 'Le train',             example: { darija: 'القطار ديال الدار البيضاء', fr: 'Le train de Casablanca' } },
        { type: 'word',   id: 'bitiya',      darija: 'بيطية',           latin: 'bitiya',         fr: 'Billet / Ticket',      example: { darija: 'بغيت بيطية واحدة', fr: 'Je veux un billet' } },
        { type: 'phrase', id: 'imta_katla3', darija: 'إيمتا كيطلع القطار؟', latin: 'imta kytl3 l-qtar?', fr: 'Quand part le train ?', context: 'Pour connaître l\'horaire de départ' },
        { type: 'phrase', id: 'imta_kayji',  darija: 'إيمتا كيجي؟',    latin: 'imta kayji?',    fr: 'Quand arrive-t-il ?',  context: 'Pour connaître l\'heure d\'arrivée' },
        { type: 'word',   id: 'mdina_taniya',darija: 'مدينة أخرى',      latin: 'mdina ukhra',    fr: 'Une autre ville',       example: { darija: 'بغيت نمشي لمدينة أخرى', fr: 'Je veux aller dans une autre ville' } },
        { type: 'phrase', id: 'waqt_l_wusul',darija: 'وقت الوصول',      latin: 'waqt l-wusul',   fr: 'Heure d\'arrivée',     context: 'Pour l\'horaire d\'arrivée' },
      ],
    },
  ],
};
