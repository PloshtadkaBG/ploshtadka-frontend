import { t, type Dictionary } from "intlayer";

const landingContent = {
  key: "landing-page",
  content: {
    meta: {
      title: t({
        en: "Ploshtadka.BG | Rent Sports Facilities Instantly",
        bg: "Ploshtadka.BG | Наемете спортни съоръжения моментално",
      }),
      description: t({
        en: "The easiest way to book football pitches, tennis courts, and gyms near you.",
        bg: "Най-лесният начин да резервирате футболни игрища, тенис кортове и зали близо до вас.",
      }),
    },
    hero: {
      title: t({
        en: "Play Your Favorite Sport, Any Time, Anywhere",
        bg: "Играйте любимия си спорт, по всяко време, навсякъде",
      }),
      subtitle: t({
        en: "Discover and book premium sports facilities in your city. From football pitches to padel courts, we've got you covered.",
        bg: "Открийте и резервирайте първокласни спортни бази във вашия град. От футболни игрища до падел кортове, ние сме до вас.",
      }),
      ctaPrimary: t({ en: "Find a Court", bg: "Намери игрище" }),
      ctaSecondary: t({ en: "List Your Facility", bg: "Добави своята база" }),
    },
    features: {
      tagline: t({ en: "Why Choose Us", bg: "Защо да изберете нас" }),
      items: [
        {
          title: t({ en: "Instant Booking", bg: "Мигновена резервация" }),
          description: t({
            en: "No more phone calls. Book your slot in seconds.",
            bg: "Без повече телефонни разговори. Резервирайте за секунди.",
          }),
        },
        {
          title: t({ en: "Verified Venues", bg: "Проверени бази" }),
          description: t({
            en: "We personally verify the quality of every facility.",
            bg: "Лично проверяваме качеството на всяко съоръжение.",
          }),
        },
        {
          title: t({ en: "Easy Payments", bg: "Лесни плащания" }),
          description: t({
            en: "Secure online payments and split-the-bill options.",
            bg: "Сигурни онлайн плащания и опции за разделяне на сметката.",
          }),
        },
      ],
    },
    categories: {
      title: t({ en: "Popular Sports", bg: "Популярни спортове" }),
      list: [
        { name: t({ en: "Football", bg: "Футбол" }), icon: "⚽" },
        { name: t({ en: "Tennis", bg: "Тенис" }), icon: "🎾" },
        { name: t({ en: "Basketball", bg: "Баскетбол" }), icon: "🏀" },
        { name: t({ en: "Swimming", bg: "Плуване" }), icon: "🏊" },
      ],
    },
    footer: {
      rights: t({ en: "All rights reserved.", bg: "Всички права запазени." }),
      company: t({ en: "About Us", bg: "За нас" }),
      contact: t({ en: "Contact", bg: "Контакт" }),
    },
  },
} satisfies Dictionary;

export default landingContent;
