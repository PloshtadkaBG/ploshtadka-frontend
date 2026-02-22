import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { BookingCreate, BookingResponse } from "./types";

export const useMyBookings = () =>
  useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: async () => {
      const { data } = await apiClient.get<BookingResponse[]>("/bookings/");
      return data;
    },
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("access_token"),
  });

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BookingCreate) => {
      const { data } = await apiClient.post<BookingResponse>(
        "/bookings/",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await apiClient.patch<BookingResponse>(
        `/bookings/${bookingId}/status`,
        { status: "cancelled" },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
