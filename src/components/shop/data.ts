export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  color: string;
  material: string;
  size: string;
  description: string;
  image: string;
  accent: "dark" | "light";
  category: string;
};

export const products: Product[] = [
  {
    id: "baby-blue-loop-clutch",
    name: "Baby Blue Loop-Stitch Clutch",
    subtitle: "Hand-crafted soft chenille pouch",
    price: 35,
    originalPrice: 50,
    color: "Baby Blue",
    material: "Ultra-soft chenille loop yarn",
    size: "Compact",
    description:
      "Hand-crafted clutch in soft baby blue chenille with magnetic closure, gold tag and satin lining.",
    image: "/baby_blue_bag.png",
    accent: "light",
    category: "Clutch",
  },
  {
    id: "lavender-loop-clutch",
    name: "Lavender Loop-Stitch Clutch",
    subtitle: "Textured chunky yarn pochette",
    price: 35,
    originalPrice: 50,
    color: "Lavender",
    material: "Chunky loop-stitch chenille yarn",
    size: "Compact",
    description:
      "Handmade lavender yarn clutch with bubbly texture, gold 'hand made' label and silk-like lining.",
    image: "/purple_bag.png",
    accent: "light",
    category: "Clutch",
  },
  {
    id: "pink-loop-clutch",
    name: "Pink Loop-Stitch Clutch",
    subtitle: "Soft pastel chenille pouch",
    price: 35,
    originalPrice: 50,
    color: "Pink",
    material: "Ultra-soft chenille loop yarn",
    size: "Compact",
    description:
      "Hand-crafted clutch in soft pink chenille with magnetic closure, gold tag and satin lining.",
    image: "/pink_bag.png",
    accent: "light",
    category: "Clutch",
  },
  {
    id: "mauve-loop-clutch",
    name: "Mauve Loop-Stitch Clutch",
    subtitle: "Dusty rose textured pochette",
    price: 35,
    originalPrice: 50,
    color: "Mauve",
    material: "Chunky loop-stitch chenille yarn",
    size: "Compact",
    description:
      "Handmade mauve yarn clutch with bubbly texture, gold 'hand made' label and silk-like lining.",
    image: "/mauve_bag.png",
    accent: "light",
    category: "Clutch",
  },
  {
    id: "red-loop-clutch",
    name: "Red Loop-Stitch Clutch",
    subtitle: "Bold crimson chenille pouch",
    price: 35,
    originalPrice: 50,
    color: "Red",
    material: "Ultra-soft chenille loop yarn",
    size: "Compact",
    description:
      "Hand-crafted clutch in bold red chenille with magnetic closure, gold tag and satin lining.",
    image: "/red_bag.png",
    accent: "dark",
    category: "Clutch",
  },
];

export const brandLines = [
  "Handmade in Greece",
  "100% chenille yarn",
  "Free shipping over €80",
];
