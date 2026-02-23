import { t, type Dictionary } from "intlayer";

const myBookingsContent = {
  key: "my-bookings",
  content: {
    meta: {
      title: t({
        en: "My Bookings | Ploshtadka.BG",
        bg: "Моите резервации | Ploshtadka.BG",
      }),
      description: t({
        en: "View and manage your venue bookings.",
        bg: "Преглед и управление на вашите резервации.",
      }),
    },
    title: t({ en: "My Bookings", bg: "Моите резервации" }),
    empty: t({
      en: "No bookings yet. Browse venues to get started.",
      bg: "Нямате резервации. Разгледайте базите, за да започнете.",
    }),
    browseVenues: t({ en: "Browse venues", bg: "Разгледайте бази" }),
    cancel: t({ en: "Cancel", bg: "Откажи" }),
    cancelling: t({ en: "Cancelling...", bg: "Отказване..." }),
    payNow: t({ en: "Pay Now", bg: "Плати" }),
    paying: t({ en: "Loading...", bg: "Зарежда..." }),
    venue: t({ en: "Venue", bg: "База" }),
    total: t({ en: "Total", bg: "Общо" }),
    toasts: {
      paymentSuccess: t({
        en: "Payment successful! Your booking will be confirmed shortly.",
        bg: "Плащането е успешно! Резервацията ви ще бъде потвърдена скоро.",
      }),
      paymentCancelled: t({
        en: "Payment cancelled. Your booking has been released — please rebook.",
        bg: "Плащането е отказано. Резервацията ви е освободена — моля резервирайте отново.",
      }),
    },
    paymentStatus: {
      pending: t({ en: "Awaiting payment", bg: "Очаква плащане" }),
      paid: t({ en: "Paid", bg: "Платено" }),
      refunded: t({ en: "Refunded", bg: "Възстановено" }),
      failed: t({ en: "Payment failed", bg: "Неуспешно плащане" }),
    },
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
