import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Star, Users } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import type { VenueListItem } from "../api/types";

const SPORT_COLORS: Record<string, string> = {
  football: "bg-green-500",
  basketball: "bg-orange-500",
  tennis: "bg-yellow-500",
  volleyball: "bg-blue-500",
  swimming: "bg-cyan-500",
  gym: "bg-purple-500",
  padel: "bg-pink-500",
  other: "bg-slate-500",
};

interface VenueCardProps {
  venue: VenueListItem;
  onClick?: () => void;
}

export function VenueCard({ venue, onClick }: VenueCardProps) {
  const c = useIntlayer("venues-list");
  const primarySport = venue.sport_types[0];
  const extraSports = venue.sport_types.length - 2;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {venue.thumbnail ? (
          <img
            src={venue.thumbnail}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center",
              primarySport ? SPORT_COLORS[primarySport] : "bg-slate-300",
            )}
          >
            <span className="text-white/30 text-6xl font-black select-none">
              {venue.name[0]}
            </span>
          </div>
        )}

        {/* Indoor badge */}
        {venue.is_indoor && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 text-slate-700 text-xs"
            >
              {c.card.indoor}
            </Badge>
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5 text-xs font-semibold">
          <Star size={11} className="text-yellow-500 fill-yellow-500" />
          {Number(venue.rating).toFixed(1)}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-slate-900 leading-tight truncate">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin size={11} />
            {venue.city}
          </div>
        </div>

        {/* Sport type badges */}
        <div className="flex flex-wrap gap-1.5">
          {venue.sport_types.slice(0, 2).map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">
              {c.sports[s] ?? s}
            </Badge>
          ))}
          {extraSports > 0 && (
            <Badge variant="outline" className="text-xs">
              +{extraSports}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users size={11} />
            {venue.capacity}
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {Number(venue.price_per_hour).toFixed(0)}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              {venue.currency}
              {c.card.perHour}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
