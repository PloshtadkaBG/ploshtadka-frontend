import { t, type Dictionary } from "intlayer";

const bookingFormContent = {
  key: "booking-form",
  content: {
    meta: {
      title: t({ en: "Book Venue | SportSpot", bg: "Резервирай база | SportSpot" }),
      description: t({
        en: "Book your slot at this venue.",
        bg: "Резервирайте своя час в тази база.",
      }),
    },
    back: t({ en: "Back to venue", bg: "Към базата" }),
    title: t({ en: "Book", bg: "Резервирай" }),
    sections: {
      date: t({ en: "Select date", bg: "Избери дата" }),
      time: t({ en: "Select time", bg: "Избери час" }),
      notes: t({ en: "Notes (optional)", bg: "Бележки (незадължително)" }),
    },
    labels: {
      start: t({ en: "From", bg: "От" }),
      end: t({ en: "To", bg: "До" }),
      duration: t({ en: "Duration", bg: "Продължителност" }),
      hours: t({ en: "h", bg: "ч" }),
    },
    errors: {
      minDuration: t({
        en: "Minimum booking duration is 1 hour.",
        bg: "Минималната продължителност е 1 час.",
      }),
      endBeforeStart: t({
        en: "End time must be after start time.",
        bg: "Крайният час трябва да е след началния.",
      }),
    },
    summary: {
      perHour: t({ en: "/ hr", bg: "/ час" }),
      total: t({ en: "Total", bg: "Общо" }),
      noTime: t({ en: "Select times above", bg: "Изберете часове по-горе" }),
    },
    submit: {
      idle: t({ en: "Confirm Booking", bg: "Потвърди резервация" }),
      submitting: t({ en: "Booking...", bg: "Резервиране..." }),
    },
    notesPlaceholder: t({
      en: "Any special requests or notes for the venue...",
      bg: "Специални изисквания или бележки за базата...",
    }),
  },
} satisfies Dictionary;

export default bookingFormContent;
