import { useEffect, useRef } from "react";
import { ArrowUpRight, Plus } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { trackEvent, GA_EVENTS } from "../../lib/analytics";

import type { Product } from "./data";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const productRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.getAttribute("data-product-id");
            const product = products.find((p) => p.id === productId);
            if (product) {
              trackEvent(GA_EVENTS.VIEW_PRODUCT, {
                item_id: product.id,
                item_name: product.name,
                item_category: product.category,
                price: product.price,
              });
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [products]);

  return (
    <section
      id="collection"
      className="-mx-4 px-4 py-16 md:container md:mx-0 md:px-0 md:py-20"
    >
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-brand text-sm uppercase tracking-[0.32em] text-muted-foreground">
            Collection
          </p>
          <h2 className="font-display text-4xl leading-tight text-foreground md:text-5xl">
            A short edit with long presence.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          Each piece is presented like an object in a private viewing room —
          minimal, tactile, and ready for direct inquiry.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {products.map((product, index) => (
          <Card
            key={product.id}
            data-product-id={product.id}
            ref={(el) => {
              productRefs.current[index] = el;
            }}
            className="group overflow-hidden rounded-[1.5rem] border-border/60 bg-card/80 shadow-soft transition-transform duration-500 hover:-translate-y-1"
          >
            <CardContent className="grid gap-6 p-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full min-h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col justify-between gap-8 p-6 md:p-7">
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        {product.subtitle}
                      </p>
                      <h3 className="mt-3 font-display text-3xl leading-tight text-foreground">
                        {product.name}
                      </h3>
                    </div>
                    <ArrowUpRight className="mt-1 size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {product.description}
                  </p>

                  <dl className="grid grid-cols-2 gap-4 border-t border-border/60 pt-5 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Color
                      </dt>
                      <dd className="mt-2 text-foreground">{product.color}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Size
                      </dt>
                      <dd className="mt-2 text-foreground">{product.size}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Material
                      </dt>
                      <dd className="mt-2 text-foreground">
                        {product.material}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Order value
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="font-display text-3xl text-foreground">
                        €{product.price}
                      </p>
                      {product.originalPrice && (
                        <p className="font-display text-xl text-muted-foreground line-through">
                          €{product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="product"
                    onClick={() => onAddToCart(product)}
                  >
                    <Plus className="size-4" />
                    Add to cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
