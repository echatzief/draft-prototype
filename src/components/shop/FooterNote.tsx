export function FooterNote() {
  return (
    <footer className="container py-8 text-sm text-muted-foreground">
      <div className="flex flex-col gap-4 border-t border-border/60 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="font-brand uppercase tracking-[0.3em] text-foreground">
          Draft Prototype
        </p>
        <div className="flex flex-col gap-2 md:items-center md:gap-6 md:flex-row">
          <a
            href="mailto:draft.prototype@gmail.com"
            className="hover:text-foreground transition-colors"
          >
            draft.prototype@gmail.com
          </a>
          <a
            href="https://www.instagram.com/draft.proto"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            @draft.proto
          </a>
        </div>
      </div>
    </footer>
  );
}
