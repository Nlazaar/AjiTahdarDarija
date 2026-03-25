import type { Theme } from './types';

export const achatsTheme: Theme = {
  id: 'achats',
  slug: 'les-achats',
  title: 'Les Achats',
  description: 'Fais tes courses, marchande au souk et comprends les prix en Darija.',
  level: 3,
  icon: '🛍️',
  color: '#f4845f',
  lessons: [
    {
      slug: 'les-achats-lecon-1',
      title: 'Au souk',
      subtitle: 'فالسوق',
      order: 1,
      items: [
        { type: 'phrase', id: 'bchhal_hda',  darija: 'بشحال هدا؟',        latin: 'bchhal hda?',       fr: 'C\'est combien ?',          context: 'Pour demander le prix d\'un article' },
        { type: 'phrase', id: 'bghit_hda',   darija: 'بغيت هدا',          latin: 'bghit hda',         fr: 'Je veux ça',               context: 'Pour indiquer un article' },
        { type: 'word',   id: 'thaman',      darija: 'الثمن',              latin: 't-thaman',          fr: 'Le prix',                  example: { darija: 'الثمن ديالو كاش؟', fr: 'Quel est son prix ?' } },
        { type: 'word',   id: 'sla3',        darija: 'السلعة',             latin: 's-sla3',            fr: 'La marchandise',           example: { darija: 'السلعة مزيانة',      fr: 'La marchandise est bonne' } },
        { type: 'phrase', id: 'ghali_bzzaf', darija: 'غالي بزاف',         latin: 'ghali bzzaf',       fr: 'Trop cher',                context: 'Pour négocier le prix' },
        { type: 'phrase', id: 'nqs_shwiya',  darija: 'نقص شوية عفاك',     latin: 'nqes chwiya 3afak', fr: 'Baisse un peu s\'il te plaît', context: 'Pour marchander' },
      ],
    },
    {
      slug: 'les-achats-lecon-2',
      title: 'Marchander les prix',
      subtitle: 'المساومة',
      order: 2,
      items: [
        { type: 'phrase', id: 'akhir_thaman', darija: 'واش هدا آخر ثمن؟',  latin: 'wach hda akhir thaman?', fr: 'C\'est votre dernier prix ?', context: 'Pour vérifier si on peut négocier' },
        { type: 'phrase', id: 'nta_gbn',      darija: 'نتا كتغبن',          latin: 'nta kteghbn',      fr: 'Tu m\'arnaques',             context: 'En plaisantant pour négocier' },
        { type: 'phrase', id: 'wakha_khudha', darija: 'واخا، خودها',        latin: 'wakha, khudha',    fr: 'D\'accord, je la prends',   context: 'Pour accepter le prix final' },
        { type: 'word',   id: 'rbh',          darija: 'الربح',               latin: 'r-rbh',            fr: 'Le bénéfice / Le profit',   example: { darija: 'ما عندي ربح',        fr: 'Je ne fais pas de bénéfice' } },
        { type: 'phrase', id: '3ndek_zid',    darija: 'عندك زيد؟',          latin: '3ndek zid?',       fr: 'Tu en as d\'autres ?',       context: 'Demander plus de stock' },
        { type: 'phrase', id: 'kamel_hna',    darija: 'كامل هنا',           latin: 'kamel hna',        fr: 'C\'est tout ici',            context: 'Indiquer que l\'achat est terminé' },
      ],
    },
  ],
};
