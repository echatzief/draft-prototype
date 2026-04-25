export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
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
    price: 40,
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
    price: 40,
    color: "Lavender",
    material: "Chunky loop-stitch chenille yarn",
    size: "Compact",
    description:
      "Handmade lavender yarn clutch with bubbly texture, gold 'hand made' label and silk-like lining.",
    image: "/purple_bag.png",
    accent: "light",
    category: "Clutch",
  },
];

export const brandLines = [
  "Handmade in Greece",
  "100% chenille yarn",
  "Free shipping over €80",
];
