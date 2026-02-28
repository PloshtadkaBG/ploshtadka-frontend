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
    sections: {
      quickLinks: {
        title: t({ en: "Quick Links", bg: "Бързи връзки" }),
        venues: t({ en: "Browse Venues", bg: "Разгледай обекти" }),
        bookings: t({ en: "My Bookings", bg: "Моите резервации" }),
        about: t({ en: "About Us", bg: "За нас" }),
      },
      forOwners: {
        title: t({ en: "For Venue Owners", bg: "За собственици" }),
        listVenue: t({ en: "List Your Venue", bg: "Добави обект" }),
        pricing: t({ en: "Pricing", bg: "Цени" }),
        support: t({ en: "Support", bg: "Поддръжка" }),
      },
      connect: {
        title: t({ en: "Connect", bg: "Свържи се" }),
        contact: t({ en: "Contact Us", bg: "Свържи се с нас" }),
      },
    },
  },
} satisfies Dictionary;

export default footerContent;
