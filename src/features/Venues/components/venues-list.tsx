import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useVenues } from "../api/hooks";
import { VenueCard } from "./venue-card";
import { useDebounce } from "@/hooks/useDebounce";
import type { SportType } from "../api/types";

const SPORT_VALUES: SportType[] = [
  "football",
  "basketball",
  "tennis",
  "volleyball",
  "swimming",
  "gym",
  "padel",
  "other",
];

interface Filters {
  sport_type: SportType | "";
  city: string;
  is_indoor: boolean | undefined;
  min_price: string;
  max_price: string;
}

const INITIAL_FILTERS: Filters = {
  sport_type: "",
  city: "",
  is_indoor: undefined,
  min_price: "",
  max_price: "",
};

function buildParams(filters: Filters) {
  const params: Record<string, unknown> = {};
  if (filters.sport_type) params.sport_type = filters.sport_type;
  if (filters.city.trim()) params.city = filters.city.trim();
  if (filters.is_indoor !== undefined) params.is_indoor = filters.is_indoor;
  if (filters.min_price) params.min_price = filters.min_price;
  if (filters.max_price) params.max_price = filters.max_price;
  return params;
}

export function VenuesList() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const navigate = useNavigate();
  const c = useIntlayer("venues-list");

  const debouncedCity = useDebounce(filters.city, 400);
  const debouncedMinPrice = useDebounce(filters.min_price, 400);
  const debouncedMaxPrice = useDebounce(filters.max_price, 400);

  const queryFilters: Filters = {
    ...filters,
    city: debouncedCity,
    min_price: debouncedMinPrice,
    max_price: debouncedMaxPrice,
  };

  const {
    data: venues,
    isLoading,
    isError,
  } = useVenues(buildParams(queryFilters));

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const hasActiveFilters =
    filters.sport_type ||
    filters.city ||
    filters.is_indoor !== undefined ||
    filters.min_price ||
    filters.max_price;

  const typeOptions = [
    { label: c.filters.type.all, value: undefined },
    { label: c.filters.type.indoor, value: true },
    { label: c.filters.type.outdoor, value: false },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{c.title}</h1>
          <p className="text-muted-foreground mt-1">{c.subtitle}</p>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border p-4 mb-8 flex flex-wrap gap-3 items-end">
          {/* Sport type */}
          <div className="flex flex-col gap-1 min-w-36">
            <label className="text-xs font-medium text-muted-foreground">
              {c.filters.sport.label}
            </label>
            <select
              value={filters.sport_type}
              onChange={(e) =>
                set("sport_type", e.target.value as SportType | "")
              }
              className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{c.filters.sport.all}</option>
              {SPORT_VALUES.map((v) => (
                <option key={v} value={v}>
                  {c.sports[v]}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col gap-1 min-w-36">
            <label className="text-xs font-medium text-muted-foreground">
              {c.filters.city.label}
            </label>
            <input
              type="text"
              placeholder={c.filters.city.placeholder.value as string}
              value={filters.city}
              onChange={(e) => set("city", e.target.value)}
              className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Price range */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              {c.filters.price.label}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={c.filters.price.min.value as string}
                min={0}
                value={filters.min_price}
                onChange={(e) => set("min_price", e.target.value)}
                className="h-9 w-20 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground text-sm">–</span>
              <input
                type="number"
                placeholder={c.filters.price.max.value as string}
                min={0}
                value={filters.max_price}
                onChange={(e) => set("max_price", e.target.value)}
                className="h-9 w-20 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Indoor toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              {c.filters.type.label}
            </label>
            <div className="flex rounded-lg border border-input overflow-hidden h-9 text-sm">
              {typeOptions.map(({ label, value }) => (
                <button
                  key={String(label.value)}
                  onClick={() => set("is_indoor", value)}
                  className={
                    filters.is_indoor === value
                      ? "px-3 bg-primary text-primary-foreground font-medium"
                      : "px-3 text-muted-foreground hover:bg-muted/40 transition-colors"
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors self-end"
            >
              {c.filters.clear}
            </button>
          )}
        </div>

        {/* Results */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border h-72 animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-muted-foreground">
            {c.error}
          </div>
        )}

        {!isLoading && !isError && venues?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-medium text-slate-900 mb-1">
              {c.empty.title}
            </p>
            <p className="text-muted-foreground">{c.empty.subtitle}</p>
          </div>
        )}

        {!isLoading && !isError && venues && venues.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {venues.length}{" "}
              {venues.length === 1 ? c.results.venue : c.results.venues}{" "}
              {c.results.found}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onClick={() =>
                    navigate({
                      to: "/{-$locale}/venues/$venueId" as any,
                      params: { venueId: venue.id } as any,
                    })
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
