import { type IntlayerConfig, Locales } from "intlayer";

const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.BULGARIAN],
    defaultLocale: Locales.BULGARIAN,
  },
  routing: {
    mode: "prefix-all",
    storage: "localStorage",
  },
};

export default config;
