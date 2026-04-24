const points = [
  "Guest-friendly ordering",
  "Orders stored in Lovable Cloud",
  "Built to trigger backend notifications",
];

export function ExperienceStrip() {
  return (
    <section className="border-y border-border/60 bg-secondary/35">
      <div className="container flex flex-col gap-3 py-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-brand uppercase tracking-[0.3em] text-foreground">Draft Prototype Atelier</p>
        <div className="flex flex-wrap gap-2 md:justify-end">
          {points.map((point) => (
            <span key={point} className="rounded-full border border-border/60 bg-background/70 px-3 py-1.5">
              {point}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}