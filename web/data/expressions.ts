import type { Theme } from './types';

export const expressionsTheme: Theme = {
  id: 'expressions',
  slug: 'expressions-idiomatiques',
  title: 'Expressions Idiomatiques',
  description: 'Maîtrise les expressions du quotidien et parle comme un vrai Marocain.',
  level: 4,
  icon: '💬',
  color: '#1b3a6b',
  lessons: [
    {
      slug: 'expressions-idiomatiques-lecon-1',
      title: 'Expressions du quotidien',
      subtitle: 'كلام ديال كل يوم',
      order: 1,
      items: [
        { type: 'phrase', id: 'bzzaf',      darija: 'بزاف',              latin: 'bzzaf',             fr: 'Beaucoup / Très',       context: 'Adverbe d\'intensité très courant' },
        { type: 'phrase', id: 'chwiya',     darija: 'شوية',              latin: 'chwiya',            fr: 'Un peu',                context: 'Diminutif, adverbe' },
        { type: 'phrase', id: 'kif_kif',    darija: 'كيف كيف',           latin: 'kif-kif',           fr: 'Pareil / Pareil',       context: 'Pour dire que c\'est la même chose' },
        { type: 'phrase', id: 'walo',       darija: 'والو',               latin: 'walo',              fr: 'Rien / Zéro',           context: 'Familier pour "rien"' },
        { type: 'phrase', id: 'mashi_mushkil',darija: 'ماشي مشكل',       latin: 'machi muchkil',     fr: 'Pas de problème',       context: 'Pour rassurer quelqu\'un' },
        { type: 'phrase', id: 'zwina_had',  darija: 'هدا مزيان!',        latin: 'hda mzyan!',        fr: 'C\'est bien ! / Super !', context: 'Pour exprimer la satisfaction' },
      ],
    },
    {
      slug: 'expressions-idiomatiques-lecon-2',
      title: 'Proverbes marocains',
      subtitle: 'الأمثال المغربية',
      order: 2,
      items: [
        { type: 'phrase', id: 'sbr_mftah', darija: 'الصبر مفتاح الفرج',  latin: 's-sbr mftah l-frj',  fr: 'La patience est la clé du bonheur', context: 'Proverbe très utilisé' },
        { type: 'phrase', id: 'dar_bla_mra', darija: 'دار بلا مرة',      latin: 'dar bla mra',         fr: 'Une maison sans femme (proverbe)', context: 'Sur l\'importance de la femme au foyer' },
        { type: 'phrase', id: 'bkri_wella', darija: 'بكري ولا بعدي',     latin: 'bkri wella b3di',     fr: 'Tôt ou tard',             context: 'Proverbe sur l\'inévitable' },
        { type: 'phrase', id: '3ql_qbl',    darija: 'العقل قبل النقل',    latin: 'l-3ql qbl n-nql',    fr: 'La raison avant tout',    context: 'Proverbe sur la réflexion' },
        { type: 'phrase', id: 'jarak_qbl',  darija: 'الجار قبل الدار',    latin: 'j-jar qbl d-dar',     fr: 'Le voisin avant la maison', context: 'Sur l\'importance du bon voisinage' },
        { type: 'phrase', id: 'hit_wlla',   darija: 'حيط ولا لا حيط',    latin: 'hit walla la hit',    fr: 'Mur ou pas mur',          context: 'L\'important est d\'avoir quelque chose' },
      ],
    },
    {
      slug: 'expressions-idiomatiques-lecon-3',
      title: 'Argot et langage jeune',
      subtitle: 'اللغة الشبابية',
      order: 3,
      items: [
        { type: 'phrase', id: '3zz',       darija: 'عزيزي',              latin: '3zizi',              fr: 'Mon cher / Mon pote',    context: 'Terme affectueux informel' },
        { type: 'phrase', id: 'sahbi',     darija: 'صاحبي',              latin: 'sahbi',              fr: 'Mon ami / Mon pote',     context: 'Très courant chez les jeunes' },
        { type: 'phrase', id: 'bghit_nft', darija: 'بغيت نفطر',         latin: 'bghit nftr',         fr: 'J\'ai trop faim / Je suis affamé', context: 'Expression familière' },
        { type: 'phrase', id: 'mzyan_had', darija: 'هادشي مزيان',        latin: 'hd-chi mzyan',       fr: 'C\'est cool / C\'est bien', context: 'Approbation informelle' },
        { type: 'phrase', id: 'dayiz',     darija: 'دايز',               latin: 'dayez',              fr: 'Passé / Fini / C\'est bon', context: 'Pour dire que quelque chose est fini ou OK' },
        { type: 'phrase', id: '3la_khir',  darija: 'على خير',            latin: '3la khir',           fr: 'En paix / Tout va bien', context: 'Pour se saluer ou prendre congé' },
      ],
    },
  ],
};
