import NotFound from "@/components/pages/not-found";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { defaultLocale, validatePrefix } from "intlayer";

export const Route = createFileRoute("/{-$locale}")({
  // beforeLoad runs before the route renders (on both server and client)
  // It's the ideal place to validate the locale prefix
  beforeLoad: ({ params }) => {
    const localeParam = params.locale;

    // No locale prefix at all (e.g. visiting /) — redirect to home with default locale
    if (!localeParam) {
      throw redirect({
        to: "/{-$locale}/",
        params: { locale: defaultLocale },
      });
    }

    // validatePrefix checks if the locale is valid according to your intlayer config
    const { isValid, localePrefix } = validatePrefix(localeParam);

    if (!isValid) {
      // Invalid locale prefix - redirect to the 404 page with a valid locale prefix
      throw redirect({
        to: "/{-$locale}/404",
        params: { locale: localePrefix },
      });
    }
  },
  component: Outlet,
  // notFoundComponent is called when a child route doesn't exist
  // e.g., /en/non-existent-page triggers this within the /en layout
  notFoundComponent: NotFound,
});
