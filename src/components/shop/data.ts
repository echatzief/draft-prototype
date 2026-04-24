import obsidianToteImage from "../../assets/bag-tote-obsidian.jpg";
import ivoryMiniImage from "../../assets/bag-mini-ivory.jpg";

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
};

export const products: Product[] = [
  {
    id: "obsidian-wave-tote",
    name: "Obsidian Wave Tote",
    subtitle: "Soft architecture for every day",
    price: 340,
    color: "Obsidian",
    material: "Polished calf leather",
    size: "Large",
    description: "A fluid silhouette with a generous interior and sculpted handle, made for an understated statement.",
    image: obsidianToteImage,
    accent: "dark",
  },
  {
    id: "ivory-frame-mini",
    name: "Ivory Frame Mini",
    subtitle: "Compact, precise, quietly bold",
    price: 280,
    color: "Ivory",
    material: "Smooth Italian leather",
    size: "Mini",
    description: "A structured mini bag with a crisp fold-over flap and warm metallic details for refined occasions.",
    image: ivoryMiniImage,
    accent: "light",
  },
];

export const brandLines = [
  "Small collection",
  "Made to prototype desire",
  "No-payment checkout for order capture",
];