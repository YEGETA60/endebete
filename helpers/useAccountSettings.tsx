import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUpdateProfile } from "../endpoints/auth/update-profile_POST.schema";
import { postChangePassword } from "../endpoints/auth/change-password_POST.schema";
import { AUTH_QUERY_KEY } from "./useAuth";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: any) => postUpdateProfile(vars),
    onSuccess: (data) => {
      // Optimistically update the cached auth user data globally
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (vars: any) => postChangePassword(vars),
  });
}