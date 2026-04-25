import { ArrowDownRight } from "lucide-react";

import { Button } from "../ui/button";

interface HeroSectionProps {
  onExplore: () => void;
  lines: string[];
}

export function HeroSection({ onExplore, lines }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-hero-radial opacity-80" aria-hidden />
      <div className="container relative grid gap-14 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-5">
            <p className="font-brand text-sm uppercase tracking-[0.38em] text-muted-foreground">Draft Prototype</p>
            <h1 className="max-w-xl font-display text-5xl leading-[0.92] text-foreground md:text-6xl lg:text-7xl">
              Handcrafted bags built to last.
            </h1>
            <p className="max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
              Discover our collection of minimalist bags — from elegant totes to compact crossbodies, each crafted with precision and built to age beautifully.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="hero" size="lg" onClick={onExplore}>
              Shop collection
              <ArrowDownRight className="size-4" />
            </Button>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {lines.map((line) => (
                <span key={line} className="rounded-full border border-border/70 bg-secondary/60 px-3 py-2">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
          <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 shadow-soft">
            <div className="pointer-events-none absolute inset-0 bg-card-highlight opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">New Collection</p>
            <div className="mt-12 space-y-3">
              <h2 className="font-display text-3xl text-foreground">Limited Edition</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                20 pieces remaining — secure yours before they're gone.
              </p>
            </div>
          </article>

          <article className="translate-y-0 rounded-2xl border border-border/60 bg-secondary/55 p-6 shadow-soft md:translate-y-12">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Shipping</p>
            <div className="mt-12 space-y-3">
              <h2 className="font-display text-3xl text-foreground">Free delivery</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Complimentary shipping on all orders over €100. Secure checkout with order confirmation.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
