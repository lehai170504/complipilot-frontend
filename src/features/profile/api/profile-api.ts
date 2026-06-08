import { apiClient } from "@/lib/api/api-client";
import type {
  ChangePasswordRequest,
  UpdateUserProfileRequest,
  UserProfileResponse,
} from "@/lib/api/api-types";

export function getUserProfile(): Promise<UserProfileResponse> {
  return apiClient<UserProfileResponse>("/api/v1/profile");
}

export function updateUserProfile(
  request: UpdateUserProfileRequest,
): Promise<UserProfileResponse> {
  return apiClient<UserProfileResponse>("/api/v1/profile", {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}

export function changePassword(request: ChangePasswordRequest): Promise<void> {
  return apiClient<void>("/api/v1/profile/password", {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}
