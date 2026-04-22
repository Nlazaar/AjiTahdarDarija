export interface ArabCity {
  key: string
  order: number
  nameFr: string
  nameAr: string
  transliteration: string
  lat: number
  lng: number
  country: string
  countryAr: string
}

/**
 * 51 villes du monde arabe, ordonnées du Maghreb (Maroc) vers l'Orient
 * (Jordanie), pour le parcours pédagogique MSA. Couvre les 22 pays de la
 * Ligue arabe avec capitale + 1–4 villes historiques.
 */
export const ARAB_CITIES: ArabCity[] = [
  { key: 'fes',            order: 1,  nameFr: 'Fès',          nameAr: 'فاس',            transliteration: 'fās',            lat: 34.0181, lng: -5.0078,  country: 'Maroc',             countryAr: 'المغرب' },
  { key: 'rabat',          order: 2,  nameFr: 'Rabat',        nameAr: 'الرباط',         transliteration: 'ar-ribāṭ',       lat: 34.0209, lng: -6.8416,  country: 'Maroc',             countryAr: 'المغرب' },
  { key: 'marrakech',      order: 3,  nameFr: 'Marrakech',    nameAr: 'مراكش',          transliteration: 'marrākish',      lat: 31.6295, lng: -7.9811,  country: 'Maroc',             countryAr: 'المغرب' },
  { key: 'nouakchott',     order: 4,  nameFr: 'Nouakchott',   nameAr: 'نواكشوط',        transliteration: 'nūākshūṭ',       lat: 18.0735, lng: -15.9582, country: 'Mauritanie',        countryAr: 'موريتانيا' },
  { key: 'chinguetti',     order: 5,  nameFr: 'Chinguetti',   nameAr: 'شنقيط',          transliteration: 'shinqīṭ',        lat: 20.4622, lng: -12.3647, country: 'Mauritanie',        countryAr: 'موريتانيا' },
  { key: 'tlemcen',        order: 6,  nameFr: 'Tlemcen',      nameAr: 'تلمسان',         transliteration: 'tilimsān',       lat: 34.8828, lng: -1.3150,  country: 'Algérie',           countryAr: 'الجزائر' },
  { key: 'alger',          order: 7,  nameFr: 'Alger',        nameAr: 'الجزائر',        transliteration: 'al-jazā\u02beir', lat: 36.7538, lng: 3.0588,   country: 'Algérie',           countryAr: 'الجزائر' },
  { key: 'constantine',    order: 8,  nameFr: 'Constantine',  nameAr: 'قسنطينة',        transliteration: 'qasanṭīna',      lat: 36.3650, lng: 6.6147,   country: 'Algérie',           countryAr: 'الجزائر' },
  { key: 'tunis',          order: 9,  nameFr: 'Tunis',        nameAr: 'تونس',           transliteration: 'tūnis',          lat: 36.8065, lng: 10.1815,  country: 'Tunisie',           countryAr: 'تونس' },
  { key: 'kairouan',       order: 10, nameFr: 'Kairouan',     nameAr: 'القيروان',       transliteration: 'al-qayrawān',    lat: 35.6781, lng: 10.0963,  country: 'Tunisie',           countryAr: 'تونس' },
  { key: 'tripoli',        order: 11, nameFr: 'Tripoli',      nameAr: 'طرابلس',         transliteration: 'ṭarābulus',      lat: 32.8872, lng: 13.1913,  country: 'Libye',             countryAr: 'ليبيا' },
  { key: 'ghadames',       order: 12, nameFr: 'Ghadamès',     nameAr: 'غدامس',          transliteration: 'ghadāmis',       lat: 30.1339, lng: 9.4950,   country: 'Libye',             countryAr: 'ليبيا' },
  { key: 'alexandrie',     order: 13, nameFr: 'Alexandrie',   nameAr: 'الإسكندرية',     transliteration: 'al-iskandariyya', lat: 31.2001, lng: 29.9187, country: 'Égypte',            countryAr: 'مصر' },
  { key: 'lecaire',        order: 14, nameFr: 'Le Caire',     nameAr: 'القاهرة',        transliteration: 'al-qāhira',      lat: 30.0444, lng: 31.2357,  country: 'Égypte',            countryAr: 'مصر' },
  { key: 'assouan',        order: 15, nameFr: 'Assouan',      nameAr: 'أسوان',          transliteration: 'aswān',          lat: 24.0889, lng: 32.8998,  country: 'Égypte',            countryAr: 'مصر' },
  { key: 'khartoum',       order: 16, nameFr: 'Khartoum',     nameAr: 'الخرطوم',        transliteration: 'al-kharṭūm',     lat: 15.5007, lng: 32.5599,  country: 'Soudan',            countryAr: 'السودان' },
  { key: 'omdurman',       order: 17, nameFr: 'Omdurman',     nameAr: 'أم درمان',       transliteration: 'umm durmān',     lat: 15.6445, lng: 32.4771,  country: 'Soudan',            countryAr: 'السودان' },
  { key: 'djibouti',       order: 18, nameFr: 'Djibouti',     nameAr: 'جيبوتي',         transliteration: 'jībūtī',         lat: 11.8251, lng: 42.5903,  country: 'Djibouti',          countryAr: 'جيبوتي' },
  { key: 'mogadiscio',     order: 19, nameFr: 'Mogadiscio',   nameAr: 'مقديشو',         transliteration: 'maqadīshū',      lat: 2.0469,  lng: 45.3182,  country: 'Somalie',           countryAr: 'الصومال' },
  { key: 'moroni',         order: 20, nameFr: 'Moroni',       nameAr: 'موروني',         transliteration: 'mūrūnī',         lat: -11.7172, lng: 43.2473, country: 'Comores',           countryAr: 'جزر القمر' },
  { key: 'aden',           order: 21, nameFr: 'Aden',         nameAr: 'عدن',            transliteration: '\u02bfadan',       lat: 12.7855, lng: 45.0186,  country: 'Yémen',             countryAr: 'اليمن' },
  { key: 'sanaa',          order: 22, nameFr: 'Sanaa',        nameAr: 'صنعاء',          transliteration: 'ṣan\u02bfā\u02be', lat: 15.3694, lng: 44.1910, country: 'Yémen',             countryAr: 'اليمن' },
  { key: 'mascate',        order: 23, nameFr: 'Mascate',      nameAr: 'مسقط',           transliteration: 'masqaṭ',         lat: 23.5859, lng: 58.4059,  country: 'Oman',              countryAr: 'عمان' },
  { key: 'nizwa',          order: 24, nameFr: 'Nizwa',        nameAr: 'نزوى',           transliteration: 'nizwā',          lat: 22.9333, lng: 57.5333,  country: 'Oman',              countryAr: 'عمان' },
  { key: 'abudhabi',       order: 25, nameFr: 'Abu Dhabi',    nameAr: 'أبو ظبي',        transliteration: 'abū ẓabī',       lat: 24.4539, lng: 54.3773,  country: 'Émirats arabes unis', countryAr: 'الإمارات' },
  { key: 'dubai',          order: 26, nameFr: 'Dubaï',        nameAr: 'دبي',            transliteration: 'dubai',          lat: 25.2048, lng: 55.2708,  country: 'Émirats arabes unis', countryAr: 'الإمارات' },
  { key: 'chardjah',       order: 27, nameFr: 'Chardjah',     nameAr: 'الشارقة',        transliteration: 'ash-shāriqa',    lat: 25.3463, lng: 55.4209,  country: 'Émirats arabes unis', countryAr: 'الإمارات' },
  { key: 'doha',           order: 28, nameFr: 'Doha',         nameAr: 'الدوحة',         transliteration: 'ad-dawḥa',       lat: 25.2854, lng: 51.5310,  country: 'Qatar',             countryAr: 'قطر' },
  { key: 'manama',         order: 29, nameFr: 'Manama',       nameAr: 'المنامة',        transliteration: 'al-manāma',      lat: 26.2285, lng: 50.5860,  country: 'Bahreïn',           countryAr: 'البحرين' },
  { key: 'koweit',         order: 30, nameFr: 'Koweït City',  nameAr: 'مدينة الكويت',   transliteration: 'madīnat al-kuwayt', lat: 29.3759, lng: 47.9774, country: 'Koweït',            countryAr: 'الكويت' },
  { key: 'djeddah',        order: 31, nameFr: 'Djeddah',      nameAr: 'جدة',            transliteration: 'jidda',          lat: 21.4858, lng: 39.1925,  country: 'Arabie saoudite',   countryAr: 'السعودية' },
  { key: 'lamecque',       order: 32, nameFr: 'La Mecque',    nameAr: 'مكة المكرمة',    transliteration: 'makka',          lat: 21.3891, lng: 39.8579,  country: 'Arabie saoudite',   countryAr: 'السعودية' },
  { key: 'medine',         order: 33, nameFr: 'Médine',       nameAr: 'المدينة المنورة', transliteration: 'al-madīna',      lat: 24.5247, lng: 39.5692,  country: 'Arabie saoudite',   countryAr: 'السعودية' },
  { key: 'riyad',          order: 34, nameFr: 'Riyad',        nameAr: 'الرياض',         transliteration: 'ar-riyāḍ',       lat: 24.7136, lng: 46.6753,  country: 'Arabie saoudite',   countryAr: 'السعودية' },
  { key: 'basra',          order: 35, nameFr: 'Basra',        nameAr: 'البصرة',         transliteration: 'al-baṣra',       lat: 30.5085, lng: 47.7804,  country: 'Irak',              countryAr: 'العراق' },
  { key: 'kerbala',        order: 36, nameFr: 'Kerbala',      nameAr: 'كربلاء',         transliteration: 'karbalā\u02be',    lat: 32.6160, lng: 44.0246, country: 'Irak',              countryAr: 'العراق' },
  { key: 'najaf',          order: 37, nameFr: 'Najaf',        nameAr: 'النجف',          transliteration: 'an-najaf',       lat: 31.9909, lng: 44.3275,  country: 'Irak',              countryAr: 'العراق' },
  { key: 'bagdad',         order: 38, nameFr: 'Bagdad',       nameAr: 'بغداد',          transliteration: 'baghdād',        lat: 33.3152, lng: 44.3661,  country: 'Irak',              countryAr: 'العراق' },
  { key: 'samarra',        order: 39, nameFr: 'Samarra',      nameAr: 'سامراء',         transliteration: 'sāmarrā\u02be',    lat: 34.1983, lng: 43.8745, country: 'Irak',              countryAr: 'العراق' },
  { key: 'damas',          order: 40, nameFr: 'Damas',        nameAr: 'دمشق',           transliteration: 'dimashq',        lat: 33.5138, lng: 36.2765,  country: 'Syrie',             countryAr: 'سوريا' },
  { key: 'homs',           order: 41, nameFr: 'Homs',         nameAr: 'حمص',            transliteration: 'ḥimṣ',           lat: 34.7324, lng: 36.7137,  country: 'Syrie',             countryAr: 'سوريا' },
  { key: 'palmyre',        order: 42, nameFr: 'Palmyre',      nameAr: 'تدمر',           transliteration: 'tadmur',         lat: 34.5623, lng: 38.2841,  country: 'Syrie',             countryAr: 'سوريا' },
  { key: 'alep',           order: 43, nameFr: 'Alep',         nameAr: 'حلب',            transliteration: 'ḥalab',          lat: 36.2021, lng: 37.1343,  country: 'Syrie',             countryAr: 'سوريا' },
  { key: 'beyrouth',       order: 44, nameFr: 'Beyrouth',     nameAr: 'بيروت',          transliteration: 'bayrūt',         lat: 33.8938, lng: 35.5018,  country: 'Liban',             countryAr: 'لبنان' },
  { key: 'baalbek',        order: 45, nameFr: 'Baalbek',      nameAr: 'بعلبك',          transliteration: 'ba\u02fblabakk',   lat: 34.0058, lng: 36.2170, country: 'Liban',             countryAr: 'لبنان' },
  { key: 'jerusalem',      order: 46, nameFr: 'Jérusalem',    nameAr: 'القدس',          transliteration: 'al-quds',        lat: 31.7683, lng: 35.2137,  country: 'Palestine',         countryAr: 'فلسطين' },
  { key: 'bethleem',       order: 47, nameFr: 'Bethléem',     nameAr: 'بيت لحم',        transliteration: 'bayt laḥm',      lat: 31.7054, lng: 35.2024,  country: 'Palestine',         countryAr: 'فلسطين' },
  { key: 'hebron',         order: 48, nameFr: 'Hébron',       nameAr: 'الخليل',         transliteration: 'al-khalīl',      lat: 31.5326, lng: 35.0998,  country: 'Palestine',         countryAr: 'فلسطين' },
  { key: 'ramallah',       order: 49, nameFr: 'Ramallah',     nameAr: 'رام الله',       transliteration: 'rām allāh',      lat: 31.9073, lng: 35.2044,  country: 'Palestine',         countryAr: 'فلسطين' },
  { key: 'amman',          order: 50, nameFr: 'Amman',        nameAr: 'عمّان',          transliteration: '\u02bfammān',     lat: 31.9539, lng: 35.9106,  country: 'Jordanie',          countryAr: 'الأردن' },
  { key: 'petra',          order: 51, nameFr: 'Pétra',        nameAr: 'البتراء',        transliteration: 'al-batrā\u02be',   lat: 30.3285, lng: 35.4444, country: 'Jordanie',          countryAr: 'الأردن' },
]

export const ARAB_CITIES_BY_KEY: Record<string, ArabCity> =
  ARAB_CITIES.reduce((acc, c) => { acc[c.key] = c; return acc }, {} as Record<string, ArabCity>)

export const ARAB_CITIES_BY_ORDER: ArabCity[] =
  [...ARAB_CITIES].sort((a, b) => a.order - b.order)
