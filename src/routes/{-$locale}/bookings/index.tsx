import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { MyBookings } from "@/features/Bookings/components/my-bookings";

export const Route = createFileRoute("/{-$locale}/bookings/")({
  component: MyBookings,
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("my-bookings", locale).meta;
    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
