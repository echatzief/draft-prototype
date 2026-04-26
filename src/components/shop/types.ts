import type { Product } from "./data";

export type CartItem = Product & {
  quantity: number;
};

export type CheckoutFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
};
