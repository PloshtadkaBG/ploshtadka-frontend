import { t, type Dictionary } from "intlayer";

const userNavContent = {
  key: "user-nav",
  content: {
    labels: {
      login: t({
        en: "Login",
        bg: "Влез",
      }),
      settings: t({
        en: "Settings",
        bg: "Настройки",
      }),
      logout: t({
        en: "Logout",
        bg: "Излез",
      }),
    },
  },
} satisfies Dictionary;

export default userNavContent;
