import { t, type Dictionary } from "intlayer";

const myBookingsContent = {
  key: "my-bookings",
  content: {
    meta: {
      title: t({ en: "My Bookings | Ploshtadka.BG", bg: "Моите резервации | Ploshtadka.BG" }),
      description: t({
        en: "View and manage your venue bookings.",
        bg: "Преглед и управление на вашите резервации.",
      }),
    },
    title: t({ en: "My Bookings", bg: "Моите резервации" }),
    empty: t({ en: "No bookings yet. Browse venues to get started.", bg: "Нямате резервации. Разгледайте базите, за да започнете." }),
    browseVenues: t({ en: "Browse venues", bg: "Разгледайте бази" }),
    cancel: t({ en: "Cancel", bg: "Откажи" }),
    cancelling: t({ en: "Cancelling...", bg: "Отказване..." }),
    venue: t({ en: "Venue", bg: "База" }),
    total: t({ en: "Total", bg: "Общо" }),
    status: {
      pending: t({ en: "Pending", bg: "Изчаква" }),
      confirmed: t({ en: "Confirmed", bg: "Потвърдена" }),
      completed: t({ en: "Completed", bg: "Завършена" }),
      cancelled: t({ en: "Cancelled", bg: "Отказана" }),
      no_show: t({ en: "No show", bg: "Не се явил" }),
    },
  },
} satisfies Dictionary;

export default myBookingsContent;
