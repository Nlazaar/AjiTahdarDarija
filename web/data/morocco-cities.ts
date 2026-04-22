export interface MoroccoCity {
  key: string
  order: number
  nameFr: string
  nameAr: string
  transliteration: string
  lat: number
  lng: number
  region: string
}

export const MOROCCO_CITIES: MoroccoCity[] = [
  { key: 'tanger',         order: 1,  nameFr: 'Tanger',         nameAr: 'طنجة',              transliteration: 'tanja',         lat: 35.7595, lng: -5.8340, region: 'Côte Nord' },
  { key: 'asilah',         order: 2,  nameFr: 'Asilah',         nameAr: 'أصيلة',             transliteration: 'asila',         lat: 35.4655, lng: -6.0359, region: 'Côte Nord' },
  { key: 'larache',        order: 3,  nameFr: 'Larache',        nameAr: 'العرائش',           transliteration: "l3ra2ich",      lat: 35.1932, lng: -6.1557, region: 'Côte Nord' },
  { key: 'ksar-el-kebir',  order: 4,  nameFr: 'Ksar el Kebir',  nameAr: 'القصر الكبير',      transliteration: 'lqsar lkbir',   lat: 35.0011, lng: -5.9061, region: 'Côte Nord' },
  { key: 'ouazzane',       order: 5,  nameFr: 'Ouazzane',       nameAr: 'وزان',              transliteration: 'wazzane',       lat: 34.7939, lng: -5.5722, region: 'Côte Nord' },
  { key: 'chefchaouen',    order: 6,  nameFr: 'Chefchaouen',    nameAr: 'شفشاون',            transliteration: 'chefchawn',     lat: 35.1688, lng: -5.2636, region: 'Côte Nord' },
  { key: 'tetouan',        order: 7,  nameFr: 'Tétouan',        nameAr: 'تطوان',             transliteration: 'tetwan',        lat: 35.5711, lng: -5.3754, region: 'Côte Nord' },

  { key: 'al-hoceima',     order: 8,  nameFr: 'Al Hoceima',     nameAr: 'الحسيمة',           transliteration: "l7sima",        lat: 35.2517, lng: -3.9372, region: 'Rif & Méditerranée' },
  { key: 'nador',          order: 9,  nameFr: 'Nador',          nameAr: 'الناظور',           transliteration: 'nnadour',       lat: 35.1740, lng: -2.9287, region: 'Rif & Méditerranée' },
  { key: 'saidia',         order: 10, nameFr: 'Saidia',         nameAr: 'السعيدية',          transliteration: "sa3idiya",      lat: 35.0862, lng: -2.2316, region: 'Rif & Méditerranée' },
  { key: 'berkane',        order: 11, nameFr: 'Berkane',        nameAr: 'بركان',             transliteration: 'berkane',       lat: 34.9187, lng: -2.3198, region: 'Rif & Méditerranée' },
  { key: 'oujda',          order: 12, nameFr: 'Oujda',          nameAr: 'وجدة',              transliteration: 'wejda',         lat: 34.6814, lng: -1.9086, region: 'Rif & Méditerranée' },
  { key: 'figuig',         order: 13, nameFr: 'Figuig',         nameAr: 'فڭيڭ',              transliteration: 'figig',         lat: 32.1094, lng: -1.2267, region: 'Rif & Méditerranée' },

  { key: 'taza',           order: 14, nameFr: 'Taza',           nameAr: 'تازة',              transliteration: 'taza',          lat: 34.2134, lng: -4.0103, region: 'Moyen-Atlas' },
  { key: 'fes',            order: 15, nameFr: 'Fès',            nameAr: 'فاس',               transliteration: 'fas',           lat: 34.0181, lng: -5.0078, region: 'Moyen-Atlas' },
  { key: 'sefrou',         order: 16, nameFr: 'Sefrou',         nameAr: 'صفرو',              transliteration: 'sefrou',        lat: 33.8305, lng: -4.8288, region: 'Moyen-Atlas' },
  { key: 'meknes',         order: 17, nameFr: 'Meknès',         nameAr: 'مكناس',             transliteration: 'meknas',        lat: 33.8935, lng: -5.5473, region: 'Moyen-Atlas' },
  { key: 'moulay-idriss',  order: 18, nameFr: 'Moulay Idriss',  nameAr: 'مولاي إدريس',       transliteration: 'moulay driss',  lat: 34.0551, lng: -5.5184, region: 'Moyen-Atlas' },
  { key: 'ifrane',         order: 19, nameFr: 'Ifrane',         nameAr: 'إفران',             transliteration: 'ifran',         lat: 33.5228, lng: -5.1106, region: 'Moyen-Atlas' },
  { key: 'azrou',          order: 20, nameFr: 'Azrou',          nameAr: 'أزرو',              transliteration: 'azrou',         lat: 33.4325, lng: -5.2208, region: 'Moyen-Atlas' },
  { key: 'khenifra',       order: 21, nameFr: 'Khénifra',       nameAr: 'خنيفرة',            transliteration: 'khnifra',       lat: 32.9394, lng: -5.6691, region: 'Moyen-Atlas' },

  { key: 'beni-mellal',    order: 22, nameFr: 'Béni Mellal',    nameAr: 'بني ملال',          transliteration: 'bni mllal',     lat: 32.3373, lng: -6.3498, region: 'Plateaux centre' },
  { key: 'khouribga',      order: 23, nameFr: 'Khouribga',      nameAr: 'خريبكة',            transliteration: 'khribga',       lat: 32.8811, lng: -6.9063, region: 'Plateaux centre' },
  { key: 'settat',         order: 24, nameFr: 'Settat',         nameAr: 'سطات',              transliteration: 'stat',          lat: 33.0010, lng: -7.6167, region: 'Plateaux centre' },

  { key: 'kenitra',        order: 25, nameFr: 'Kénitra',        nameAr: 'القنيطرة',          transliteration: 'lqnitra',       lat: 34.2610, lng: -6.5802, region: 'Plaine atlantique' },
  { key: 'sale',           order: 26, nameFr: 'Salé',           nameAr: 'سلا',               transliteration: 'sla',           lat: 34.0531, lng: -6.7986, region: 'Plaine atlantique' },
  { key: 'rabat',          order: 27, nameFr: 'Rabat',          nameAr: 'الرباط',            transliteration: 'rbat',          lat: 34.0209, lng: -6.8416, region: 'Plaine atlantique' },
  { key: 'mohammedia',     order: 28, nameFr: 'Mohammedia',     nameAr: 'المحمدية',          transliteration: "mou7ammadiya",  lat: 33.6866, lng: -7.3830, region: 'Plaine atlantique' },
  { key: 'casablanca',     order: 29, nameFr: 'Casablanca',     nameAr: 'الدار البيضاء',     transliteration: 'dar lbida',     lat: 33.5731, lng: -7.5898, region: 'Plaine atlantique' },

  { key: 'el-jadida',      order: 30, nameFr: 'El Jadida',      nameAr: 'الجديدة',           transliteration: 'jdida',         lat: 33.2316, lng: -8.5007, region: 'Doukkala & Sous' },
  { key: 'oualidia',       order: 31, nameFr: 'Oualidia',       nameAr: 'الوليدية',          transliteration: 'walidiya',      lat: 32.7333, lng: -9.0333, region: 'Doukkala & Sous' },
  { key: 'safi',           order: 32, nameFr: 'Safi',           nameAr: 'آسفي',              transliteration: 'asfi',          lat: 32.2994, lng: -9.2372, region: 'Doukkala & Sous' },
  { key: 'essaouira',      order: 33, nameFr: 'Essaouira',      nameAr: 'الصويرة',           transliteration: 'sswira',        lat: 31.5125, lng: -9.7700, region: 'Doukkala & Sous' },

  { key: 'marrakech',      order: 34, nameFr: 'Marrakech',      nameAr: 'مراكش',             transliteration: 'marrakch',      lat: 31.6295, lng: -7.9811, region: 'Haouz' },

  { key: 'agadir',         order: 35, nameFr: 'Agadir',         nameAr: 'أكادير',            transliteration: 'agadir',        lat: 30.4278, lng: -9.5981, region: 'Sud-Ouest' },
  { key: 'taroudant',      order: 36, nameFr: 'Taroudant',      nameAr: 'تارودانت',          transliteration: 'taroudant',     lat: 30.4727, lng: -8.8770, region: 'Sud-Ouest' },
  { key: 'tiznit',         order: 37, nameFr: 'Tiznit',         nameAr: 'تيزنيت',            transliteration: 'tiznit',        lat: 29.6974, lng: -9.7322, region: 'Sud-Ouest' },
  { key: 'sidi-ifni',      order: 38, nameFr: 'Sidi Ifni',      nameAr: 'سيدي إفني',         transliteration: 'sidi ifni',     lat: 29.3800, lng: -10.1720, region: 'Sud-Ouest' },

  { key: 'ouarzazate',     order: 39, nameFr: 'Ouarzazate',     nameAr: 'ورزازات',           transliteration: 'ouarzazate',    lat: 30.9335, lng: -6.9370, region: 'Drâa-Tafilalet' },
  { key: 'ait-benhaddou',  order: 40, nameFr: 'Ait Benhaddou',  nameAr: 'آيت بن حدو',        transliteration: "ait ben 7addou",lat: 31.0470, lng: -7.1294, region: 'Drâa-Tafilalet' },
  { key: 'zagora',         order: 41, nameFr: 'Zagora',         nameAr: 'زاكورة',            transliteration: 'zagora',        lat: 30.3317, lng: -5.8385, region: 'Drâa-Tafilalet' },
  { key: 'mhamid',         order: 42, nameFr: 'Mhamid',         nameAr: 'امحاميد',           transliteration: "m7amid",        lat: 29.8264, lng: -5.7211, region: 'Drâa-Tafilalet' },
  { key: 'erfoud',         order: 43, nameFr: 'Erfoud',         nameAr: 'أرفود',             transliteration: 'arfoud',        lat: 31.4339, lng: -4.2323, region: 'Drâa-Tafilalet' },
  { key: 'merzouga',       order: 44, nameFr: 'Merzouga',       nameAr: 'مرزوكة',            transliteration: 'merzouga',      lat: 31.1000, lng: -4.0000, region: 'Drâa-Tafilalet' },
  { key: 'rissani',        order: 45, nameFr: 'Rissani',        nameAr: 'الريصاني',          transliteration: 'rrissani',      lat: 31.2833, lng: -4.2667, region: 'Drâa-Tafilalet' },

  { key: 'guelmim',        order: 46, nameFr: 'Guelmim',        nameAr: 'كلميم',             transliteration: 'gelmim',        lat: 28.9870, lng: -10.0574, region: 'Sahara' },
  { key: 'tan-tan',        order: 47, nameFr: 'Tan-Tan',        nameAr: 'طانطان',            transliteration: 'tantan',        lat: 28.4378, lng: -11.1028, region: 'Sahara' },
  { key: 'tarfaya',        order: 48, nameFr: 'Tarfaya',        nameAr: 'طرفاية',            transliteration: 'tarfaya',       lat: 27.9395, lng: -12.9271, region: 'Sahara' },
  { key: 'laayoune',       order: 49, nameFr: 'Laâyoune',       nameAr: 'العيون',            transliteration: "l3youn",        lat: 27.1536, lng: -13.2033, region: 'Sahara' },
  { key: 'boujdour',       order: 50, nameFr: 'Boujdour',       nameAr: 'بوجدور',            transliteration: 'boujdour',      lat: 26.1261, lng: -14.4848, region: 'Sahara' },
  { key: 'dakhla',         order: 51, nameFr: 'Dakhla',         nameAr: 'الداخلة',           transliteration: 'ddakhla',       lat: 23.7136, lng: -15.9355, region: 'Sahara' },
]

export const CITIES_BY_KEY: Record<string, MoroccoCity> =
  MOROCCO_CITIES.reduce((acc, c) => { acc[c.key] = c; return acc }, {} as Record<string, MoroccoCity>)

export const CITIES_BY_ORDER: MoroccoCity[] =
  [...MOROCCO_CITIES].sort((a, b) => a.order - b.order)
