import { AboutUs } from "@/components/pages/about-us";
import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";

export const Route = createFileRoute("/{-$locale}/about-us")({
  component: AboutUs,
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("about-us", locale).meta;

    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
