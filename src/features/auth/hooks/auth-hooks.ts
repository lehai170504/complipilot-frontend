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
import { toast } from "@/lib/toast";

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
      toast.success("Signed in successfully");
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Login failed", { description: "Check your email and password." });
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
      toast.success("Account created! Welcome to CompliPilot.");
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Registration failed", { description: "This email may already be in use." });
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      toast.success("Signed out");
      queryClient.clear();
      router.push("/login");
    },
  });
}