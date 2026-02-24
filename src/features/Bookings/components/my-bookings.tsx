import { useEffect, useRef, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Calendar, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMyBookings,
  useCancelBooking,
  useMyPayments,
  useCreateCheckout,
  useAbandonPayment,
} from "../api/hooks";
import type { BookingStatus, PaymentStatus } from "../api/types";

const STATUS_COLOR: Record<BookingStatus, string> = {
  pending: "text-yellow-600 border-yellow-300 bg-yellow-50",
  confirmed: "text-green-700 border-green-300 bg-green-50",
  completed: "text-slate-600 border-slate-300 bg-slate-50",
  cancelled: "text-red-600 border-red-200 bg-red-50",
  no_show: "text-red-600 border-red-200 bg-red-50",
};

const PAYMENT_COLOR: Record<PaymentStatus, string> = {
  pending: "text-orange-600 border-orange-200 bg-orange-50",
  paid: "text-emerald-700 border-emerald-300 bg-emerald-50",
  refunded: "text-blue-600 border-blue-200 bg-blue-50",
  failed: "text-red-600 border-red-200 bg-red-50",
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
  const { locale } = useParams({ strict: false }) as { locale?: string };
  const { data: bookings, isLoading } = useMyBookings();
  const { data: payments = [], isLoading: isLoadingPayments } = useMyPayments();
  const cancelBooking = useCancelBooking();
  const createCheckout = useCreateCheckout(locale);
  const abandonPayment = useAbandonPayment();
  const queryClient = useQueryClient();
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  // Payment map: booking_id → most recent payment
  const paymentByBooking = new Map(payments.map((p) => [p.booking_id, p]));

  // When pending payments settle (webhook fired), refetch bookings so any
  // booking that was cancelled server-side shows its updated status.
  const hasPendingPayments = payments.some((p) => p.status === "pending");
  const prevHadPendingRef = useRef(false);
  useEffect(() => {
    if (prevHadPendingRef.current && !hasPendingPayments) {
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    }
    prevHadPendingRef.current = hasPendingPayments;
  }, [hasPendingPayments]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const result = params.get("payment");
    if (!result) return;

    if (result === "success") {
      toast.success(c.toasts.paymentSuccess.value as string);
      sessionStorage.removeItem("pending_payment_id");
    } else if (result === "cancelled") {
      toast.warning(c.toasts.paymentCancelled.value as string);
      const pendingPaymentId = sessionStorage.getItem("pending_payment_id");
      if (pendingPaymentId) {
        sessionStorage.removeItem("pending_payment_id");
        abandonPayment.mutate(pendingPaymentId);
      }
    }

    params.delete("payment");
    const newSearch = params.toString();
    history.replaceState(
      null,
      "",
      window.location.pathname + (newSearch ? `?${newSearch}` : ""),
    );
  }, []);

  const handlePayNow = async (bookingId: string) => {
    setPayingBookingId(bookingId);
    try {
      const { checkout_url, payment_id } =
        await createCheckout.mutateAsync(bookingId);
      if (!checkout_url.startsWith("https://checkout.stripe.com/")) {
        throw new Error("Unexpected checkout URL");
      }
      sessionStorage.setItem("pending_payment_id", payment_id);
      window.location.href = checkout_url;
    } catch (err: any) {
      console.error("[checkout]", err?.response?.data?.detail ?? err);
      toast.error(c.toasts.paymentCancelled.value as string);
    } finally {
      setPayingBookingId(null);
    }
  };

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
              const payment = paymentByBooking.get(booking.id);
              const needsPayment = isPending && !isLoadingPayments && !payment;

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
                        {payment && (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                              PAYMENT_COLOR[payment.status],
                              payment.status === "pending" && "animate-pulse",
                            )}
                          >
                            <CreditCard size={10} />
                            {c.paymentStatus[payment.status]}
                          </span>
                        )}
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
                        {Number(booking.total_price).toFixed(2)}{" "}
                        {booking.currency}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {needsPayment && (
                        <Button
                          variant="default"
                          size="sm"
                          className="rounded-lg"
                          disabled={payingBookingId === booking.id}
                          onClick={() => handlePayNow(booking.id)}
                        >
                          {payingBookingId === booking.id ? c.paying : c.payNow}
                        </Button>
                      )}
                      {isPending && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                          disabled={cancelBooking.isPending}
                          onClick={() => cancelBooking.mutate(booking.id)}
                        >
                          {cancelBooking.isPending ? c.cancelling : c.cancel}
                        </Button>
                      )}
                    </div>
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
