import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "../ui/button";

import type { CartItem } from "./types";

interface CartDrawerProps {
  items: CartItem[];
  total: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  items,
  total,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  return (
    <aside className="rounded-[1.5rem] border border-border/60 bg-card/90 p-5 shadow-soft lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <p className="font-brand text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Cart
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground">
            Selected bags
          </h2>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
          {items.length} items
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center">
          <div className="rounded-full border border-border/70 bg-secondary/50 p-4">
            <ShoppingBag className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="font-medium text-foreground">
              Your cart is still empty.
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Browse our collection and add bags to your cart to get started.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4 py-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="space-y-4 rounded-2xl border border-border/60 bg-secondary/35 p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 rounded-xl object-cover"
                    loading="lazy"
                    width={120}
                    height={160}
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {item.color}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="rounded-full border border-border/60 p-2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="font-display text-2xl text-foreground">
                      €{item.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-border/60 bg-background/70 p-1">
                    <button
                      type="button"
                      onClick={() => onDecrement(item.id)}
                      className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-10 text-center text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onIncrement(item.id)}
                      className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    €{item.price * item.quantity}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-4 border-t border-border/60 pt-5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Estimated total</span>
              <span className="font-display text-3xl text-foreground">
                €{total}
              </span>
            </div>
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={onCheckout}
            >
              Continue to checkout
            </Button>
          </div>
        </>
      )}
    </aside>
  );
}
