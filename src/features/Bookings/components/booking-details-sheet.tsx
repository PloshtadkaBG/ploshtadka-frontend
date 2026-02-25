import { useIntlayer } from "react-intlayer";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Calendar,
  CreditCard,
  FileText,
  Hash,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  BookingResponse,
  BookingStatus,
  PaymentResponse,
  PaymentStatus,
} from "../api/types";

const STATUS_GRADIENT: Record<BookingStatus, string> = {
  pending: "from-amber-400 to-yellow-300",
  confirmed: "from-emerald-500 to-green-400",
  completed: "from-slate-500 to-slate-400",
  cancelled: "from-red-400 to-rose-300",
  no_show: "from-orange-400 to-amber-300",
};

const STATUS_TEXT: Record<BookingStatus, string> = {
  pending: "text-amber-900",
  confirmed: "text-emerald-900",
  completed: "text-slate-900",
  cancelled: "text-red-900",
  no_show: "text-orange-900",
};

const PAYMENT_COLOR: Record<PaymentStatus, string> = {
  pending: "text-orange-600 border-orange-200 bg-orange-50",
  paid: "text-emerald-700 border-emerald-300 bg-emerald-50",
  refunded: "text-blue-600 border-blue-200 bg-blue-50",
  failed: "text-red-600 border-red-200 bg-red-50",
};

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-right">{children}</span>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

interface BookingDetailsSheetProps {
  booking: BookingResponse | null;
  payment: PaymentResponse | undefined;
  locale?: string;
  payingBookingId: string | null;
  isCancelPending: boolean;
  onClose: () => void;
  onPayNow: (id: string) => void;
  onCancel: (id: string) => void;
}

export function BookingDetailsSheet({
  booking,
  payment,
  locale,
  payingBookingId,
  isCancelPending,
  onClose,
  onPayNow,
  onCancel,
}: BookingDetailsSheetProps) {
  const c = useIntlayer("my-bookings");

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const durationHours = booking
    ? (new Date(booking.end_datetime).getTime() -
        new Date(booking.start_datetime).getTime()) /
      3_600_000
    : 0;

  const status = booking?.status as BookingStatus | undefined;
  const isPending = status === "pending";
  const needsPayment = isPending && !payment;
  const venueHref = `/${locale ? `${locale}/` : ""}venues/${booking?.venue_id}`;

  return (
    <AnimatePresence>
      {booking && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet panel */}
          <motion.div
            key="sheet"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md z-50 flex flex-col bg-white shadow-2xl"
          >
            {/* Status header */}
            <div
              className={cn(
                "relative bg-gradient-to-br px-6 pt-6 pb-8 shrink-0",
                status
                  ? STATUS_GRADIENT[status]
                  : "from-slate-400 to-slate-300",
              )}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>

              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-widest mb-1 opacity-70",
                  status ? STATUS_TEXT[status] : "text-slate-900",
                )}
              >
                {c.details.title}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-full text-sm font-bold bg-white/30 backdrop-blur-sm",
                    status ? STATUS_TEXT[status] : "text-slate-900",
                  )}
                >
                  {status ? c.status[status] : "—"}
                </span>
                {payment && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border bg-white/50",
                      PAYMENT_COLOR[payment.status],
                      payment.status === "pending" && "animate-pulse",
                    )}
                  >
                    <CreditCard size={10} />
                    {c.paymentStatus[payment.status]}
                  </span>
                )}
              </div>

              {booking && (
                <div
                  className={cn(
                    "space-y-0.5",
                    status ? STATUS_TEXT[status] : "text-slate-900",
                  )}
                >
                  <p className="text-xl font-bold leading-tight">
                    {fmtDate(booking.start_datetime)}
                  </p>
                  <p className="text-base font-medium opacity-80">
                    {fmtTime(booking.start_datetime)} –{" "}
                    {fmtTime(booking.end_datetime)}
                    <span className="ml-2 text-sm opacity-60">
                      ({durationHours.toFixed(1)}h)
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Schedule */}
              <Section
                icon={Calendar}
                title={c.details.schedule as unknown as string}
              >
                <Row label={c.details.start as unknown as string}>
                  {fmt(booking.start_datetime)}
                </Row>
                <Row label={c.details.end as unknown as string}>
                  {fmt(booking.end_datetime)}
                </Row>
                <Row label={c.details.duration as unknown as string}>
                  {durationHours.toFixed(1)} h
                </Row>
              </Section>

              {/* Pricing */}
              <Section
                icon={CreditCard}
                title={c.details.pricing as unknown as string}
              >
                <Row label={c.details.rate as unknown as string}>
                  {Number(booking.price_per_hour).toFixed(2)} {booking.currency}
                  /h
                </Row>
                <Row label={c.total as unknown as string}>
                  <span className="font-bold text-base">
                    {Number(booking.total_price).toFixed(2)} {booking.currency}
                  </span>
                </Row>
              </Section>

              {/* Notes */}
              {booking.notes && (
                <Section
                  icon={FileText}
                  title={c.details.notes as unknown as string}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {booking.notes}
                  </p>
                </Section>
              )}

              {/* References */}
              <Section
                icon={Hash}
                title={c.details.references as unknown as string}
              >
                <Row label={c.details.bookingId as unknown as string}>
                  <span className="font-mono text-xs text-muted-foreground">
                    {booking.id}
                  </span>
                </Row>
                <Row label={c.venue as unknown as string}>
                  <a
                    href={venueHref}
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <span className="font-mono text-xs">
                      {booking.venue_id.slice(0, 8)}…
                    </span>
                    <ExternalLink size={11} />
                  </a>
                </Row>
                <Row label={c.details.updatedAt as unknown as string}>
                  <span className="text-muted-foreground text-xs">
                    {fmt(booking.updated_at)}
                  </span>
                </Row>
              </Section>
            </div>

            {/* Footer actions */}
            {(needsPayment || isPending) && (
              <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-4 flex gap-2">
                {needsPayment && (
                  <Button
                    className="flex-1 rounded-xl"
                    disabled={payingBookingId === booking.id}
                    onClick={() => onPayNow(booking.id)}
                  >
                    {payingBookingId === booking.id ? c.paying : c.payNow}
                  </Button>
                )}
                {isPending && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                    disabled={isCancelPending}
                    onClick={() => onCancel(booking.id)}
                  >
                    {isCancelPending ? c.cancelling : c.cancel}
                  </Button>
                )}
              </div>
            )}

            {!needsPayment && !isPending && (
              <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-4">
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={onClose}
                >
                  {c.details.close}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
