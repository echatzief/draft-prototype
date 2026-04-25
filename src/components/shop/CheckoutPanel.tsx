import { LoaderCircle, MailCheck } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import type { CartItem, CheckoutFormValues } from "./types";

interface CheckoutPanelProps {
  values: CheckoutFormValues;
  items: CartItem[];
  total: number;
  isSubmitting: boolean;
  onChange: (field: keyof CheckoutFormValues, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CheckoutPanel({ values, items, total, isSubmitting, onChange, onSubmit }: CheckoutPanelProps) {
  return (
    <section className="border-t border-border/60 bg-secondary/20">
      <div className="container grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-5">
          <p className="font-brand text-sm uppercase tracking-[0.32em] text-muted-foreground">Order</p>
          <h2 className="font-display text-4xl leading-tight text-foreground md:text-5xl">
            Complete your order
          </h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Once submitted, you'll receive an order confirmation via email with delivery details.
          </p>

          <div className="rounded-[1.5rem] border border-border/60 bg-background/80 p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-secondary p-3">
                <MailCheck className="size-5 text-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Secure ordering</p>
                <p className="text-sm text-muted-foreground">We'll send an order confirmation email once your purchase is processed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-border/60 bg-card/90 p-6 shadow-soft md:p-7">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Guest details</p>
              <p className="mt-2 font-display text-3xl text-foreground">Order summary</p>
            </div>
            <p className="font-display text-3xl text-foreground">€{total}</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name">
                <Input value={values.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Ava Martin" required />
              </Field>
              <Field label="Email">
                <Input type="email" value={values.email} onChange={(e) => onChange("email", e.target.value)} placeholder="ava@example.com" required />
              </Field>
              <Field label="Phone">
                <Input value={values.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+33 6 12 34 56 78" required />
              </Field>
              <Field label="Country">
                <Input value={values.country} onChange={(e) => onChange("country", e.target.value)} placeholder="France" required />
              </Field>
            </div>

            <Field label="Address">
              <Input value={values.address} onChange={(e) => onChange("address", e.target.value)} placeholder="25 Rue de Turenne" required />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="City">
                <Input value={values.city} onChange={(e) => onChange("city", e.target.value)} placeholder="Paris" required />
              </Field>
              <Field label="Postal code">
                <Input value={values.postalCode} onChange={(e) => onChange("postalCode", e.target.value)} placeholder="75003" required />
              </Field>
            </div>

            <Field label="Notes">
              <Textarea
                value={values.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                placeholder="Delivery preferences, gifting note, colour questions…"
              />
            </Field>

            <div className="rounded-[1.25rem] border border-border/60 bg-secondary/35 p-4">
              <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span>Cart preview</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)} pcs</span>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-foreground">
                      {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                    </span>
                    <span className="text-muted-foreground">€{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={items.length === 0 || isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Sending order
                </>
              ) : (
                "Place order"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2.5 text-sm text-foreground">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}