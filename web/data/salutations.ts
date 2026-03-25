import type { Theme } from './types';

export const salutationsTheme: Theme = {
  id: 'salutations',
  slug: 'salutations-darija',
  title: 'Les Salutations',
  description: 'Apprends à saluer, remercier et prendre congé en Darija marocain.',
  level: 1,
  icon: '👋',
  color: '#e76f51',
  lessons: [
    {
      slug: 'salutations-darija-lecon-1',
      title: 'Bonjour et au revoir',
      subtitle: 'سلام / بسلامة',
      order: 1,
      items: [
        { type: 'word', id: 'salam',        darija: 'سلام',          latin: 'salam',         fr: 'Salut / Bonjour',       example: { darija: 'سلام، كيداير؟',          fr: 'Salut, comment vas-tu ?' } },
        { type: 'word', id: 'marhba',       darija: 'مرحبا',         latin: 'marhba',        fr: 'Bienvenue / Bonjour',   example: { darija: 'مرحبا بيك!',             fr: 'Bienvenue !' } },
        { type: 'word', id: 'salam3likoum', darija: 'السلام عليكم',  latin: 'salam 3likoum', fr: 'Paix sur vous',         example: { darija: 'السلام عليكم يا صاحبي!', fr: 'Bonjour mon ami !' } },
        { type: 'word', id: 'sbah_lkhir',   darija: 'صباح الخير',    latin: 'sbah lkhir',    fr: 'Bonjour (matin)',       example: { darija: 'صباح الخير، لاباس؟',     fr: 'Bonjour, ça va ?' } },
        { type: 'word', id: 'msa_lkhir',    darija: 'مسا الخير',     latin: 'msa lkhir',     fr: 'Bonsoir',               example: { darija: 'مسا الخير يا لالة',       fr: 'Bonsoir madame' } },
        { type: 'word', id: 'bslama',       darija: 'بسلامة',        latin: 'bslama',        fr: 'Au revoir',             example: { darija: 'بسلامة، غدا نشوفك',       fr: 'Au revoir, à demain' } },
      ],
    },
    {
      slug: 'salutations-darija-lecon-2',
      title: 'Comment ça va ?',
      subtitle: 'كيداير؟ / لاباس؟',
      order: 2,
      items: [
        { type: 'word', id: 'kidayr',  darija: 'كيداير',   latin: 'kidayr',   fr: 'Comment vas-tu ? (m)', example: { darija: 'كيداير، لاباس؟',          fr: 'Comment vas-tu, ça va ?' } },
        { type: 'word', id: 'kidayra', darija: 'كيدايرة',  latin: 'kidayra',  fr: 'Comment vas-tu ? (f)', example: { darija: 'كيدايرة نتي؟',            fr: 'Et toi, comment tu vas ?' } },
        { type: 'word', id: 'labas',   darija: 'لاباس',    latin: 'labas',    fr: 'Ça va / Pas de mal',   example: { darija: 'لاباس، شكرا',             fr: 'Ça va, merci' } },
        { type: 'word', id: 'bkhir',   darija: 'بخير',     latin: 'bkhir',    fr: 'Bien / En bonne santé', example: { darija: 'أنا بخير، شكرا',          fr: 'Je vais bien, merci' } },
        { type: 'word', id: 'lhmdllh', darija: 'الحمد لله', latin: 'lhamdullah', fr: 'Dieu merci (réponse)', example: { darija: 'كيداير؟ — الحمد لله',    fr: 'Comment vas-tu ? — Dieu merci' } },
        { type: 'word', id: 'wakha',   darija: 'واخا',     latin: 'wakha',    fr: "D'accord / OK",        example: { darija: 'واخا، غدا نجي',           fr: "D'accord, je viendrai demain" } },
      ],
    },
    {
      slug: 'salutations-darija-lecon-3',
      title: 'Merci et politesse',
      subtitle: 'شكرا / عفاك / سمح ليا',
      order: 3,
      items: [
        { type: 'word', id: 'chokran',   darija: 'شكرا',    latin: 'chokran',   fr: 'Merci',                example: { darija: 'شكرا بزاف!',             fr: 'Merci beaucoup !' } },
        { type: 'word', id: 'chokran_bzzaf', darija: 'شكرا بزاف', latin: 'chokran bzzaf', fr: 'Merci beaucoup', example: { darija: 'شكرا بزاف على مساعدتك', fr: 'Merci beaucoup pour ton aide' } },
        { type: 'word', id: '3afak',     darija: 'عفاك',    latin: '3afak',     fr: "S'il te plaît",        example: { darija: 'عفاك، واش عندك الوقت؟',  fr: "S'il te plaît, as-tu l'heure ?" } },
        { type: 'word', id: 'smahli',    darija: 'سمحلي',   latin: 'smahli',    fr: 'Excuse-moi / Pardon',  example: { darija: 'سمحلي، مافهمتش',         fr: "Excuse-moi, je n'ai pas compris" } },
        { type: 'word', id: 'la_shukr',  darija: 'لا شكرا', latin: 'la chokran', fr: 'Non merci',           example: { darija: 'لا شكرا، أنا شبعت',      fr: "Non merci, j'ai assez mangé" } },
        { type: 'word', id: 'bla_jmil',  darija: 'بلا جميل', latin: 'bla jmil', fr: "De rien / Il n'y a pas de quoi", example: { darija: 'شكرا! — بلا جميل', fr: 'Merci ! — De rien' } },
      ],
    },
    {
      slug: 'salutations-darija-lecon-4',
      title: 'Formules religieuses',
      subtitle: 'إنشالله / الحمد لله / بسم الله',
      order: 4,
      items: [
        { type: 'phrase', id: 'inchallah',  darija: 'إنشالله',   latin: 'inchallah',   fr: 'Si Dieu le veut',      context: 'Pour exprimer un espoir ou une promesse' },
        { type: 'phrase', id: 'lhamdullah', darija: 'الحمد لله', latin: 'lhamdullah',  fr: 'Grâce à Dieu',         context: 'Pour exprimer sa gratitude ou répondre à "comment vas-tu ?"' },
        { type: 'phrase', id: 'bismillah',  darija: 'بسم الله',  latin: 'bismillah',   fr: 'Au nom de Dieu',       context: 'Avant de commencer quelque chose (manger, conduire...)' },
        { type: 'phrase', id: 'mchallah',   darija: 'ماشاالله',  latin: 'machallah',   fr: "Comme Dieu l'a voulu", context: "Pour exprimer l'admiration ou protéger du mauvais œil" },
        { type: 'phrase', id: 'baraka',     darija: 'بارك الله فيك', latin: 'barak llahu fik', fr: 'Que Dieu te bénisse', context: 'Pour remercier chaleureusement' },
        { type: 'phrase', id: 'hamdullah',  darija: 'حمد الله',  latin: 'hamdullah',   fr: 'Dieu merci (court)',   context: 'Forme courte de "alhamdullah"' },
      ],
    },
  ],
};
