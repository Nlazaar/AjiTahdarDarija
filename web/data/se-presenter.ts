import type { Theme } from './types';

export const sePresentertTheme: Theme = {
  id: 'se-presenter',
  slug: 'se-presenter',
  title: 'Se Présenter',
  description: 'Apprends à te présenter : ton prénom, ta nationalité, ton âge et ton métier.',
  level: 1,
  icon: '🙋',
  color: '#e9a84c',
  lessons: [
    {
      slug: 'se-presenter-lecon-1',
      title: 'Mon prénom',
      subtitle: 'شنو سميتك؟',
      order: 1,
      items: [
        { type: 'phrase', id: 'chnu_smitek',  darija: 'شنو سميتك؟',    latin: 'chnu smitek?',    fr: 'Comment tu t\'appelles ?', context: 'Pour demander le prénom de quelqu\'un' },
        { type: 'phrase', id: 'smiti',         darija: 'سميتي...',       latin: 'smiti...',         fr: 'Je m\'appelle...',          context: 'Pour dire son prénom' },
        { type: 'phrase', id: 'motcharfin',    darija: 'متشرفين',        latin: 'motcharfin',       fr: 'Enchanté(e)',               context: 'Après une présentation' },
        { type: 'word',   id: 'ana',           darija: 'أنا',            latin: 'ana',              fr: 'Je / Moi',                 example: { darija: 'أنا اسمي كريم', fr: 'Je m\'appelle Karim' } },
        { type: 'word',   id: 'nta',           darija: 'نتا',            latin: 'nta',              fr: 'Toi (m)',                  example: { darija: 'نتا منين؟', fr: 'Toi, d\'où viens-tu ?' } },
        { type: 'word',   id: 'nti',           darija: 'نتي',            latin: 'nti',              fr: 'Toi (f)',                  example: { darija: 'نتي كيدايرة؟', fr: 'Toi, comment vas-tu ?' } },
      ],
    },
    {
      slug: 'se-presenter-lecon-2',
      title: 'Ma nationalité',
      subtitle: 'منين نتا؟',
      order: 2,
      items: [
        { type: 'phrase', id: 'mnin_nta',    darija: 'منين نتا؟',      latin: 'mnin nta?',        fr: 'D\'où viens-tu ?',         context: 'Pour demander la nationalité/origine' },
        { type: 'phrase', id: 'ana_mn',      darija: 'أنا من...',       latin: 'ana mn...',         fr: 'Je suis de...',            context: 'Pour dire son pays d\'origine' },
        { type: 'word',   id: 'maghrib',     darija: 'المغرب',          latin: 'l-maghrib',         fr: 'Maroc',                   example: { darija: 'أنا من المغرب', fr: 'Je suis du Maroc' } },
        { type: 'word',   id: 'fransa',      darija: 'فرانسا',          latin: 'fransa',            fr: 'France',                  example: { darija: 'جيت من فرانسا', fr: 'Je viens de France' } },
        { type: 'word',   id: 'maghribi',    darija: 'مغربي',           latin: 'maghribi',          fr: 'Marocain(e)',             example: { darija: 'أنا مغربي', fr: 'Je suis marocain' } },
        { type: 'word',   id: 'fransawi',    darija: 'فرانساوي',        latin: 'fransawi',          fr: 'Français(e)',             example: { darija: 'هو فرانساوي', fr: 'Il est français' } },
      ],
    },
    {
      slug: 'se-presenter-lecon-3',
      title: 'Mon âge',
      subtitle: 'شحال عندك؟',
      order: 3,
      items: [
        { type: 'phrase', id: 'chhal_3ndek', darija: 'شحال عندك من العام؟', latin: 'chhal 3ndek mn l-3am?', fr: 'Quel âge as-tu ?', context: 'Pour demander l\'âge' },
        { type: 'phrase', id: '3ndi',        darija: 'عندي... عام',      latin: '3ndi... 3am',       fr: "J'ai ... ans",             context: 'Pour dire son âge' },
        { type: 'word',   id: '3am',         darija: 'عام',              latin: '3am',               fr: 'Année / An',              example: { darija: 'عندي عشرين عام', fr: "J'ai vingt ans" } },
        { type: 'word',   id: 'kbir',        darija: 'كبير',             latin: 'kbir',              fr: 'Grand / Vieux',           example: { darija: 'هو كبير', fr: 'Il est grand / vieux' } },
        { type: 'word',   id: 'sghir',       darija: 'صغير',             latin: 'sghir',             fr: 'Petit / Jeune',           example: { darija: 'هي صغيرة', fr: 'Elle est jeune / petite' } },
        { type: 'phrase', id: 'born_in',     darija: 'ولدت فعام...',     latin: 'wuldt f-3am...',    fr: 'Je suis né(e) en...',      context: 'Pour dire son année de naissance' },
      ],
    },
    {
      slug: 'se-presenter-lecon-4',
      title: 'Mon métier',
      subtitle: 'أشنو كتخدم؟',
      order: 4,
      items: [
        { type: 'phrase', id: 'chnu_ktkhdm', darija: 'أشنو كتخدم؟',   latin: 'achnu ktkhdm?',    fr: 'Que fais-tu comme travail ?', context: 'Pour demander la profession' },
        { type: 'phrase', id: 'ana_khddam',  darija: 'أنا خدام في...', latin: 'ana khddam fi...', fr: 'Je travaille dans...',         context: 'Pour parler de son secteur' },
        { type: 'word',   id: 'tabib',       darija: 'طبيب',           latin: 'tabib',             fr: 'Médecin',                     example: { darija: 'هو طبيب', fr: 'Il est médecin' } },
        { type: 'word',   id: 'mudarris',    darija: 'مدرس',           latin: 'mudarris',          fr: 'Professeur',                  example: { darija: 'أنا مدرس', fr: 'Je suis professeur' } },
        { type: 'word',   id: 'muhandis',    darija: 'مهندس',          latin: 'muhandis',          fr: 'Ingénieur',                   example: { darija: 'هي مهندسة', fr: 'Elle est ingénieure' } },
        { type: 'word',   id: 'taleb',       darija: 'طالب',           latin: 'taleb',             fr: 'Étudiant(e)',                 example: { darija: 'أنا طالب', fr: 'Je suis étudiant' } },
      ],
    },
  ],
};
