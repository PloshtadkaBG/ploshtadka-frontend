import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import { LocalizedLink } from "@/components/ui/localized-link";

export default function FormWrapper({
  form,
  tagline,
  subtitle,
}: {
  form: ReactNode;
  tagline?: string;
  subtitle?: string;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(420px,480px)]">
      {/* ── Branded panel (desktop: left column, mobile: top banner) ── */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-foreground text-background">
        {/* Accent edge */}
        <div className="absolute inset-y-0 right-0 hidden w-0.5 bg-gradient-to-b from-primary via-accent to-primary lg:block" />

        {/* Mobile: compact banner */}
        <div className="flex items-center gap-3 px-6 py-5 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <MapPin className="size-4.5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Ploshtadka.BG
          </span>
        </div>

        {/* Desktop: full panel */}
        <div className="hidden flex-1 flex-col justify-between p-10 lg:flex xl:p-14">
          {/* Top brand */}
          <LocalizedLink
            to="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <MapPin className="size-5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">
              Ploshtadka.BG
            </span>
          </LocalizedLink>

          {/* Center tagline */}
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
              {tagline ?? "Book your next game."}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-background/60">
              {subtitle ??
                "Find and reserve sports venues across Bulgaria in seconds."}
            </p>
          </div>

          {/* Bottom decorative dots */}
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="size-1.5 rounded-full bg-primary/40" />
          </div>
        </div>
      </div>

      {/* ── Form column ── */}
      <div className="flex flex-col items-center justify-center px-6 py-10 md:px-10 lg:py-0">
        <div className="w-full max-w-sm">{form}</div>
      </div>
    </div>
  );
}
