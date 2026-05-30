"use client";

import { useMemo, useState } from "react";

import {
  getActiveOrganization,
  setActiveOrganization,
} from "@/features/organizations/api/organization-storage";
import type { ActiveOrganization } from "@/features/organizations/types/organization-types";
import { useMyOrganizationsQuery } from "@/features/auth/hooks/auth-hooks";

export function useActiveOrganization() {
  const organizationsQuery = useMyOrganizationsQuery();

  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return getActiveOrganization()?.organizationId ?? null;
  });

  const activeOrganization = useMemo<ActiveOrganization | null>(() => {
    const organizations = organizationsQuery.data ?? [];

    if (organizations.length === 0) {
      return null;
    }

    const selectedOrganization = selectedOrganizationId
      ? organizations.find(
          (organization) =>
            organization.organizationId === selectedOrganizationId,
        )
      : null;

    return selectedOrganization ?? organizations[0];
  }, [organizationsQuery.data, selectedOrganizationId]);

  function changeActiveOrganization(organizationId: string) {
    const organization = organizationsQuery.data?.find(
      (item) => item.organizationId === organizationId,
    );

    if (!organization) {
      return;
    }

    setActiveOrganization(organization);
    setSelectedOrganizationId(organization.organizationId);
  }

  const canManageMembers = useMemo(() => {
    if (!activeOrganization) {
      return false;
    }

    return ["OWNER", "ADMIN"].includes(activeOrganization.role);
  }, [activeOrganization]);

  const canSeedDemoUsers = activeOrganization?.role === "OWNER";

  const canManageCompliance = useMemo(() => {
    if (!activeOrganization) {
      return false;
    }

    return ["OWNER", "ADMIN", "COMPLIANCE_MANAGER"].includes(
      activeOrganization.role,
    );
  }, [activeOrganization]);

  const canManageEvidence = canManageCompliance;
  const canManageTasks = canManageCompliance;
  const canViewAudit = Boolean(activeOrganization);
  const isReadOnly = activeOrganization?.role === "AUDITOR";

  return {
    activeOrganization,
    organizations: organizationsQuery.data ?? [],
    isLoading: organizationsQuery.isLoading,
    error: organizationsQuery.error,
    changeActiveOrganization,
    canManageCompliance,
    canManageEvidence,
    canManageTasks,
    canManageMembers,
    canSeedDemoUsers,
    canViewAudit,
    isReadOnly,
  };
}
