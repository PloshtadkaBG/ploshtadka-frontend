import { useIntlayer } from "react-intlayer";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMyBookings, useCancelBooking } from "../api/hooks";
import type { BookingStatus } from "../api/types";

const STATUS_VARIANT: Record<
  BookingStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  no_show: "destructive",
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  pending: "text-yellow-600 border-yellow-300 bg-yellow-50",
  confirmed: "text-green-700 border-green-300 bg-green-50",
  completed: "text-slate-600 border-slate-300 bg-slate-50",
  cancelled: "text-red-600 border-red-200 bg-red-50",
  no_show: "text-red-600 border-red-200 bg-red-50",
};

function formatDatetime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export function MyBookings() {
  const c = useIntlayer("my-bookings");
  const navigate = useNavigate();
  const { data: bookings, isLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">{c.title}</h1>

        {!bookings?.length ? (
          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center space-y-4">
            <p className="text-muted-foreground">{c.empty}</p>
            <Button
              variant="outline"
              onClick={() =>
                navigate({ to: "/{-$locale}/venues" as any } as any)
              }
            >
              {c.browseVenues}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const start = formatDatetime(booking.start_datetime);
              const end = formatDatetime(booking.end_datetime);
              const status = booking.status as BookingStatus;
              const isPending = status === "pending";

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border shadow-sm p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground font-mono">
                          {c.venue}: {booking.venue_id.slice(0, 8)}…
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                            STATUS_COLOR[status],
                          )}
                        >
                          {c.status[status]}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {start.date}
                        </span>
                        <span className="flex items-center gap-1 tabular-nums">
                          <Clock size={13} />
                          {start.time} – {end.time}
                        </span>
                      </div>

                      <p className="text-sm font-semibold">
                        {Number(booking.total_price).toFixed(2)} {booking.currency}
                      </p>
                    </div>

                    {isPending && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                        disabled={cancelBooking.isPending}
                        onClick={() => cancelBooking.mutate(booking.id)}
                      >
                        {cancelBooking.isPending
                          ? c.cancelling
                          : c.cancel}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
