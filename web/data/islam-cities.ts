/**
 * 15 villes marquantes de l'histoire islamique, ordonnées chronologiquement
 * depuis la période prophétique (622, Mecque/Médine) jusqu'à l'expansion
 * globale (Al-Andalus, Ottomans, Moghols).
 *
 * Parcours utilisé par le track RELIGION : permet d'ancrer chaque module
 * dans un lieu historique précis (Ka'ba, Qarawiyyin, Al-Azhar, Mosquée
 * bleue…). Coordonnées GPS WGS84.
 */
export interface IslamCity {
  key: string
  order: number
  nameFr: string
  nameAr: string
  transliteration: string
  lat: number
  lng: number
  country: string
  countryAr: string
  iso3: string // ISO-3166-1 alpha-3 pour highlight carte (ex: 'SAU', 'ESP')
  era: string // marqueur chronologique court, pour tooltip
}

export const ISLAM_CITIES: IslamCity[] = [
  { key: 'lamecque',   order: 1,  nameFr: 'La Mecque',   nameAr: 'مكة المكرمة',    transliteration: 'makka',        lat: 21.4225, lng: 39.8262,  country: 'Arabie saoudite', countryAr: 'السعودية', iso3: 'SAU', era: '610 — Révélation, Ka\'ba' },
  { key: 'medine',     order: 2,  nameFr: 'Médine',      nameAr: 'المدينة المنورة', transliteration: 'al-madīna',    lat: 24.4667, lng: 39.6000,  country: 'Arabie saoudite', countryAr: 'السعودية', iso3: 'SAU', era: '622 — Hijra, Mosquée du Prophète' },
  { key: 'taef',       order: 3,  nameFr: 'Taëf',        nameAr: 'الطائف',          transliteration: 'aṭ-ṭāʾif',     lat: 21.2703, lng: 40.4158,  country: 'Arabie saoudite', countryAr: 'السعودية', iso3: 'SAU', era: '620 — Voyage de prédication' },
  { key: 'jerusalem',  order: 4,  nameFr: 'Jérusalem',   nameAr: 'القدس',           transliteration: 'al-quds',      lat: 31.7683, lng: 35.2137,  country: 'Palestine',       countryAr: 'فلسطين',    iso3: 'PSE', era: '621 — Isrāʾ wa-l-Miʿrāj, Al-Aqsa' },
  { key: 'damas',      order: 5,  nameFr: 'Damas',       nameAr: 'دمشق',            transliteration: 'dimashq',      lat: 33.5138, lng: 36.2765,  country: 'Syrie',           countryAr: 'سوريا',     iso3: 'SYR', era: '661 — Capitale omeyyade' },
  { key: 'kairouan',   order: 6,  nameFr: 'Kairouan',    nameAr: 'القيروان',        transliteration: 'al-qayrawān',  lat: 35.6781, lng: 10.0963,  country: 'Tunisie',         countryAr: 'تونس',      iso3: 'TUN', era: '670 — 4e ville sainte du sunnisme' },
  { key: 'bagdad',     order: 7,  nameFr: 'Bagdad',      nameAr: 'بغداد',           transliteration: 'baghdād',      lat: 33.3152, lng: 44.3661,  country: 'Irak',            countryAr: 'العراق',    iso3: 'IRQ', era: '762 — Abbassides, âge d\'or' },
  { key: 'fes',        order: 8,  nameFr: 'Fès',         nameAr: 'فاس',             transliteration: 'fās',          lat: 34.0181, lng: -5.0078,  country: 'Maroc',           countryAr: 'المغرب',    iso3: 'MAR', era: '859 — Al-Qarawiyyin' },
  { key: 'samarcande', order: 9,  nameFr: 'Samarcande',  nameAr: 'سمرقند',          transliteration: 'samarqand',    lat: 39.6547, lng: 66.9597,  country: 'Ouzbékistan',     countryAr: 'أوزبكستان', iso3: 'UZB', era: '9e s. — Imām al-Bukhārī' },
  { key: 'cordoue',    order: 10, nameFr: 'Cordoue',     nameAr: 'قرطبة',           transliteration: 'qurṭuba',      lat: 37.8882, lng: -4.7794,  country: 'Espagne',         countryAr: 'إسبانيا',   iso3: 'ESP', era: '929 — Califat d\'Al-Andalus' },
  { key: 'lecaire',    order: 11, nameFr: 'Le Caire',    nameAr: 'القاهرة',         transliteration: 'al-qāhira',    lat: 30.0444, lng: 31.2357,  country: 'Égypte',          countryAr: 'مصر',       iso3: 'EGY', era: '969 — Al-Azhar, fatimides' },
  { key: 'ispahan',    order: 12, nameFr: 'Ispahan',     nameAr: 'أصفهان',          transliteration: 'iṣfahān',      lat: 32.6539, lng: 51.6660,  country: 'Iran',            countryAr: 'إيران',     iso3: 'IRN', era: '11e s. — Seljoukides, Safavides' },
  { key: 'delhi',      order: 13, nameFr: 'Delhi',       nameAr: 'دلهي',            transliteration: 'dihlī',        lat: 28.6139, lng: 77.2090,  country: 'Inde',            countryAr: 'الهند',     iso3: 'IND', era: '13e s. — Sultanat, Moghols' },
  { key: 'tombouctou', order: 14, nameFr: 'Tombouctou',  nameAr: 'تمبكتو',          transliteration: 'timbuktū',     lat: 16.7739, lng: -3.0074,  country: 'Mali',            countryAr: 'مالي',      iso3: 'MLI', era: '14e s. — Université de Sankoré' },
  { key: 'istanbul',   order: 15, nameFr: 'Istanbul',    nameAr: 'إسطنبول',         transliteration: 'isṭanbūl',     lat: 41.0082, lng: 28.9784,  country: 'Turquie',         countryAr: 'تركيا',     iso3: 'TUR', era: '1453 — Ottomans, Mosquée Bleue' },
];
