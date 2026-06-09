import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  changePassword,
  getUserProfile,
  listUserProfileActivity,
  updateUserProfile,
} from "@/features/profile/api/profile-api";
import type {
  ChangePasswordRequest,
  UpdateUserProfileRequest,
} from "@/lib/api/api-types";
import { toast } from "@/lib/toast";

export function useUserProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });
}

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateUserProfileRequest) =>
      updateUserProfile(request),
    onSuccess: async () => {
      toast.success("Profile updated");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["current-user"],
        }),
      ]);
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => changePassword(request),
    onSuccess: () => {
      toast.success("Password changed", {
        description: "Your password has been updated successfully.",
      });
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });
}

export function useUserProfileActivityQuery() {
  return useQuery({
    queryKey: ["profile", "activity"],
    queryFn: () => listUserProfileActivity(0, 10),
  });
}
