import { t, type Dictionary } from "intlayer";

const loginFormContent = {
  key: "login",
  content: {
    meta: {
      title: t({
        en: "Login | Access Your Account",
        bg: "Вход | Достъп до профила",
      }),
      description: t({
        en: "Log in to your account to access your dashboard, settings, and personal data.",
        bg: "Влезте в профила си, за да получите достъп до вашето табло, настройки и лични данни.",
      }),
    },
    title: t({
      en: "Login to your account",
      bg: "Влезте в профила си",
    }),
    description: t({
      en: "Enter your email below to login to your account",
      bg: "Въведете имейла си по-долу, за да влезете в профила си",
    }),
    email: {
      label: t({
        en: "Email",
        bg: "Имейл",
      }),
    },
    password: {
      label: t({
        en: "Password",
        bg: "Парола",
      }),
      forgotLink: t({
        en: "Forgot password?",
        bg: "Забравена парола?",
      }),
    },
    loginButton: {
      idle: t({
        en: "Login",
        bg: "Вход",
      }),
      submitting: t({
        en: "Logging in...",
        bg: "Влизане...",
      }),
    },
    termsText: t({
      en: "By proceeding you are agreeing to our",
      bg: "Като продължите, вие се съгласявате с нашите",
    }),
    termsLink: t({
      en: "Terms and Conditions",
      bg: "Общи условия",
    }),
    orSeparator: t({
      en: "Or",
      bg: "Или",
    }),
    signupButton: t({
      en: "Sign up",
      bg: "Регистрация",
    }),
  },
} satisfies Dictionary;

export default loginFormContent;
