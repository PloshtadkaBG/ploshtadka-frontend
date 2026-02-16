import { type IntlayerConfig, Locales } from "intlayer";

const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.BULGARIAN],
    defaultLocale: Locales.BULGARIAN,
  },
};

export default config;
