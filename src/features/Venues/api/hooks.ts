import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type {
  VenueListItem,
  VenueResponse,
  VenueUnavailabilityResponse,
} from "./types";

export const useVenues = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["venues", params],
    queryFn: async () => {
      const { data } = await apiClient.get<VenueListItem[]>("/venues/", {
        params,
      });
      return data;
    },
  });
};

export const useVenue = (venueId: string) => {
  return useQuery({
    queryKey: ["venues", venueId],
    queryFn: async () => {
      const { data } = await apiClient.get<VenueResponse>(`/venues/${venueId}`);
      return data;
    },
    enabled: !!venueId,
  });
};

// export const useCreateVenue = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (newVenue: VenueCreate) => {
//       const { data } = await apiClient.post<VenueResponse>(
//         "/venues/",
//         newVenue,
//       );
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["venues"] });
//     },
//   });
// };
//
// export const useUpdateVenue = (venueId: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (updateData: Partial<VenueCreate>) => {
//       const { data } = await apiClient.patch<VenueResponse>(
//         `/venues/${venueId}`,
//         updateData,
//       );
//       return data;
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["venues"] });
//       queryClient.setQueryData(["venues", venueId], data);
//     },
//   });
// };
//
// // --- VENUE IMAGES ---
//
// export const useVenueImages = (venueId: string) => {
//   return useQuery({
//     queryKey: ["venues", venueId, "images"],
//     queryFn: async () => {
//       const { data } = await apiClient.get<VenueImageResponse[]>(
//         `/venues/${venueId}/images`,
//       );
//       return data;
//     },
//     enabled: !!venueId,
//   });
// };
//
// export const useReorderImages = (venueId: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (orderedIds: string[]) => {
//       const { data } = await apiClient.put<VenueImageResponse[]>(
//         `/venues/${venueId}/images/reorder`,
//         orderedIds,
//       );
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["venues", venueId] });
//     },
//   });
// };
//
// // --- UNAVAILABILITIES ---

export const useVenueUnavailabilities = (venueId: string) => {
  return useQuery({
    queryKey: ["venues", venueId, "unavailabilities"],
    queryFn: async () => {
      const { data } = await apiClient.get<VenueUnavailabilityResponse[]>(
        `/venues/${venueId}/unavailabilities`,
      );
      return data;
    },
    enabled: !!venueId,
  });
};

// export const useCreateUnavailability = (venueId: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload: {
//       start_datetime: string;
//       end_datetime: string;
//       reason?: string;
//     }) => {
//       const { data } = await apiClient.post(
//         `/venues/${venueId}/unavailabilities`,
//         payload,
//       );
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["venues", venueId] });
//     },
//   });
// };
