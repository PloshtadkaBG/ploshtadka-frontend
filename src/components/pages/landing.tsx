import { useIntlayer } from "react-intlayer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarCheck, CreditCard, ShieldCheck } from "lucide-react";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";

export function Landing() {
  const content = useIntlayer("landing-page");
  const navigate = useLocalizedNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-6 text-center relative z-10">
          <Badge variant="outline" className="mb-4 border-primary text-primary">
            {content.categories.list[0].name} •{" "}
            {content.categories.list[1].name} •{" "}
            {content.categories.list[2].name}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto">
            {content.hero.title}
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            {content.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full px-8"
              onClick={() => navigate("/venues")}
            >
              {content.hero.ctaPrimary}
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">
              {content.hero.ctaSecondary}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">{content.features.tagline}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {content.features.items.map((item, index) => (
              <Card
                key={index}
                className="border-none shadow-sm bg-slate-50/50"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    {index === 0 && <CalendarCheck size={24} />}
                    {index === 1 && <ShieldCheck size={24} />}
                    {index === 2 && <CreditCard size={24} />}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories / Sports */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {content.categories.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.categories.list.map((sport, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-slate-800 p-8 rounded-2xl text-center hover:bg-primary transition-colors"
              >
                <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">
                  {sport.icon.value}
                </span>
                <span className="font-semibold text-lg">{sport.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="mt-auto border-t py-12 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <nav className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition">
              {content.footer.company}
            </Link>
            <Link to="/contact" className="hover:text-primary transition">
              {content.footer.contact}
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ploshtadka.BG. {content.footer.rights}
          </p>
          <p className="text-xs text-muted-foreground/40 mt-1">
            built with shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}
