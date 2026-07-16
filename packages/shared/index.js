export const CATEGORIES = [
  { id: 'all', name: 'All Items' },
  { id: 'coffee', name: 'Coffee' },
  { id: 'non-coffee', name: 'Non-Coffee' },
  { id: 'pastries', name: 'Pastries' },
  { id: 'merchandise', name: 'Merchandise' }
];

export const MENU_ITEMS = [
  // Coffee
  {
    id: 'signature-cappuccino',
    name: 'Signature Cappuccino',
    category: 'coffee',
    price: 4.50,
    description: 'Double shot of our house blend with silky micro-foam and a dusting of organic cocoa.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi7rQHaUeaK2V1pT9GnimcEua9AlTviWnfMIjZ_A5j-D5hALPQb2Rk0Qat4jNqfKizTvBi1ccSfqiz6_EMa4SNGv1r6A5YA6MNv6bRIiHf1piq5fQ7JJKzwKtUyJ-rxwzbkcA0TEVwGtdx-NViC6jEzfzkYh6zL9jPt8i8CsdVln7aQAhIg-X-nAYC8ojBT46fTgCMUFY5gJhQAgxVLp26ByHwi2YepNbasFDwiZPuOQs8FAJloCwn-ScT-nLWoTXX5vKtThklP84',
    tags: ['Bestseller'],
    flavorLabel: 'Body',
    flavorValue: 75
  },
  {
    id: 'ethiopian-cold-brew',
    name: 'Ethiopian Cold Brew',
    category: 'coffee',
    price: 3.75,
    description: 'Slow-steeped for 18 hours. Bright notes of bergamot and jasmine with a crisp finish.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0LfM-QPDSGh-BaYhoA_OVowiXIDP0hzJE_pjvsAxBvazQqxxmmWoD1rh50qzHYwREeB3JD__mWEQsgT4iv-qAhDK05fjIH08Y1ea21IxbYDpIisJM8pZOb6w9QY9UmuTn3D6eAOb5hZlpbX_1hZTdIgd35Rhe5bSiQWMFs9SVnImyahhcN_diHZ5M2joM3ne2dYl8-1Wfrzh_72SFu1ai6Vg76v58WxUfiR7dV1eBstR6-2zajZU8UfzUrTfBaPjzoiCgLdPLLbc',
    tags: [],
    flavorLabel: 'Acidity',
    flavorValue: 90
  },
  {
    id: 'oat-milk-flat-white',
    name: 'Oat Milk Flat White',
    category: 'coffee',
    price: 5.25,
    description: 'Velvety oat milk paired with our low-acidity \'Sunset\' roast. Nutty and smooth.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsCCDk1Q3v-axYIZwbi8Ss0cl46XJ0Inwl_jzxUbkz1hYkLtWVnQeHTd6i6a1TyF0hNIa3Q3BZ0A9uYLkmgTiDwLZco1kSOvMFrjA6g6Ht38F-FNuMbtxpufgzR2a2XUaKEGPCFx885fLoqg_Z09e-VHVQ_qoOQ4F0WHXhiRbmTcfC41c_-6KXIhPCHgd8-C4LZG5fcEqUz6O7_TgEPbRoH6AMse7BCvCCJEg3DFzC3aBtMwQY8YI_sFi7uT56TRyh2H-PQoxAB8',
    tags: ['Vegan'],
    flavorLabel: 'Roast Level',
    flavorValue: 60
  },
  // Non-Coffee
  {
    id: 'ceremonial-matcha-latte',
    name: 'Ceremonial Matcha Latte',
    category: 'non-coffee',
    price: 5.50,
    description: 'Authentic stone-ground Uji matcha whisked with velvety steamed milk. Balanced and earthy.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800',
    tags: ['Popular'],
    flavorLabel: 'Sweetness',
    flavorValue: 40
  },
  {
    id: 'sunset-iced-tea',
    name: 'Sunset Iced Tea',
    category: 'non-coffee',
    price: 4.25,
    description: 'A refreshing blend of premium black tea, sweet peach nectar, and a splash of hibiscus syrup.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=800',
    tags: [],
    flavorLabel: 'Fruitiness',
    flavorValue: 85
  },
  {
    id: 'golden-turmeric-latte',
    name: 'Golden Turmeric Latte',
    category: 'non-coffee',
    price: 5.00,
    description: 'Warm spices of turmeric, ginger, cardamom, and black pepper, steamed with almond milk.',
    image: 'https://images.unsplash.com/photo-1616160975971-ab512f455325?auto=format&fit=crop&q=80&w=800',
    tags: ['Vegan'],
    flavorLabel: 'Spice',
    flavorValue: 50
  },
  // Pastries
  {
    id: 'artisanal-butter-croissant',
    name: 'Artisanal Butter Croissant',
    category: 'pastries',
    price: 3.50,
    description: 'Three-day fermented dough with French butter. Flaky exterior, honeycomb center.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLcnuAnZh7QfVAFwF_Oiryzrn2ppVFLTtis8qEvxk1m7aa0O9Mu8cFT9yj7M2xdF7mMWPwvaW4sgvcXc2dE_TfyrlGHA_vqejLr7UX2aLuzMMpa7PGqLsxe7alBWWthfNBWfWyUur7MXslKh7Q5yIrMIUU1cIaBklhiXdY9cHJFDsDhogXHSxNWAjs6FObQwfK7pVj-Dp2MrsoRAOJ7RjcwK3w9iIKiqKCrFXRXHu-UZCvTImSensD59OW-bw1giDS5XCpqd2ymfQ',
    tags: ['Baked Fresh'],
    flavorLabel: 'Flakiness',
    flavorValue: 95
  },
  {
    id: 'dark-chocolate-sea-salt',
    name: 'Dark Chocolate Sea Salt',
    category: 'pastries',
    price: 4.00,
    description: '72% Valrhona chocolate with flaky Maldon salt. Baked to stay soft and gooey.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqXHxxiww4_7k5Rgb_5dbaXYgAn2BI0jDWGqOh0AOXepr7CiCnLWpsosoX8LgNDPZYoWhdkWtpw1DA0ecNUIl2BbatJrYRGTKJaIa6xfu7yFOq1Iqc9uL54HBMJxk-iH6dk1dYFFCmSxqQhCv3c_mSqn79qPOFhjeVBUpdSk0dND9VicsgX6hgdoJamYWLsdSGHNeQoDC5E4rYr-4Xz5PYPbQG4ipQ6RA9aalyB0bdT23pSK1FGw-wXxLKeV036hwqQ3odxTIMzc8',
    tags: ['Indulgent'],
    flavorLabel: 'Richness',
    flavorValue: 90
  },
  {
    id: 'lemon-glazed-loaf',
    name: 'Lemon Glazed Loaf',
    category: 'pastries',
    price: 3.95,
    description: 'Tangy, moist lemon sponge with organic poppyseeds and a zesty sugar glaze.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt8W17o9iyfNaqSDh9NnJ30LKuQpYB7yJXZPSyO0_GskQniGH9Shjc_aOc_ADQRfDga2DDpZZKUPq6zcZsCVCQvvLpd2BPKpG8R5XP5eM4p0Z2bzGg7giTa3rtBIgZYObdvWyV4Dj9WirLCBupPMhrFdKy6hJtwBy5-9V7tV8A-kbBZaTobiTvghduTey-ZcCztEGfG47Ng32D19xEX5yMQ1HZd26TT5I3B_A6vDi_ftw_IUkbFexy_QVsJtL8sGDfySat3bZCFnk',
    tags: [],
    flavorLabel: 'Zestiness',
    flavorValue: 80
  },
  // Merchandise
  {
    id: 'senja-ceramic-mug',
    name: 'Senja Ceramic Mug',
    category: 'merchandise',
    price: 18.00,
    description: 'Matte black handmade ceramic mug with sunset glaze interior. Fits 350ml.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    tags: ['Limited'],
    flavorLabel: 'Durability',
    flavorValue: 100
  },
  {
    id: 'travel-tumbler',
    name: 'Travel Tumbler',
    category: 'merchandise',
    price: 26.00,
    description: 'Double-walled insulated stainless steel travel tumbler. Keeps hot for 12 hours.',
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=800',
    tags: [],
    flavorLabel: 'Insulation',
    flavorValue: 95
  },
  {
    id: 'artisanal-coffee-beans',
    name: 'Artisanal Coffee Beans',
    category: 'merchandise',
    price: 16.50,
    description: '250g bag of our signature \'Sunset\' blend. Notes of hazelnut, cocoa, and brown sugar.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800',
    tags: ['Signature'],
    flavorLabel: 'Freshness',
    flavorValue: 100
  }
];
