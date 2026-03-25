import type { Theme } from './types';

export const logementTheme: Theme = {
  id: 'logement',
  slug: 'le-logement',
  title: 'Le Logement',
  description: 'Décris ta maison et parle du logement en Darija marocain.',
  level: 3,
  icon: '🏠',
  color: '#8b5e3c',
  lessons: [
    {
      slug: 'le-logement-lecon-1',
      title: 'Les pièces de la maison',
      subtitle: 'بيت / دار',
      order: 1,
      items: [
        { type: 'word', id: 'dar',      darija: 'دار',          latin: 'dar',          fr: 'Maison',              example: { darija: 'داري كبيرة',         fr: 'Ma maison est grande' } },
        { type: 'word', id: 'bit',      darija: 'بيت',          latin: 'bit',          fr: 'Chambre / Pièce',     example: { darija: 'عندنا تلاتة بيوت',   fr: 'Nous avons trois chambres' } },
        { type: 'word', id: 'salon',    darija: 'الصالون',       latin: 's-salon',      fr: 'Salon',               example: { darija: 'الصالون واسع',       fr: 'Le salon est spacieux' } },
        { type: 'word', id: 'kuzina',   darija: 'الكوزينة',      latin: 'l-kuzina',     fr: 'Cuisine',             example: { darija: 'الكوزينة ف الطابق الأول', fr: 'La cuisine est au premier étage' } },
        { type: 'word', id: 'hammam',   darija: 'الحمام',        latin: 'l-hammam',     fr: 'Salle de bain',       example: { darija: 'الحمام مزيان',       fr: 'La salle de bain est bien' } },
        { type: 'word', id: 'bibiyer',  darija: 'البيبيير',      latin: 'l-bibiyer',    fr: 'Balcon / Terrasse',   example: { darija: 'كنجلس فالبيبيير',   fr: 'Je m\'assieds sur la terrasse' } },
      ],
    },
    {
      slug: 'le-logement-lecon-2',
      title: 'Chercher un logement',
      subtitle: 'بغيت كراء...',
      order: 2,
      items: [
        { type: 'phrase', id: 'bghit_kra',   darija: 'بغيت نكري شقة',    latin: 'bghit nkri chqqa', fr: 'Je veux louer un appartement', context: 'Pour chercher un logement' },
        { type: 'word',   id: 'chqqa',       darija: 'شقة',               latin: 'chqqa',            fr: 'Appartement',            example: { darija: 'الشقة فالطابق الثالث', fr: 'L\'appartement est au troisième étage' } },
        { type: 'word',   id: 'kra',         darija: 'الكرا',              latin: 'l-kra',            fr: 'Le loyer',               example: { darija: 'الكرا مرتفع',         fr: 'Le loyer est élevé' } },
        { type: 'phrase', id: 'waach_kayn',  darija: 'واش كاين...',        latin: 'wach kayn...',     fr: 'Est-ce qu\'il y a... ?', context: 'Pour demander des commodités' },
        { type: 'word',   id: 'tabq',        darija: 'طابق',               latin: 'tabq',             fr: 'Étage',                  example: { darija: 'الطابق الثاني',       fr: 'Le deuxième étage' } },
        { type: 'phrase', id: 'rass_shhar',  darija: 'شحال الكرا فالشهر؟', latin: 'chhal l-kra f-ch-chher?', fr: 'Combien est le loyer mensuel ?', context: 'Pour négocier le loyer' },
      ],
    },
  ],
};
