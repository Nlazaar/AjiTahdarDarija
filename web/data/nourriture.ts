import type { Theme } from './types';

export const nourritureTheme: Theme = {
  id: 'nourriture',
  slug: 'la-nourriture',
  title: 'La Nourriture',
  description: 'Commande, cuisine et parle de la gastronomie marocaine en Darija.',
  level: 2,
  icon: '🍽️',
  color: '#e63946',
  lessons: [
    {
      slug: 'la-nourriture-lecon-1',
      title: 'Les fruits et légumes',
      subtitle: 'الفواكه والخضرة',
      order: 1,
      items: [
        { type: 'word', id: 'tffah',    darija: 'تفاح',    latin: 'tffah',    fr: 'Pomme',     example: { darija: 'بغيت تفاح عفاك',    fr: 'Je veux des pommes s\'il te plaît' } },
        { type: 'word', id: 'brtqal',   darija: 'برتقال',  latin: 'brtqal',   fr: 'Orange',    example: { darija: 'برتقال ديال عصير',   fr: 'Oranges pour le jus' } },
        { type: 'word', id: '3inb',     darija: 'عنب',     latin: '3inb',     fr: 'Raisin',    example: { darija: 'العنب حلو بزاف',     fr: 'Le raisin est très sucré' } },
        { type: 'word', id: 'tmatem',   darija: 'طماطم',   latin: 'tmatem',   fr: 'Tomate',    example: { darija: 'طماطم وخضرة',        fr: 'Tomates et légumes' } },
        { type: 'word', id: 'khlal',    darija: 'خلال',    latin: 'khlal',    fr: 'Carotte',   example: { darija: 'شربة ديال خلال',     fr: 'Soupe aux carottes' } },
        { type: 'word', id: 'bsal',     darija: 'بصل',     latin: 'bsal',     fr: 'Oignon',    example: { darija: 'بصل وزيت زيتون',     fr: 'Oignon et huile d\'olive' } },
        { type: 'word', id: 'batata',   darija: 'بطاطا',   latin: 'batata',   fr: 'Pomme de terre', example: { darija: 'بطاطا مسلوقة',  fr: 'Pommes de terre cuites' } },
      ],
    },
    {
      slug: 'la-nourriture-lecon-2',
      title: 'Les plats marocains',
      subtitle: 'الطاجين، الكسكس...',
      order: 2,
      items: [
        { type: 'word', id: 'tajin',    darija: 'طاجين',   latin: 'tajin',    fr: 'Tajine',       example: { darija: 'طاجين بلحم وخضرة',   fr: 'Tajine viande et légumes' } },
        { type: 'word', id: 'ksksu',    darija: 'كسكسو',   latin: 'ksksu',    fr: 'Couscous',     example: { darija: 'كسكسو ديال جمعة',    fr: 'Couscous du vendredi' } },
        { type: 'word', id: 'harira',   darija: 'حريرة',   latin: 'harira',   fr: 'Harira (soupe)', example: { darija: 'حريرة مع التمر',   fr: 'Harira avec des dattes' } },
        { type: 'word', id: 'bastila',  darija: 'بسطيلة',  latin: 'bastila',  fr: 'Pastilla',     example: { darija: 'بسطيلة بالورق',      fr: 'Pastilla en feuilles' } },
        { type: 'word', id: 'mrqq',     darija: 'مرق',     latin: 'mrqq',     fr: 'Bouillon / Sauce', example: { darija: 'المرق بان',      fr: 'La sauce est prête' } },
        { type: 'word', id: 'khobz',    darija: 'خبز',     latin: 'khobz',    fr: 'Pain',          example: { darija: 'خبز ديال الفرن',     fr: 'Pain du four' } },
      ],
    },
    {
      slug: 'la-nourriture-lecon-3',
      title: 'Au café et au restaurant',
      subtitle: 'عطيني... / بغيت...',
      order: 3,
      items: [
        { type: 'phrase', id: '3tini',     darija: 'عطيني...',           latin: '3tini...',           fr: 'Donne-moi...',            context: 'Pour commander' },
        { type: 'phrase', id: 'bghit',     darija: 'بغيت...',            latin: 'bghit...',           fr: 'Je veux...',              context: 'Pour exprimer sa commande' },
        { type: 'word',   id: 'atay',      darija: 'أتاي',               latin: 'atay',               fr: 'Thé à la menthe',         example: { darija: 'أتاي بالنعناع',  fr: 'Thé à la menthe' } },
        { type: 'word',   id: 'qhwa',      darija: 'قهوة',               latin: 'qhwa',               fr: 'Café',                    example: { darija: 'قهوة حلوة',       fr: 'Café sucré' } },
        { type: 'phrase', id: 'hssab',     darija: 'عطيني لحساب',        latin: '3tini l-hssab',      fr: 'L\'addition s\'il vous plaît', context: 'Demander l\'addition' },
        { type: 'phrase', id: 'bnin_bzzf', darija: 'بنين بزاف!',         latin: 'bnin bzzaf!',        fr: 'C\'est très bon !',        context: 'Complimenter la nourriture' },
      ],
    },
  ],
};
