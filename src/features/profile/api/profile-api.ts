import { apiClient } from "@/lib/api/api-client";
import type {
  AuditEventResponse,
  ChangePasswordRequest,
  PageResponse,
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

export function listUserProfileActivity(
  page = 0,
  size = 10,
): Promise<PageResponse<AuditEventResponse>> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  return apiClient<PageResponse<AuditEventResponse>>(
    `/api/v1/profile/activity?${searchParams.toString()}`,
  );
}
