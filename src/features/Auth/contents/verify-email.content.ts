import { t, type Dictionary } from "intlayer";

const verifyEmailContent = {
  key: "verify-email",
  content: {
    meta: {
      title: t({
        en: "Verify Email",
        bg: "Потвърждение на имейл",
      }),
      description: t({
        en: "Verifying your email address.",
        bg: "Потвърждаване на имейл адреса ви.",
      }),
    },
    verifying: t({
      en: "Verifying your email...",
      bg: "Потвърждаване на имейла ви...",
    }),
    success: {
      title: t({
        en: "Email verified!",
        bg: "Имейлът е потвърден!",
      }),
      description: t({
        en: "Your account is now active. You can sign in.",
        bg: "Акаунтът ви вече е активен. Можете да влезете.",
      }),
      button: t({ en: "Sign in", bg: "Вход" }),
    },
    error: {
      title: t({
        en: "Verification failed",
        bg: "Потвърждението не бе успешно",
      }),
      description: t({
        en: "The verification link is invalid or has expired.",
        bg: "Линкът за потвърждение е невалиден или е изтекъл.",
      }),
      retry: t({ en: "Try signing up again", bg: "Опитайте регистрация отново" }),
    },
    panel: {
      tagline: t({
        en: "Welcome aboard!",
        bg: "Добре дошли!",
      }),
      subtitle: t({
        en: "Your account is being activated.",
        bg: "Акаунтът ви се активира.",
      }),
    },
  },
} satisfies Dictionary;

export default verifyEmailContent;
