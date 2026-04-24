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
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Draft Prototype" className="h-20 w-auto" />
        </a>

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
