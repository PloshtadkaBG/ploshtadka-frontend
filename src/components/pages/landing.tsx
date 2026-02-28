import { useIntlayer } from "react-intlayer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  Search,
  CalendarDays,
  Trophy,
  Dribbble,
  Waves,
  CircleDot,
  Volleyball,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";

const SPORT_ICONS = [
  <CircleDot className="size-7" />,
  <Dribbble className="size-7" />,
  <Trophy className="size-7" />,
  <Waves className="size-7" />,
  <Volleyball className="size-7" />,
  <Dribbble className="size-7" />,
];

const FEATURE_ICONS = [
  <CalendarCheck className="size-6" />,
  <ShieldCheck className="size-6" />,
  <CreditCard className="size-6" />,
];

const STEP_ICONS = [
  <Search className="size-6" />,
  <CalendarDays className="size-6" />,
  <Trophy className="size-6" />,
];

export function Landing() {
  const content = useIntlayer("landing-page");
  const navigate = useLocalizedNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-32">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 size-[400px] rounded-full bg-accent/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="outline"
            className="mb-6 border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <MapPin className="mr-1.5 size-3.5" />
            {content.hero.badge}
          </Badge>

          <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {content.hero.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {content.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 px-8 shadow-lg shadow-primary/20"
              onClick={() => navigate("/venues")}
            >
              <Search className="size-4" />
              {content.hero.ctaPrimary}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8"
              asChild
            >
              <Link to="/about-us">
                {content.hero.ctaSecondary}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {/* Social proof stats */}
          <div className="mx-auto mt-16 flex max-w-md justify-center gap-8 border-t pt-8 sm:gap-12">
            {Object.values(content.hero.stats).map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-2xl font-bold text-foreground">
                  {stat}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {content.features.tagline}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              {content.features.subtitle}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {content.features.items.map((item, index) => (
              <div
                key={index}
                className="group rounded-2xl border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {FEATURE_ICONS[index]}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {content.howItWorks.title}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              {content.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {content.howItWorks.steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Connector line (desktop only) */}
                {index < 2 && (
                  <div className="absolute left-[calc(50%+3rem)] top-8 hidden h-px w-[calc(100%-6rem)] bg-border md:block" />
                )}

                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  {STEP_ICONS[index]}
                </div>
                <span className="font-display text-xs font-bold uppercase tracking-widest text-primary">
                  {step.step}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories / Sports */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {content.categories.title}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              {content.categories.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
            {content.categories.list.map((sport, index) => (
              <button
                key={index}
                onClick={() => navigate("/venues")}
                className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {SPORT_ICONS[index]}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {sport.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl shadow-primary/30 sm:px-16">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 size-36 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {content.cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                {content.cta.subtitle}
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="mt-8 gap-2 px-8 shadow-lg"
                onClick={() => navigate("/auth/signup")}
              >
                {content.cta.button}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
