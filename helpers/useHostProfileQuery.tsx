import { useQuery } from "@tanstack/react-query";
import { getHostProfile } from "../endpoints/host/profile_GET.schema";

export const useHostProfile = (userId: number | undefined) => {
  return useQuery({
    queryKey: ["host", "profile", userId],
    queryFn: async () => {
      const res = await getHostProfile({ userId: userId! });
      return res;
    },
    enabled: userId !== undefined && !isNaN(userId),
  });
};