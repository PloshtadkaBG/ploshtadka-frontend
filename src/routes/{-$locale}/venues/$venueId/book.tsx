import { createFileRoute, redirect } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useVenue } from "@/features/Venues/api/hooks";
import { BookingForm } from "@/features/Bookings/components/booking-form";

function BookVenuePage() {
  const { venueId } = Route.useParams();
  const { data: venue, isLoading, isError } = useVenue(venueId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (isError || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Venue not found</h1>
        </div>
      </div>
    );
  }

  return <BookingForm venue={venue} />;
}

export const Route = createFileRoute("/{-$locale}/venues/$venueId/book")({
  component: BookVenuePage,
  beforeLoad: ({ location }) => {
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("access_token")
    ) {
      throw redirect({
        to: "/{-$locale}/auth/login",
        params: { locale: location.pathname.split("/")[1] },
        search: { redirect: location.href },
      });
    }
  },
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("booking-form", locale).meta;
    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
