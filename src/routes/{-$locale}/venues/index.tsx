import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { VenuesList } from "@/features/Venues/components/venues-list";

export const Route = createFileRoute("/{-$locale}/venues/")({
  component: VenuesList,
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("venues-list", locale).meta;
    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
