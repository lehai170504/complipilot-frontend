import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  getCurrentUser,
  getMyOrganizations,
  loginUser,
  logoutUser,
  registerUser,
} from "@/features/auth/api/auth-api";
import type { LoginRequest, RegisterRequest } from "@/features/auth/types/auth-types";

export const authQueryKeys = {
  currentUser: ["auth", "currentUser"] as const,
  organizations: ["auth", "organizations"] as const,
};

export function useCurrentUserQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: getCurrentUser,
    enabled: options?.enabled ?? true,
  });
}

export function useMyOrganizationsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authQueryKeys.organizations,
    queryFn: getMyOrganizations,
    enabled: options?.enabled ?? true,
  });
}

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LoginRequest) => loginUser(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/dashboard");
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: RegisterRequest) => {
      await registerUser(request);
      return loginUser({
        email: request.email,
        password: request.password,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/dashboard");
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}