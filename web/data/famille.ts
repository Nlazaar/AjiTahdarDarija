import type { Theme } from './types';

export const familleTheme: Theme = {
  id: 'famille',
  slug: 'la-famille',
  title: 'La Famille',
  description: 'Apprends à parler de ta famille et de tes proches en Darija.',
  level: 2,
  icon: '👨‍👩‍👧',
  color: '#457b9d',
  lessons: [
    {
      slug: 'la-famille-lecon-1',
      title: 'La famille proche',
      subtitle: 'بابا، ماما، خويا',
      order: 1,
      items: [
        { type: 'word', id: 'baba',   darija: 'بابا',   latin: 'baba',   fr: 'Papa / Père',   example: { darija: 'بابا ديالي طبيب',     fr: 'Mon père est médecin' } },
        { type: 'word', id: 'mama',   darija: 'ماما',   latin: 'mama',   fr: 'Maman / Mère',  example: { darija: 'ماما ديالي مدرسة',    fr: 'Ma mère est professeure' } },
        { type: 'word', id: 'khoya',  darija: 'خويا',   latin: 'khoya',  fr: 'Mon frère',     example: { darija: 'خويا كبير عليا',      fr: 'Mon frère est plus grand que moi' } },
        { type: 'word', id: 'okhti',  darija: 'أختي',   latin: 'okhti',  fr: 'Ma sœur',       example: { darija: 'أختي ساكنة فرانسا',   fr: 'Ma sœur vit en France' } },
        { type: 'word', id: 'wldi',   darija: 'ولدي',   latin: 'wldi',   fr: 'Mon fils',      example: { darija: 'ولدي عندو خمس سنين', fr: 'Mon fils a cinq ans' } },
        { type: 'word', id: 'benti',  darija: 'بنتي',   latin: 'benti',  fr: 'Ma fille',      example: { darija: 'بنتي مزيانة بزاف',    fr: 'Ma fille est très gentille' } },
        { type: 'word', id: 'zawj',   darija: 'زوج',    latin: 'zawj',   fr: 'Mari / Époux',  example: { darija: 'زوجي مغربي',          fr: 'Mon mari est marocain' } },
        { type: 'word', id: 'mra',    darija: 'مرا',    latin: 'mra',    fr: 'Femme / Épouse', example: { darija: 'مراتي فرانساوية',     fr: 'Ma femme est française' } },
      ],
    },
    {
      slug: 'la-famille-lecon-2',
      title: 'La famille élargie',
      subtitle: 'العم، الخال، العمة',
      order: 2,
      items: [
        { type: 'word', id: '3amm',    darija: 'عم',     latin: '3amm',    fr: 'Oncle paternel',  example: { darija: 'عمي عندو دار كبيرة',   fr: 'Mon oncle a une grande maison' } },
        { type: 'word', id: 'khal',    darija: 'خال',    latin: 'khal',    fr: 'Oncle maternel',  example: { darija: 'خالي ساكن في كازا',   fr: 'Mon oncle maternel vit à Casablanca' } },
        { type: 'word', id: '3amma',   darija: 'عمة',    latin: '3amma',   fr: 'Tante paternelle', example: { darija: 'عمتي مزيانة',          fr: 'Ma tante est gentille' } },
        { type: 'word', id: 'khala',   darija: 'خالة',   latin: 'khala',   fr: 'Tante maternelle', example: { darija: 'خالتي كتبيع الحوايج', fr: 'Ma tante vend des vêtements' } },
        { type: 'word', id: 'jedd',    darija: 'جد',     latin: 'jdd',     fr: 'Grand-père',       example: { darija: 'جدي عندو سبعين عام', fr: 'Mon grand-père a soixante-dix ans' } },
        { type: 'word', id: 'jedda',   darija: 'جدة',    latin: 'jdda',    fr: 'Grand-mère',       example: { darija: 'جدتي كتحب الكسكس',   fr: 'Ma grand-mère aime le couscous' } },
        { type: 'word', id: 'bnt_3amm',darija: 'بنت العم', latin: 'bnt l-3amm', fr: 'Cousine (côté paternel)', example: { darija: 'بنت عمي كتسكن معنا', fr: 'Ma cousine vit avec nous' } },
      ],
    },
    {
      slug: 'la-famille-lecon-3',
      title: 'Parler de sa famille',
      subtitle: 'عائلتي كبيرة',
      order: 3,
      items: [
        { type: 'phrase', id: '3a2ila_kbira',  darija: 'عائلتي كبيرة',         latin: '3a2ilti kbira',       fr: 'Ma famille est grande',         context: 'Décrire la taille de sa famille' },
        { type: 'phrase', id: 'wahd_wald',     darija: 'عندي واحد ولد',         latin: '3ndi wahed wld',       fr: "J'ai un fils",                  context: 'Parler de ses enfants' },
        { type: 'phrase', id: 'sans_freres',   darija: 'ما عندي خوا',           latin: 'ma 3ndi khwa',         fr: "Je n'ai pas de frères/sœurs",   context: 'Être fils/fille unique' },
        { type: 'phrase', id: 'mzuwwj',        darija: 'أنا مزوج',              latin: 'ana mzuwwj',           fr: 'Je suis marié(e)',              context: 'Parler de sa situation maritale' },
        { type: 'phrase', id: 'mazal_azri',    darija: 'مازال عزري',            latin: 'mazal 3azri',          fr: 'Je suis encore célibataire',    context: 'Parler de sa situation maritale' },
        { type: 'phrase', id: 'nsakno_m3a',    darija: 'كنسكنو مع بعضيات',     latin: 'knsakno m3a b3diyat', fr: 'Nous vivons ensemble',          context: 'Parler de la cohabitation' },
      ],
    },
  ],
};
