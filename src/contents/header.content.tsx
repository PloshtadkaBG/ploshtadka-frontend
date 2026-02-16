import { t, type Dictionary } from "intlayer";

const headerContent = {
  key: "header",
  content: {
    brand: t({
      en: "Acme Inc.",
      bg: "Acme Inc.",
    }),
    navLinks: [
      {
        href: "/about-us",
        label: t({ en: "About", bg: "За нас" }),
      },
      {
        href: "/features",
        label: t({ en: "Features", bg: "Възможности" }),
      },
      {
        href: "/pricing",
        label: t({ en: "Pricing", bg: "Цени" }),
      },
    ],
    account: t({
      en: "Account",
      bg: "Профил",
    }),
    aria: {
      nav: t({ en: "Primary", bg: "Основна навигация" }),
      toggle: t({ en: "Toggle menu", bg: "Превключване на менюто" }),
    },
  },
} satisfies Dictionary;

export default headerContent;
