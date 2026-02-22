import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import type { VenueResponse } from "../api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Star,
  Users,
  Clock,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  inactive: "secondary",
  maintenance: "outline",
  pending_approval: "outline",
};

// Python weekday(): 0=Monday … 6=Sunday
const DAY_KEYS = ["0", "1", "2", "3", "4", "5", "6"] as const;

interface VenueDetailProps {
  venue: VenueResponse;
}

export function VenueDetail({ venue }: VenueDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const localizedNavigate = useLocalizedNavigate();
  const c = useIntlayer("venue-detail");

  const images = venue.images.length > 0 ? venue.images : [];
  const mainImage = images[selectedImage];

  // JS getDay(): 0=Sun…6=Sat → Python weekday(): 0=Mon…6=Sun
  const todayKey = String((new Date().getDay() + 6) % 7);
  const todayHours =
    venue.working_hours[todayKey] ?? venue.working_hours["default"];

  const todayStr = new Date().toISOString().split("T")[0];
  const todayUnavailabilities = venue.unavailabilities.filter((u) => {
    const start = u.start_datetime.split("T")[0];
    const end = u.end_datetime.split("T")[0];
    return start <= todayStr && end >= todayStr;
  });

  const handleBook = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      localizedNavigate("/auth/login");
    } else {
      navigate({
        to: "/{-$locale}/venues/$venueId/book" as any,
        params: { venueId: venue.id } as any,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate({ to: "/{-$locale}/venues" as any } as any)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          {c.back}
        </button>

        {/* Image gallery */}
        <div className="mb-6">
          <div className="rounded-2xl overflow-hidden bg-slate-200 aspect-video relative">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                {c.noImages}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    i === selectedImage
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {venue.sport_types.map((s) => (
                  <Badge key={s} variant="secondary">
                    {c.sports[s] ?? s}
                  </Badge>
                ))}
                <Badge variant={STATUS_VARIANT[venue.status] ?? "outline"}>
                  {c.status[venue.status] ?? venue.status}
                </Badge>
                <Badge variant="outline">
                  {venue.is_indoor ? c.indoor : c.outdoor}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {venue.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {venue.address}, {venue.city}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  {Number(venue.rating).toFixed(1)}
                  <span className="text-muted-foreground/60">
                    ({venue.total_reviews})
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {c.upTo} {venue.capacity} {c.people}
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-3">{c.sections.about}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {venue.description}
              </p>
            </div>

            {/* Amenities */}
            {venue.amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    {c.sections.amenities}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((a) => (
                      <Badge
                        key={a}
                        variant="outline"
                        className="capitalize gap-1"
                      >
                        <CheckCircle size={11} className="text-green-500" />
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Working hours */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                {c.sections.workingHours}
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-12">
                {DAY_KEYS.map((day) => {
                  const hours =
                    venue.working_hours[day] ?? venue.working_hours["default"];
                  const isToday = day === todayKey;
                  return (
                    <div
                      key={day}
                      className={cn(
                        "flex justify-between py-2 border-b border-slate-100 text-sm last:border-0",
                        isToday && "font-semibold text-primary",
                      )}
                    >
                      <span>{c.days[day]}</span>
                      {hours ? (
                        <span
                          className={cn(
                            "tabular-nums",
                            isToday ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">
                          {c.closed}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's unavailabilities */}
            {todayUnavailabilities.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  {c.sections.unavailableToday}
                </h2>
                <div className="space-y-2">
                  {todayUnavailabilities.map((u) => {
                    const startTime = new Date(
                      u.start_datetime,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const endTime = new Date(u.end_datetime).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );
                    return (
                      <div
                        key={u.id}
                        className="flex items-center gap-2 text-sm text-muted-foreground bg-orange-50 border border-orange-100 rounded-lg px-3 py-2"
                      >
                        <Clock size={14} className="text-orange-500 shrink-0" />
                        <span className="tabular-nums">
                          {startTime} – {endTime}
                        </span>
                        {u.reason && (
                          <span className="text-muted-foreground/70">
                            · {u.reason}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border shadow-sm p-6 space-y-5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-slate-900">
                  {Number(venue.price_per_hour).toFixed(0)}
                </span>
                <span className="text-muted-foreground text-sm">
                  {venue.currency} {c.bookingCard.perHour}
                </span>
              </div>

              <Separator />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {c.bookingCard.today}
                  </span>
                  <span className="font-medium">
                    {todayHours
                      ? `${todayHours.open} – ${todayHours.close}`
                      : c.bookingCard.closed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {c.bookingCard.capacity}
                  </span>
                  <span className="font-medium">
                    {venue.capacity} {c.bookingCard.people}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {c.bookingCard.type}
                  </span>
                  <span className="font-medium">
                    {venue.is_indoor ? c.indoor : c.outdoor}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full rounded-xl"
                disabled={venue.status !== "active"}
                onClick={handleBook}
              >
                {venue.status === "active"
                  ? c.bookingCard.bookNow
                  : c.bookingCard.unavailable}
              </Button>

              {venue.status !== "active" && (
                <p className="text-xs text-muted-foreground text-center">
                  {c.bookingCard.statusNote}{" "}
                  <span className="lowercase">
                    {c.status[venue.status] ?? venue.status}
                  </span>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
