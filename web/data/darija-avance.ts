import type { Theme } from './types';

export const darijaAvanceTheme: Theme = {
  id: 'darija-avance',
  slug: 'darija-avance',
  title: 'Darija Avancé',
  description: 'Atteignez la fluidité en Darija : phrases complexes, nuances et expressivité.',
  level: 4,
  icon: '🎓',
  color: '#4a4e69',
  lessons: [
    {
      slug: 'darija-avance-lecon-1',
      title: 'Construire des phrases',
      subtitle: 'بناء الجمل',
      order: 1,
      items: [
        { type: 'phrase', id: 'mlli',      darija: 'ملي جيت...',         latin: 'mlli jit...',        fr: 'Quand je suis venu(e)...',  context: 'Pour exprimer une action passée' },
        { type: 'phrase', id: 'ila_kan',   darija: 'إلا كان...',          latin: 'ila kan...',         fr: 'Si c\'était...',             context: 'Conditionnel passé' },
        { type: 'phrase', id: 'bhal_ma',   darija: 'بحال ما...',          latin: 'bhal ma...',         fr: 'Comme si...',               context: 'Pour faire une comparaison' },
        { type: 'phrase', id: '3la_hsab',  darija: 'على حساب ما...',      latin: '3la hsab ma...',     fr: 'Selon / D\'après...',       context: 'Pour rapporter un fait' },
        { type: 'phrase', id: 'hta_ila',   darija: 'حتى ولو...',          latin: 'htta wlaw...',       fr: 'Même si...',                context: 'Concessif' },
        { type: 'phrase', id: 'b_sabab',   darija: 'بسبب...',             latin: 'b-sabab...',         fr: 'À cause de / En raison de...', context: 'Pour exprimer la cause' },
      ],
    },
    {
      slug: 'darija-avance-lecon-2',
      title: 'Nuances et émotions',
      subtitle: 'المشاعر والتعبير',
      order: 2,
      items: [
        { type: 'phrase', id: 'ferhan',    darija: 'أنا فرحان بزاف',     latin: 'ana frhan bzzaf',    fr: 'Je suis très content(e)',   context: 'Exprimer la joie' },
        { type: 'phrase', id: 'mhzun',     darija: 'أنا محزون',           latin: 'ana mhzun',          fr: 'Je suis triste',            context: 'Exprimer la tristesse' },
        { type: 'phrase', id: 'ghzin',     darija: 'أنا غاضب',           latin: 'ana ghadb',          fr: 'Je suis en colère',         context: 'Exprimer la colère' },
        { type: 'phrase', id: '3jbni',     darija: 'عجبني هدشي',         latin: '3jbni hd-chi',       fr: 'Ça m\'a plu',              context: 'Exprimer l\'appréciation' },
        { type: 'phrase', id: 'ma_3jbni',  darija: 'ما عجبنيش',          latin: 'ma 3jbniich',        fr: 'Ça ne m\'a pas plu',       context: 'Exprimer le mécontentement' },
        { type: 'phrase', id: 'khasni',    darija: 'خاصني نفكر',         latin: 'khassni nfkr',       fr: 'Je dois réfléchir',         context: 'Pour prendre du recul' },
      ],
    },
    {
      slug: 'darija-avance-lecon-3',
      title: 'Conversations fluides',
      subtitle: 'محادثات طبيعية',
      order: 3,
      items: [
        { type: 'phrase', id: 'a3qel',     darija: 'فهمت؟ / فاهم؟',      latin: 'fhmt? / fahm?',      fr: 'Tu comprends ? / Compris ?', context: 'Pour vérifier la compréhension' },
        { type: 'phrase', id: 'wqila',     darija: 'والله ما عرفت',       latin: 'wallah ma 3rft',     fr: 'Franchement je ne sais pas', context: 'Expression d\'honnêteté' },
        { type: 'phrase', id: 'hssn',      darija: 'ردد عليا عفاك',       latin: 'rdded 3liya 3afak',  fr: 'Répète s\'il te plaît',     context: 'Pour demander une répétition' },
        { type: 'phrase', id: 'bta3da',    darija: 'بطأ شوية عفاك',       latin: 'bt2a chwiya 3afak',  fr: 'Parle plus lentement s\'il te plaît', context: 'Pour demander de ralentir' },
        { type: 'phrase', id: 'darija_fqt', darija: 'قول ليا بالعربي',   latin: 'qul liya b-l-3rbi',  fr: 'Dis-le moi en arabe',       context: 'Pour demander une traduction' },
        { type: 'phrase', id: 'mzyan_hdr', darija: 'كتهضر مزيان بالدارجة', latin: 'kthddr mzyan b-d-darija', fr: 'Tu parles bien le darija', context: 'Complimenter la maîtrise de la langue' },
      ],
    },
  ],
};
