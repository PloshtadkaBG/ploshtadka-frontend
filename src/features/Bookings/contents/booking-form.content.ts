import { t, type Dictionary } from "intlayer";

const bookingFormContent = {
  key: "booking-form",
  content: {
    meta: {
      title: t({
        en: "Book Venue | SportSpot",
        bg: "Резервирай база | SportSpot",
      }),
      description: t({
        en: "Book your slot at this venue.",
        bg: "Резервирайте своя час в тази база.",
      }),
    },
    back: t({ en: "Back to venue", bg: "Към базата" }),
    title: t({ en: "Book", bg: "Резервирай" }),
    grid: {
      instruction: t({
        en: "Click a slot to start, click another to set the end",
        bg: "Кликни за начало, кликни отново за края",
      }),
      prev: t({ en: "← Prev", bg: "← Назад" }),
      next: t({ en: "Next →", bg: "Напред →" }),
      legend: {
        available: t({ en: "Available", bg: "Свободно" }),
        closed: t({ en: "Closed", bg: "Затворено" }),
        unavailable: t({ en: "Unavailable", bg: "Недостъпно" }),
        mine: t({ en: "My booking", bg: "Моя резервация" }),
        booked: t({ en: "Booked", bg: "Заето" }),
        selected: t({ en: "Selected", bg: "Избрано" }),
      },
    },
    sections: {
      notes: t({ en: "Notes (optional)", bg: "Бележки (незадължително)" }),
    },
    labels: {
      hours: t({ en: "h", bg: "ч" }),
    },
    errors: {
      minDuration: t({
        en: "Minimum booking duration is 1 hour.",
        bg: "Минималната продължителност е 1 час.",
      }),
      selectSlot: t({
        en: "Please select a time slot on the grid.",
        bg: "Моля изберете час от таблицата.",
      }),
    },
    summary: {
      perHour: t({ en: "/ hr", bg: "/ час" }),
      total: t({ en: "Total", bg: "Общо" }),
      noTime: t({
        en: "Select a slot on the grid",
        bg: "Изберете час от таблицата",
      }),
    },
    submit: {
      idle: t({ en: "Confirm Booking", bg: "Потвърди резервация" }),
      submitting: t({ en: "Booking...", bg: "Резервиране..." }),
    },
    notesPlaceholder: t({
      en: "Any special requests...",
      bg: "Специални изисквания...",
    }),
  },
} satisfies Dictionary;

export default bookingFormContent;
