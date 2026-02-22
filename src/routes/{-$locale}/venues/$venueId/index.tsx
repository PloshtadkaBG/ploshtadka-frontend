import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useVenue } from "@/features/Venues/api/hooks";
import { VenueDetail } from "@/features/Venues/components/venue-detail";

function VenueDetailPage() {
  const { venueId } = Route.useParams();
  const { data: venue, isLoading, isError } = useVenue(venueId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading venue...</div>
      </div>
    );
  }

  if (isError || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Venue not found</h1>
          <p className="text-muted-foreground">
            This venue doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return <VenueDetail venue={venue} />;
}

export const Route = createFileRoute("/{-$locale}/venues/$venueId/")({
  component: VenueDetailPage,
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("venue-detail", locale).meta;
    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
