import { ShoppingBag } from "lucide-react";

import { Button } from "../ui/button";

interface ShopHeaderProps {
  itemCount: number;
  onOpenCheckout: () => void;
}

export function ShopHeader({ itemCount, onOpenCheckout }: ShopHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-brand text-sm uppercase tracking-[0.32em] text-muted-foreground">Draft Prototype</p>
          <p className="text-xs text-muted-foreground">Minimal bags with a gallery finish</p>
        </div>

        <Button variant="nav" size="sm" onClick={onOpenCheckout}>
          <ShoppingBag className="size-4" />
          Cart
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {itemCount}
          </span>
        </Button>
      </div>
    </header>
  );
}