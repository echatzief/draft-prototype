import { useMemo, useRef, useState } from "react";

import { toast } from "../ui/use-toast";
import { supabase } from "../../integrations/supabase/client";
import type { TablesInsert } from "../../integrations/supabase/types";

import { CartDrawer } from "./CartDrawer";
import { CheckoutPanel } from "./CheckoutPanel";
import { ExperienceStrip } from "./ExperienceStrip";
import { FooterNote } from "./FooterNote";
import { HeroSection } from "./HeroSection";
import { ProductGrid } from "./ProductGrid";
import { ShopHeader } from "./ShopHeader";
import { brandLines, products, type Product } from "./data";
import type { CartItem, CheckoutFormValues } from "./types";

const initialForm: CheckoutFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  notes: "",
};

export default function Index() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutValues, setCheckoutValues] = useState<CheckoutFormValues>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const collectionRef = useRef<HTMLElement | null>(null);
  const checkoutRef = useRef<HTMLDivElement | null>(null);

  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
  const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const scrollToCollection = () => collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToCheckout = () => checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [...current, { ...product, quantity: 1 }];
    });

    toast({
title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
    });
  };

  const incrementItem = (id: string) => {
    setCartItems((current) => current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decrementItem = (id: string) => {
    setCartItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item];
        if (item.quantity <= 1) return [];
        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const updateField = (field: keyof CheckoutFormValues, value: string) => {
    setCheckoutValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Choose a bag before placing the order.",
      });
      return;
    }

    setIsSubmitting(true);

    const orderPayload: TablesInsert<"orders"> = {
      customer_name: checkoutValues.name.trim(),
      customer_email: checkoutValues.email.trim(),
      customer_phone: checkoutValues.phone.trim() || null,
      shipping_address: checkoutValues.address.trim(),
      shipping_city: checkoutValues.city.trim(),
      shipping_postal_code: checkoutValues.postalCode.trim(),
      shipping_country: checkoutValues.country.trim(),
      notes: checkoutValues.notes.trim() || null,
      currency: "EUR",
      total_amount: total,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
      })),
    };

    const { data: order, error } = await supabase.from("orders").insert(orderPayload).select("id").single();

    console.log(error);
    if (error || !order) {
      setIsSubmitting(false);
      toast({
        title: "Order failed",
        description: "The backend could not store this order yet. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const { error: functionError } = await supabase.functions.invoke("send-order-confirmation", {
      body: {
        orderId: order.id,
        customerName: checkoutValues.name.trim(),
        customerEmail: checkoutValues.email.trim(),
        totalAmount: total,
        currency: "EUR",
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });

    setIsSubmitting(false);

    if (functionError) {
      toast({
        title: "Order placed",
        description: "The order is saved. Email confirmation is pending until Resend is connected.",
      });
    } else {
      toast({
        title: "Order placed",
        description: "The order is saved and the confirmation flow was triggered.",
      });
    }

    setCartItems([]);
    setCheckoutValues(initialForm);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ShopHeader itemCount={itemCount} onOpenCheckout={scrollToCheckout} />
      <main>
        <HeroSection onExplore={scrollToCollection} lines={brandLines} />
        <ExperienceStrip />
        <div className="container py-10">
          <section ref={collectionRef}>
            <ProductGrid products={products} onAddToCart={addToCart} />
          </section>

          <div className="mt-10">
            <CartDrawer
              items={cartItems}
              total={total}
              onIncrement={incrementItem}
              onDecrement={decrementItem}
              onRemove={removeItem}
              onCheckout={scrollToCheckout}
            />
          </div>
        </div>
        <div ref={checkoutRef}>
          <CheckoutPanel
            values={checkoutValues}
            items={cartItems}
            total={total}
            isSubmitting={isSubmitting}
            onChange={updateField}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
      <FooterNote />
    </div>
  );
}
