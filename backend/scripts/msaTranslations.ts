/**
 * Dictionnaire curé Darija → MSA (arabe standard).
 *
 * Utilisation : appliqué par `applyMsaTranslations.ts` via exact-match sur
 * `vocabulary.word`. Quand `requireFr` est défini, on n'applique qu'aux vocabs
 * dont la traduction française contient ce token (désambiguïsation).
 *
 * Principes :
 *   - Le MSA est donné avec harakat complètes (fatha/kasra/damma/sukūn).
 *   - La translittération suit la convention scientifique courante
 *     (ā ī ū, ʿ pour ʿayn, ḥ/ṣ/ḍ/ṭ/ẓ pour les emphatiques, q, gh, sh, th,
 *     dh, kh), en minuscules.
 *   - Seules les entrées où l'équivalent MSA est certain figurent ici.
 *     Pour les mots douteux / polysémiques, on laisse le Darija tel quel :
 *     l'admin tranchera.
 */

export type MsaTranslation = {
  darija: string;       // match exact sur vocabulary.word
  msa: string;          // nouvelle valeur pour vocabulary.word
  translit: string;     // nouvelle valeur pour vocabulary.transliteration
  requireFr?: string;   // ne s'applique que si translation.fr inclut ce token (lowercased)
};

export const MSA_TRANSLATIONS: MsaTranslation[] = [
  // ─── Nombres 0-20 ───────────────────────────────────────────────────────
  { darija: 'صِفْر',          msa: 'صِفْر',          translit: 'ṣifr',           requireFr: 'zéro' },
  { darija: 'وَاحَد',         msa: 'وَاحِد',         translit: 'wāḥid' },
  { darija: 'جُوج',           msa: 'اِثْنَان',       translit: 'ithnān' },
  { darija: 'تْلَاتَة',       msa: 'ثَلَاثَة',       translit: 'thalātha' },
  { darija: 'رْبْعَة',         msa: 'أَرْبَعَة',      translit: 'arbaʿa' },
  { darija: 'خْمْسَة',         msa: 'خَمْسَة',        translit: 'khamsa' },
  { darija: 'سِتَّة',          msa: 'سِتَّة',          translit: 'sitta' },
  { darija: 'سْبْعَة',         msa: 'سَبْعَة',        translit: 'sabʿa' },
  { darija: 'تْمَانْيَة',      msa: 'ثَمَانِيَة',     translit: 'thamāniya' },
  { darija: 'تْسْعُود',        msa: 'تِسْعَة',         translit: 'tisʿa' },
  { darija: 'عْشْرَة',         msa: 'عَشَرَة',        translit: 'ʿashara' },
  { darija: 'حْدَاش',          msa: 'أَحَدَ عَشَر',    translit: 'aḥada ʿashar' },
  { darija: 'تْنَاش',          msa: 'اِثْنَا عَشَر',   translit: 'ithnā ʿashar' },
  { darija: 'تْلْطَاش',        msa: 'ثَلَاثَةَ عَشَر', translit: 'thalāthata ʿashar' },
  { darija: 'رْبْعْتَاش',      msa: 'أَرْبَعَةَ عَشَر', translit: 'arbaʿata ʿashar' },
  { darija: 'خْمْسْتَاش',      msa: 'خَمْسَةَ عَشَر',  translit: 'khamsata ʿashar' },
  { darija: 'سْتَاش',          msa: 'سِتَّةَ عَشَر',   translit: 'sittata ʿashar' },
  { darija: 'سْبْعْتَاش',      msa: 'سَبْعَةَ عَشَر',  translit: 'sabʿata ʿashar' },
  { darija: 'تْمَانْتَاش',     msa: 'ثَمَانِيَةَ عَشَر', translit: 'thamāniyata ʿashar' },
  { darija: 'تْسْعْتَاش',      msa: 'تِسْعَةَ عَشَر',  translit: 'tisʿata ʿashar' },

  // ─── Dizaines 20-90 ─────────────────────────────────────────────────────
  { darija: 'عْشْرِين',        msa: 'عِشْرُون',        translit: 'ʿishrūn' },
  { darija: 'تْلَاتِين',        msa: 'ثَلَاثُون',      translit: 'thalāthūn' },
  { darija: 'رْبْعِين',         msa: 'أَرْبَعُون',     translit: 'arbaʿūn' },
  { darija: 'خَمْسِين',         msa: 'خَمْسُون',       translit: 'khamsūn' },
  { darija: 'سْتِّين',          msa: 'سِتُّون',         translit: 'sittūn' },
  { darija: 'سْبْعِين',         msa: 'سَبْعُون',        translit: 'sabʿūn' },
  { darija: 'تْمَانِين',        msa: 'ثَمَانُون',       translit: 'thamānūn' },
  { darija: 'تْسْعِين',         msa: 'تِسْعُون',        translit: 'tisʿūn' },

  // ─── Centaines / milliers ───────────────────────────────────────────────
  { darija: 'مِيَّة',           msa: 'مِائَة',          translit: 'miʾa' },
  { darija: 'مِيتِين',          msa: 'مِائَتَان',       translit: 'miʾatān' },
  { darija: 'أَلْف',            msa: 'أَلْف',            translit: 'alf' },

  // ─── Salutations & politesse ────────────────────────────────────────────
  { darija: 'السَّلَامُ عَلَيْكُمْ', msa: 'السَّلَامُ عَلَيْكُمْ', translit: 'as-salāmu ʿalaykum' },
  { darija: 'وَعَلَيْكُمُ السَّلَامْ', msa: 'وَعَلَيْكُمُ السَّلَام',  translit: 'wa-ʿalaykumu s-salām' },
  { darija: 'صْبَاحْ الْخِيرْ',  msa: 'صَبَاحُ الْخَيْر',  translit: 'ṣabāḥu l-khayr' },
  { darija: 'مْسَا الْخِيرْ',     msa: 'مَسَاءُ الْخَيْر',  translit: 'masāʾu l-khayr' },
  { darija: 'الحَمْدُ لِلَّه',    msa: 'الْحَمْدُ لِلَّه',  translit: 'al-ḥamdu lillāh' },
  { darija: 'مَرْحَبَا',          msa: 'مَرْحَبًا',          translit: 'marḥaban' },
  { darija: 'أَهْلاً وَسَهْلاً',   msa: 'أَهْلاً وَسَهْلاً',   translit: 'ahlan wa-sahlan' },
  { darija: 'تَفَضَّل',           msa: 'تَفَضَّل',           translit: 'tafaḍḍal' },
  { darija: 'شُكْراً',            msa: 'شُكْراً',            translit: 'shukran' },
  { darija: 'عَفْوًا',            msa: 'عَفْوًا',            translit: 'ʿafwan' },
  { darija: 'مِنْ فَضْلِك',        msa: 'مِنْ فَضْلِك',        translit: 'min faḍlik' },
  { darija: 'بِسْمِ اللَّه',       msa: 'بِسْمِ اللَّه',       translit: 'bismillāh' },
  { darija: 'إِنْ شَاءَ اللَّه',    msa: 'إِنْ شَاءَ اللَّه',    translit: 'in shāʾa llāh' },

  // ─── Couleurs (gating FR pour désambiguïser) ────────────────────────────
  { darija: 'كْحَل',            msa: 'أَسْوَد',          translit: 'aswad',    requireFr: 'noir' },
  { darija: 'حْمَر',            msa: 'أَحْمَر',          translit: 'aḥmar',    requireFr: 'rouge' },
  { darija: 'زْرَق',            msa: 'أَزْرَق',          translit: 'azraq',    requireFr: 'bleu' },
  { darija: 'وَرْدِي',           msa: 'وَرْدِي',           translit: 'wardī',    requireFr: 'rose' },
  { darija: 'رْمَادِي',          msa: 'رَمَادِي',          translit: 'ramādī',   requireFr: 'gris' },
  { darija: 'بْنِي',             msa: 'بُنِّي',             translit: 'bunnī',    requireFr: 'marron' },
  { darija: 'بُرْتُقَالِي',       msa: 'بُرْتُقَالِي',       translit: 'burtuqālī', requireFr: 'orange' },
  { darija: 'بْنَفْسَجِي',        msa: 'بَنَفْسَجِي',        translit: 'banafsajī', requireFr: 'violet' },
  { darija: 'دْهَبِي',            msa: 'ذَهَبِي',            translit: 'dhahabī',  requireFr: 'doré' },
  { darija: 'فُضِّي',             msa: 'فِضِّي',             translit: 'fiḍḍī',    requireFr: 'argenté' },

  // ─── Jours de la semaine ────────────────────────────────────────────────
  { darija: 'الِاثْنِين',         msa: 'الِاثْنَيْن',         translit: 'al-ithnayn',   requireFr: 'lundi' },
  { darija: 'الثَّلَاثَاء',       msa: 'الثُّلَاثَاء',        translit: 'ath-thulāthāʾ', requireFr: 'mardi' },
  { darija: 'الْأَرْبَعَاء',      msa: 'الْأَرْبِعَاء',       translit: 'al-arbiʿāʾ',   requireFr: 'mercredi' },
  { darija: 'الْخَمِيس',          msa: 'الْخَمِيس',           translit: 'al-khamīs',    requireFr: 'jeudi' },
  { darija: 'الْجُمْعَة',         msa: 'الْجُمْعَة',          translit: 'al-jumʿa',     requireFr: 'vendredi' },
  { darija: 'السَّبْت',            msa: 'السَّبْت',            translit: 'as-sabt',      requireFr: 'samedi' },
  { darija: 'الْأَحَد',            msa: 'الْأَحَد',            translit: 'al-aḥad',      requireFr: 'dimanche' },

  // ─── Mois grégoriens ────────────────────────────────────────────────────
  { darija: 'يَنَايِر',            msa: 'يَنَايِر',             translit: 'yanāyir',    requireFr: 'janvier' },
  { darija: 'فِبْرَايِر',          msa: 'فِبْرَايِر',           translit: 'fibrāyir',   requireFr: 'février' },
  { darija: 'مَارِس',               msa: 'مَارِس',               translit: 'māris',      requireFr: 'mars' },
  { darija: 'أَبْرِيل',            msa: 'أَبْرِيل',             translit: 'abrīl',      requireFr: 'avril' },
  { darija: 'مَايُو',               msa: 'مَايُو',               translit: 'māyū',       requireFr: 'mai' },
  { darija: 'يُونِيُو',             msa: 'يُونِيُو',             translit: 'yūniyū',     requireFr: 'juin' },
  { darija: 'يُولِيُو',             msa: 'يُولِيُو',             translit: 'yūliyū',     requireFr: 'juillet' },
  { darija: 'غُشْت',                 msa: 'أَغُسْطُس',            translit: 'aghusṭus',   requireFr: 'août' },
  { darija: 'شُتَنْبِر',            msa: 'سِبْتَمْبِر',           translit: 'sibtambir',  requireFr: 'septembre' },
  { darija: 'أُكْتُوبِر',           msa: 'أُكْتُوبِر',           translit: 'uktūbir',    requireFr: 'octobre' },
  { darija: 'نُوَنْبِر',            msa: 'نُوفَمْبِر',           translit: 'nūfambir',   requireFr: 'novembre' },
  { darija: 'دُجَنْبِر',            msa: 'دِيسَمْبِر',           translit: 'dīsambir',   requireFr: 'décembre' },

  // ─── Famille (noyau sûr) ────────────────────────────────────────────────
  { darija: 'عَائِلَة',             msa: 'عَائِلَة',             translit: 'ʿāʾila',     requireFr: 'famille' },
  { darija: 'مَامَا',                msa: 'أُمّ',                 translit: 'umm',        requireFr: 'maman' },
  { darija: 'بَابَا',                msa: 'أَب',                  translit: 'ab',         requireFr: 'papa' },
  { darija: 'خْت',                   msa: 'أُخْت',                translit: 'ukht',       requireFr: 'sœur' },
  { darija: 'خُو',                   msa: 'أَخ',                  translit: 'akh',        requireFr: 'frère' },
  { darija: 'وْلْد',                 msa: 'اِبْن',                translit: 'ibn',        requireFr: 'fils' },
  { darija: 'بْنْت',                 msa: 'بِنْت',                translit: 'bint',       requireFr: 'fille' },
  { darija: 'طْفْل',                 msa: 'طِفْل',                translit: 'ṭifl',       requireFr: 'enfant' },
  { darija: 'رْضِيع',                msa: 'رَضِيع',               translit: 'raḍīʿ',      requireFr: 'bébé' },
  { darija: 'جَدّ',                  msa: 'جَدّ',                 translit: 'jadd',       requireFr: 'grand-père' },
  { darija: 'جَدَّة',                msa: 'جَدَّة',               translit: 'jadda',      requireFr: 'grand-mère' },
  { darija: 'زُوج',                  msa: 'زَوْج',                translit: 'zawj',       requireFr: 'mari' },
  { darija: 'مْرَا',                 msa: 'زَوْجَة',              translit: 'zawja',      requireFr: 'épouse' },

  // ─── Basiques polyvalents ───────────────────────────────────────────────
  { darija: 'نَعَم',                 msa: 'نَعَم',                 translit: 'naʿam',     requireFr: 'oui' },
  { darija: 'لَا',                   msa: 'لَا',                   translit: 'lā',        requireFr: 'non' },
  { darija: 'أَنَا',                  msa: 'أَنَا',                  translit: 'anā',      requireFr: 'je' },
  { darija: 'أَنْتَ',                 msa: 'أَنْتَ',                 translit: 'anta',     requireFr: 'tu' },
  { darija: 'هُوَ',                   msa: 'هُوَ',                   translit: 'huwa',     requireFr: 'il' },
  { darija: 'هِيَ',                   msa: 'هِيَ',                   translit: 'hiya',     requireFr: 'elle' },
  { darija: 'نَحْنُ',                 msa: 'نَحْنُ',                 translit: 'naḥnu',    requireFr: 'nous' },

  // ─── Temps ──────────────────────────────────────────────────────────────
  { darija: 'الْيَوْم',              msa: 'الْيَوْم',              translit: 'al-yawm',   requireFr: "aujourd'hui" },
  { darija: 'أَمْس',                  msa: 'أَمْس',                  translit: 'ams',      requireFr: 'hier' },
  { darija: 'غَدًا',                  msa: 'غَدًا',                  translit: 'ghadan',   requireFr: 'demain' },
  { darija: 'سَنَة',                  msa: 'سَنَة',                  translit: 'sana',     requireFr: 'année' },
  { darija: 'شَهْر',                  msa: 'شَهْر',                  translit: 'shahr',    requireFr: 'mois' },
  { darija: 'أُسْبُوع',               msa: 'أُسْبُوع',               translit: 'usbūʿ',    requireFr: 'semaine' },
  { darija: 'يَوْم',                   msa: 'يَوْم',                   translit: 'yawm',    requireFr: 'jour' },
  { darija: 'سَاعَة',                 msa: 'سَاعَة',                 translit: 'sāʿa',    requireFr: 'heure' },
];

// Sanity check : aucun doublon sur (darija + requireFr)
if (process.env.VERIFY_DICT === '1') {
  const seen = new Set<string>();
  for (const t of MSA_TRANSLATIONS) {
    const key = `${t.darija}::${t.requireFr ?? ''}`;
    if (seen.has(key)) {
      console.error(`⚠  Doublon dans MSA_TRANSLATIONS : ${key}`);
    }
    seen.add(key);
  }
  console.log(`✓ ${MSA_TRANSLATIONS.length} entrées, ${seen.size} clefs uniques`);
}
