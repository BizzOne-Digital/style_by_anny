interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, eyebrow, children }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-surface">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/60 via-surface to-background" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        {eyebrow && (
          <p className="section-eyebrow mb-4">{eyebrow}</p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-semibold text-text sm:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
