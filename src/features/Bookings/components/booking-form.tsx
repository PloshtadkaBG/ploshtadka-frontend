import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer, useLocaleStorage } from "react-intlayer";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useCreateBooking,
  useCreateCheckout,
  useMyBookings,
  useOccupiedSlots,
} from "../api/hooks";
import type { VenueResponse } from "@/features/Venues/api/types";

interface BookingFormProps {
  venue: VenueResponse;
}

// JS getDay() 0=Sun…6=Sat → Python weekday 0=Mon…6=Sun
function jsDateToVenueKey(d: Date): string {
  return String((d.getDay() + 6) % 7);
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function offsetAwareISO(dateStr: string, hour: number): string {
  const d = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00`);
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${dateStr}T${String(hour).padStart(2, "0")}:00:00${sign}${hh}:${mm}`;
}

type CellState =
  | "available"
  | "outside"
  | "unavailable"
  | "booked"
  | "mine"
  | "selected"
  | "past";

const CELL_CLASSES: Record<CellState, string> = {
  available: "bg-white hover:bg-emerald-50 cursor-pointer border-slate-100",
  outside: "bg-slate-100 cursor-default border-slate-100",
  unavailable: "bg-amber-50 cursor-default border-amber-100",
  booked: "bg-red-100 cursor-default border-red-200",
  mine: "bg-blue-100 cursor-default border-blue-200",
  selected: "bg-emerald-100 border-emerald-300 cursor-pointer",
  past: "bg-slate-50 cursor-default border-slate-100 opacity-50",
};

const LEGEND: { key: CellState; labelKey: string }[] = [
  { key: "available", labelKey: "available" },
  { key: "selected", labelKey: "selected" },
  { key: "mine", labelKey: "mine" },
  { key: "booked", labelKey: "booked" },
  { key: "unavailable", labelKey: "unavailable" },
  { key: "outside", labelKey: "closed" },
];

export function BookingForm({ venue }: BookingFormProps) {
  const c = useIntlayer("booking-form");
  const navigate = useNavigate();
  const { getLocale } = useLocaleStorage();
  const createBooking = useCreateBooking();
  const createCheckout = useCreateCheckout(getLocale());
  const { data: myBookings = [] } = useMyBookings();
  const { data: occupiedSlots = [] } = useOccupiedSlots(venue.id);

  const [weekOffset, setWeekOffset] = useState(0); // in days
  const [selDate, setSelDate] = useState<string | null>(null);
  const [selStart, setSelStart] = useState<number | null>(null); // hour (inclusive)
  const [selEnd, setSelEnd] = useState<number | null>(null); // hour (inclusive)
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 7-day window
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + weekOffset + i);
      return d;
    });
  }, [weekOffset]);

  // Hour range from working_hours
  const [minHour, maxHour] = useMemo(() => {
    let min = 8,
      max = 22;
    for (const v of Object.values(venue.working_hours)) {
      if (!v) continue;
      const o = parseInt(v.open);
      const c = parseInt(v.close);
      if (o < min) min = o;
      if (c > max) max = c;
    }
    return [min, max];
  }, [venue.working_hours]);

  const hours = useMemo(
    () => Array.from({ length: maxHour - minHour }, (_, i) => minHour + i),
    [minHour, maxHour],
  );

  // My bookings for this venue
  const myVenueBookings = useMemo(
    () =>
      myBookings.filter(
        (b) =>
          b.venue_id === venue.id &&
          b.status !== "cancelled" &&
          b.status !== "no_show",
      ),
    [myBookings, venue.id],
  );

  function getCellState(
    dateStr: string,
    hour: number,
    dateObj: Date,
  ): CellState {
    // Past slots
    const now = new Date();
    const nowDate = isoDate(now);
    if (dateStr < nowDate || (dateStr === nowDate && hour < now.getHours())) {
      return "past";
    }

    // Working hours
    const key = jsDateToVenueKey(dateObj);
    const wh = venue.working_hours[key] ?? venue.working_hours["default"];
    if (!wh || hour < parseInt(wh.open) || hour >= parseInt(wh.close)) {
      return "outside";
    }

    // Venue unavailabilities
    const cellStart = new Date(
      `${dateStr}T${String(hour).padStart(2, "0")}:00:00`,
    );
    const cellEnd = new Date(
      `${dateStr}T${String(hour + 1).padStart(2, "0")}:00:00`,
    );
    for (const u of venue.unavailabilities) {
      const us = new Date(u.start_datetime);
      const ue = new Date(u.end_datetime);
      if (cellStart < ue && cellEnd > us) return "unavailable";
    }

    // Others' bookings (anonymous — just the time window)
    for (const b of occupiedSlots) {
      const bs = new Date(b.start_datetime);
      const be = new Date(b.end_datetime);
      if (cellStart < be && cellEnd > bs) return "booked";
    }

    // My bookings (shown differently so user recognises their own)
    for (const b of myVenueBookings) {
      const bs = new Date(b.start_datetime);
      const be = new Date(b.end_datetime);
      if (cellStart < be && cellEnd > bs) return "mine";
    }

    // Selected range
    if (selDate === dateStr && selStart !== null) {
      const lo = selEnd !== null ? Math.min(selStart, selEnd) : selStart;
      const hi = selEnd !== null ? Math.max(selStart, selEnd) : selStart;
      if (hour >= lo && hour <= hi) return "selected";
    }

    return "available";
  }

  function handleCellClick(dateStr: string, hour: number, state: CellState) {
    if (
      state === "outside" ||
      state === "unavailable" ||
      state === "booked" ||
      state === "mine" ||
      state === "past"
    )
      return;

    if (selDate !== dateStr || selStart === null) {
      // New selection
      setSelDate(dateStr);
      setSelStart(hour);
      setSelEnd(null);
    } else if (selEnd === null) {
      // Set end (allow clicking start again to clear)
      if (hour === selStart) {
        setSelStart(null);
        setSelDate(null);
      } else {
        const lo = Math.min(selStart, hour);
        const hi = Math.max(selStart, hour);
        setSelStart(lo);
        setSelEnd(hi);
      }
    } else {
      // Reset and start new
      setSelDate(dateStr);
      setSelStart(hour);
      setSelEnd(null);
    }
    setError(null);
  }

  const duration =
    selStart !== null && selEnd !== null
      ? selEnd - selStart + 1
      : selStart !== null
        ? 1
        : 0;
  const totalPrice =
    duration > 0 ? (Number(venue.price_per_hour) * duration).toFixed(2) : null;

  const formattedSel = useMemo(() => {
    if (!selDate || selStart === null) return null;
    const d = new Date(selDate + "T00:00:00");
    const dateLabel = d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const endH = selEnd ?? selStart;
    return `${dateLabel} · ${String(selStart).padStart(2, "0")}:00 – ${String(endH + 1).padStart(2, "0")}:00`;
  }, [selDate, selStart, selEnd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selDate || selStart === null) {
      setError(c.errors.selectSlot.value as string);
      return;
    }
    const endH = selEnd ?? selStart;
    let booking;
    try {
      booking = await createBooking.mutateAsync({
        venue_id: venue.id,
        start_datetime: offsetAwareISO(selDate, selStart),
        end_datetime: offsetAwareISO(selDate, endH + 1),
        notes: notes.trim() || null,
      });
    } catch (err: any) {
      const httpStatus = err?.response?.status;
      console.error("[booking]", err?.response?.data?.detail ?? err);
      if (httpStatus === 409) {
        setError(c.errors.conflict.value as string);
      } else {
        setError(c.errors.generic.value as string);
      }
      return;
    }

    try {
      const { checkout_url, payment_id } = await createCheckout.mutateAsync(
        booking.id,
      );
      if (!checkout_url.startsWith("https://checkout.stripe.com/")) {
        throw new Error("Unexpected checkout URL");
      }
      sessionStorage.setItem("pending_payment_id", payment_id);
      window.location.href = checkout_url;
    } catch (err: any) {
      console.error("[checkout]", err?.response?.data?.detail ?? err);
      setError(c.errors.checkoutFailed.value as string);
      navigate({ to: "/{-$locale}/bookings" as any } as any);
    }
  };

  const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/{-$locale}/venues/$venueId" as any,
              params: { venueId: venue.id } as any,
            })
          }
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          {c.back}
        </button>

        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {c.title} <span className="text-primary">{venue.name}</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: grid */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border shadow-sm p-4">
                {/* Week nav */}
                <div className="flex items-center justify-between mb-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={weekOffset <= 0}
                    onClick={() => setWeekOffset((o) => o - 7)}
                  >
                    {c.grid.prev}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {c.grid.instruction}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setWeekOffset((o) => o + 7)}
                  >
                    {c.grid.next}
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr>
                        <th className="w-12" />
                        {dates.map((d) => {
                          const ds = isoDate(d);
                          const isToday = ds === isoDate(new Date());
                          return (
                            <th
                              key={ds}
                              className={cn(
                                "text-center pb-2 font-medium px-1",
                                isToday ? "text-primary" : "text-slate-500",
                              )}
                            >
                              <div>{DAY_SHORT[(d.getDay() + 6) % 7]}</div>
                              <div
                                className={cn(
                                  "text-base font-bold",
                                  isToday && "text-primary",
                                )}
                              >
                                {d.getDate()}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map((hour) => (
                        <tr key={hour}>
                          <td className="text-right pr-2 text-slate-400 tabular-nums py-0 leading-none w-12">
                            {String(hour).padStart(2, "0")}:00
                          </td>
                          {dates.map((d) => {
                            const ds = isoDate(d);
                            const state = getCellState(ds, hour, d);
                            return (
                              <td
                                key={ds}
                                onClick={() => handleCellClick(ds, hour, state)}
                                className={cn(
                                  "h-8 border text-center transition-colors",
                                  CELL_CLASSES[state],
                                  state === "selected" &&
                                    selDate === ds &&
                                    (hour === (selStart ?? -1) ||
                                      hour === (selEnd ?? selStart ?? -1)) &&
                                    "font-bold",
                                )}
                              />
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-100">
                  {LEGEND.map(({ key, labelKey }) => (
                    <div
                      key={key}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <div
                        className={cn(
                          "w-3 h-3 rounded-sm border",
                          CELL_CLASSES[key],
                        )}
                      />
                      {(c.grid.legend as any)[labelKey]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-3">
                <h2 className="font-semibold text-slate-900 text-sm">
                  {c.sections.notes}
                </h2>
                <Textarea
                  value={notes}
                  maxLength={1000}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={c.notesPlaceholder.value as string}
                  rows={2}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}
            </div>

            {/* Right: summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl border shadow-sm p-6 space-y-5">
                <div>
                  <p className="font-semibold text-slate-900 truncate">
                    {venue.name}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold">
                      {Number(venue.price_per_hour).toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {venue.currency} {c.summary.perHour}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  {formattedSel ? (
                    <>
                      <p className="font-medium text-slate-800">
                        {formattedSel}
                      </p>
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          {duration} {c.labels.hours}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-base pt-1 border-t border-slate-100">
                        <span>{c.summary.total}</span>
                        <span>
                          {totalPrice} {venue.currency}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-xs">
                      {c.summary.noTime}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl"
                  disabled={
                    createBooking.isPending ||
                    createCheckout.isPending ||
                    !selDate ||
                    selStart === null
                  }
                >
                  {createBooking.isPending
                    ? c.submit.submitting
                    : createCheckout.isPending
                      ? c.submit.redirecting
                      : c.submit.idle}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
