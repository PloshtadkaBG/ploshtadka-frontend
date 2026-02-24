import { t, type Dictionary } from "intlayer";

const footerContent = {
  key: "footer",
  content: {
    brand: t({
      en: "Ploshtadka.BG",
      bg: "Ploshtadka.BG",
    }),
    tagline: t({
      en: "Find and book sports venues near you.",
      bg: "Намери и резервирай спортни обекти близо до теб.",
    }),
    builtWith: t({
      en: "built with shadcn/ui",
      bg: "изградено със shadcn/ui",
    }),
    copyright: t({
      en: "© 2026 Ploshtadka.BG. All rights reserved.",
      bg: "© 2026 Ploshtadka.BG. Всички права запазени.",
    }),
    links: {
      about: t({ en: "About", bg: "За нас" }),
      features: t({ en: "Features", bg: "Възможности" }),
      pricing: t({ en: "Pricing", bg: "Цени" }),
    },
  },
} satisfies Dictionary;

export default footerContent;
