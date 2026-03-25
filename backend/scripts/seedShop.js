const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const shopItems = [
  // Consommables
  {
    key: 'hearts_refill',
    name: 'Recharge cœurs',
    description: 'Retrouve instantanément tes 5 cœurs',
    icon: '❤️',
    category: 'consumable',
    price: 350,
    effect: { action: 'set_hearts', value: 5 },
  },
  {
    key: 'streak_shield',
    name: 'Bouclier de série',
    description: 'Protège ta série si tu rates un jour',
    icon: '🛡️',
    category: 'consumable',
    price: 200,
    effect: { action: 'protect_streak', days: 1 },
  },
  {
    key: 'xp_boost_2x',
    name: 'Boost XP ×2',
    description: 'Double ton XP pour la prochaine leçon',
    icon: '⚡',
    category: 'consumable',
    price: 100,
    effect: { action: 'boost_xp', multiplier: 2, lessons: 1 },
  },
  {
    key: 'hearts_max',
    name: 'Cœurs illimités (1h)',
    description: 'Pratique sans perdre de cœurs pendant 1 heure',
    icon: '💖',
    category: 'consumable',
    price: 500,
    effect: { action: 'unlimited_hearts', durationMinutes: 60 },
  },
  // Cosmétiques
  {
    key: 'theme_sunset',
    name: 'Thème Coucher de soleil',
    description: 'Couleurs chaudes inspirées du Maroc',
    icon: '🌅',
    category: 'cosmetic',
    price: 500,
    effect: { action: 'cosmetic', subtype: 'theme', value: 'sunset', colors: { primary: '#ff6b35', secondary: '#fbbf24' } },
  },
  {
    key: 'theme_ocean',
    name: 'Thème Océan Atlantique',
    description: 'Teintes bleues de la côte marocaine',
    icon: '🌊',
    category: 'cosmetic',
    price: 500,
    effect: { action: 'cosmetic', subtype: 'theme', value: 'ocean', colors: { primary: '#0ea5e9', secondary: '#06b6d4' } },
  },
  {
    key: 'title_master',
    name: 'Titre : Maître du Darija',
    description: 'Affiche ce titre sur ton profil',
    icon: '👑',
    category: 'cosmetic',
    price: 300,
    effect: { action: 'cosmetic', subtype: 'title', value: 'Maître du Darija' },
  },
  {
    key: 'title_explorer',
    name: 'Titre : Explorateur',
    description: 'Pour les aventuriers de la langue',
    icon: '🧭',
    category: 'cosmetic',
    price: 200,
    effect: { action: 'cosmetic', subtype: 'title', value: 'Explorateur' },
  },
  // Packs
  {
    key: 'pack_food',
    name: 'Pack Nourriture',
    description: '30 mots essentiels sur la cuisine marocaine : tajine, couscous, harira…',
    icon: '🍲',
    category: 'pack',
    price: 800,
    effect: { action: 'unlock_pack', packKey: 'food' },
  },
  {
    key: 'pack_travel',
    name: 'Pack Voyage',
    description: 'Vocabulaire transport, hôtel, directions pour voyager au Maroc',
    icon: '✈️',
    category: 'pack',
    price: 800,
    effect: { action: 'unlock_pack', packKey: 'travel' },
  },
  {
    key: 'pack_business',
    name: 'Pack Business',
    description: 'Darija formel et professionnel pour réunions et négociations',
    icon: '💼',
    category: 'pack',
    price: 1200,
    effect: { action: 'unlock_pack', packKey: 'business' },
  },
];

async function main() {
  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    });
    console.log('✓', item.name);
  }
  console.log('Shop seeded!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
