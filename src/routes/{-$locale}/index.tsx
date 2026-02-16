import { getIntlayer } from "intlayer";
import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/pages/landing";

export const Route = createFileRoute("/{-$locale}/")({
  component: Landing,
  head: ({ params }) => {
    const { locale } = params;
    const metaContent = getIntlayer("landing-page", locale);

    return {
      meta: [
        { title: metaContent.meta.title },
        { content: metaContent.meta.description, name: "description" },
      ],
    };
  },
});
