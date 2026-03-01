import { Contacts } from "@/components/pages/contacts";
import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";

export const Route = createFileRoute("/{-$locale}/contacts")({
  component: Contacts,
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("contacts", locale).meta;

    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
