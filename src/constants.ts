export interface Dish {
  id: string;
  englishName: string;
  chineseName: string;
  pinyin: string;
  heroImage: string;
  ingredients: string[];
  story: string;
  culturalNote: string;
  type: 'meat' | 'veggie' | 'seafood';
}

export interface Dinner {
  id: string;
  hostName: string;
  district: string;
  city: string;
  date: string;
  dishIds: string[];
}

export const DISHES: Dish[] = [
  {
    id: '1',
    englishName: 'Garden Veggie with Diced Tofu',
    chineseName: '马兰头香干',
    pinyin: 'Mǎ lán tóu xiāng gān',
    heroImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800',
    ingredients: ['Indian Aster (Malan)', 'Smoked Tofu', 'Sesame Oil', 'Sugar'],
    story: 'A quintessential spring dish from the Jiangnan region. Malan is a wild herb gathered from garden edges, symbolizing the arrival of warmth.',
    culturalNote: 'The herb is known for its "cooling" properties in Traditional Chinese Medicine.',
    type: 'veggie'
  },
  {
    id: '2',
    englishName: 'Braised Spring Bamboo Shoots',
    chineseName: '油焖春笋',
    pinyin: 'Yóu mèn chūn sǔn',
    heroImage: 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?w=800',
    ingredients: ['Spring Bamboo Shoots', 'Dark Soy Sauce', 'Sugar', 'Scallion Oil'],
    story: 'Tender shoots harvested just as they break the soil. This dish celebrates the "umami of the earth" with a glossy, savory-sweet glaze.',
    culturalNote: 'Bamboo represents integrity and resilience in Chinese culture.',
    type: 'veggie'
  },
  {
    id: '3',
    englishName: 'Sweet and Sour Pork Ribs',
    chineseName: '糖醋小排',
    pinyin: 'Táng cù xiǎo pái',
    heroImage: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?w=800',
    ingredients: ['Pork Spare Ribs', 'Chinkiang Vinegar', 'Rock Sugar', 'Ginger'],
    story: 'A classic "cold starter" that is actually served at room temperature. The ribs are slow-cooked until the sauce becomes a sticky lacquer.',
    culturalNote: 'The balance of "Tang" (Sugar) and "Cu" (Vinegar) is a hallmark of Shanghainese cuisine.',
    type: 'meat'
  },
  {
    id: '4',
    englishName: 'White Cut Local Chicken',
    chineseName: '白斩鸡',
    pinyin: 'Bái zhǎn jī',
    heroImage: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=800',
    ingredients: ['Free-range Chicken', 'Ginger-Scallion Oil', 'Maltose', 'Sand Ginger'],
    story: 'Simplicity at its peak. The chicken is poached just until done to preserve the silky texture of the skin and the natural sweetness of the meat.',
    culturalNote: 'In China, "no chicken, no feast." It is the centerpiece of any celebratory meal.',
    type: 'meat'
  },
  {
    id: '5',
    englishName: 'Handmade Fish Ball Soup',
    chineseName: '手工鱼丸汤',
    pinyin: 'Shǒu gōng yú wán tāng',
    heroImage: 'https://images.pexels.com/photos/1703272/pexels-photo-1703272.jpeg?w=800',
    ingredients: ['Silver Carp', 'Egg White', 'White Pepper', 'Bok Choy'],
    story: 'These are not your average fish balls. Hand-scraped and whipped until they float, they are light as clouds and melt in the mouth.',
    culturalNote: 'The round shape symbolizes "Tuanyuan" — family reunion and completeness.',
    type: 'seafood'
  },
  {
    id: '6',
    englishName: 'Ayi\'s Handmade Wontons',
    chineseName: '阿姨手工馄饨',
    pinyin: 'Ā yí hūn tún',
    heroImage: 'https://images.pexels.com/photos/4087610/pexels-photo-4087610.jpeg?w=800',
    ingredients: ['Pork', 'Shepherd\'s Purse', 'Dried Shrimp', 'Thin Flour Wrappers'],
    story: 'Wrapped by the family "Ayi" (Auntie), these wontons are the ultimate comfort food. Each fold is a testament to years of home-cooking tradition.',
    culturalNote: 'Wontons are often eaten for breakfast or as a late-night snack in bustling Chinese cities.',
    type: 'meat'
  },
  {
    id: '7',
    englishName: 'Red Bean Rice Balls Dessert',
    chineseName: '豆沙糯米汤圆',
    pinyin: 'Dòu shā nuò mǐ tāng yuán',
    heroImage: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?w=800',
    ingredients: ['Glutinous Rice Flour', 'Sweet Red Bean Paste', 'Osmanthus Syrup'],
    story: 'A warm, sweet hug to end the meal. The chewy rice balls are filled with silky red bean paste and served in a fragrant syrup.',
    culturalNote: 'Traditionally eaten during the Lantern Festival to celebrate the first full moon of the lunar year.',
    type: 'veggie'
  }
];
