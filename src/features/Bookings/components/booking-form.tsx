import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking } from "../api/hooks";
import type { VenueResponse } from "@/features/Venues/api/types";

interface BookingFormProps {
  venue: VenueResponse;
}

function toLocalDateString(d: Date) {
  return d.toISOString().split("T")[0];
}

function combineDatetime(date: string, time: string): string {
  const d = new Date(`${date}T${time}:00`);
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${date}T${time}:00${sign}${hh}:${mm}`;
}

function getDurationHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

export function BookingForm({ venue }: BookingFormProps) {
  const c = useIntlayer("booking-form");
  const navigate = useNavigate();
  const createBooking = useCreateBooking();

  const today = toLocalDateString(new Date());
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const duration = useMemo(
    () => getDurationHours(startTime, endTime),
    [startTime, endTime],
  );

  const totalPrice = useMemo(() => {
    if (duration <= 0) return null;
    return (Number(venue.price_per_hour) * duration).toFixed(2);
  }, [duration, venue.price_per_hour]);

  const formattedDatetime = useMemo(() => {
    if (!date) return null;
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (duration < 1) {
      setError(c.errors.minDuration.value as string);
      return;
    }
    if (duration <= 0) {
      setError(c.errors.endBeforeStart.value as string);
      return;
    }

    try {
      await createBooking.mutateAsync({
        venue_id: venue.id,
        start_datetime: combineDatetime(date, startTime),
        end_datetime: combineDatetime(date, endTime),
        notes: notes.trim() || null,
      });
      navigate({ to: "/{-$locale}/bookings" as any } as any);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ??
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-6 py-8">
        {/* Back */}
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
            {/* Left: form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date */}
              <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
                <h2 className="font-semibold text-slate-900">
                  {c.sections.date}
                </h2>
                <Input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="max-w-xs"
                />
              </div>

              {/* Time */}
              <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
                <h2 className="font-semibold text-slate-900">
                  {c.sections.time}
                </h2>
                <div className="flex items-end gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      {c.labels.start}
                    </Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-36"
                    />
                  </div>
                  <span className="pb-2.5 text-muted-foreground">→</span>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      {c.labels.end}
                    </Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      className="w-36"
                    />
                  </div>
                  {duration > 0 && (
                    <div className="pb-2.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock size={14} />
                      {duration} {c.labels.hours}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
                <h2 className="font-semibold text-slate-900">
                  {c.sections.notes}
                </h2>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={c.notesPlaceholder.value as string}
                  rows={3}
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
                  {formattedDatetime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{formattedDatetime}</span>
                    </div>
                  )}
                  {duration > 0 ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {startTime} – {endTime}
                        </span>
                        <span className="font-medium tabular-nums">
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
                  disabled={createBooking.isPending || duration < 1}
                >
                  {createBooking.isPending
                    ? c.submit.submitting
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
