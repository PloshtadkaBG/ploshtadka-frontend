import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useVenue } from "@/features/Venues/api/hooks";
import { BookingForm } from "@/features/Bookings/components/booking-form";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { useEffect } from "react";

function BookVenuePage() {
  const { venueId } = Route.useParams();
  const { data: venue, isLoading, isError } = useVenue(venueId);
  const navigate = useLocalizedNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("access_token")
    ) {
      navigate({ to: "/auth/login" });
    }
  }, [navigate]);

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
