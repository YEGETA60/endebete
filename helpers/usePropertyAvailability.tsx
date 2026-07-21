import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPropertyAvailability } from "../endpoints/properties/availability_GET.schema";
import { postBlockPropertyDate } from "../endpoints/properties/availability/block_POST.schema";
import { postUnblockPropertyDate } from "../endpoints/properties/availability/unblock_POST.schema";

export const PROPERTY_AVAILABILITY_QUERY_KEY = "propertyAvailability";

export function usePropertyAvailability(propertyId: number | undefined) {
  return useQuery({
    queryKey: [PROPERTY_AVAILABILITY_QUERY_KEY, propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error("propertyId is required");
      return getPropertyAvailability({ propertyId });
    },
    enabled: !!propertyId,
  });
}

export function useBlockPropertyDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: any) => postBlockPropertyDate(vars),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PROPERTY_AVAILABILITY_QUERY_KEY, variables.propertyId],
      });
    },
  });
}

export function useUnblockPropertyDate(propertyId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: any) => postUnblockPropertyDate(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PROPERTY_AVAILABILITY_QUERY_KEY, propertyId],
      });
    },
  });
}