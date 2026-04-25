import { useEffect } from "react";
import { useMemo, useRef, useState } from "react";

import { toast } from "../ui/use-toast";

import { CartDrawer } from "./CartDrawer";
import { CheckoutPanel } from "./CheckoutPanel";
import { ExperienceStrip } from "./ExperienceStrip";
import { FooterNote } from "./FooterNote";
import { HeroSection } from "./HeroSection";
import { ProductGrid } from "./ProductGrid";
import { ShopHeader } from "./ShopHeader";
import { GA_EVENTS, trackEvent, trackPageView } from "../../lib/analytics";
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
  const [checkoutValues, setCheckoutValues] =
    useState<CheckoutFormValues>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const collectionRef = useRef<HTMLElement | null>(null);
  const checkoutRef = useRef<HTMLDivElement | null>(null);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );
  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  useEffect(() => {
    trackPageView(window.location.pathname, document.title);
  }, []);

  const scrollToCollection = () =>
    collectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  const scrollToCheckout = () => {
    if (cartItems.length > 0) {
      trackEvent(GA_EVENTS.BEGIN_CHECKOUT, {
        currency: "EUR",
        value: total,
        items: cartItems.length,
      });
    }
    checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    trackEvent(GA_EVENTS.ADD_TO_CART, {
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const incrementItem = (id: string) => {
    setCartItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
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
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      trackEvent(GA_EVENTS.REMOVE_FROM_CART, {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
      });
    }
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

    const response = await fetch("/api/send-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: checkoutValues.name.trim(),
        customerEmail: checkoutValues.email.trim(),
        totalAmount: total,
        currency: "EUR",
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: checkoutValues.address.trim(),
        shippingCity: checkoutValues.city.trim(),
        shippingPostalCode: checkoutValues.postalCode.trim(),
        shippingCountry: checkoutValues.country.trim(),
        notes: checkoutValues.notes.trim() || undefined,
      }),
    });

    const result = await response.json();

    setIsSubmitting(false);

    if (!response.ok || result.error) {
      const isRateLimited = response.status === 429;
      toast({
        title: isRateLimited ? "Order limit reached" : "Order not completed",
        description:
          result.error ||
          "Your order didn't go through. Please try again in a moment.",
        variant: isRateLimited ? "default" : "destructive",
      });
    } else {
      trackEvent(GA_EVENTS.PLACE_ORDER, {
        value: total,
        currency: "EUR",
        items: cartItems.length,
        item_names: cartItems.map((i) => i.name).join(", "),
      });
      toast({
        title: "Order placed 🎉",
        description:
          "Your order was placed successfully. A confirmation email will be available soon.",
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
