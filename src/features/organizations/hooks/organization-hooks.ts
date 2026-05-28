"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getActiveOrganization,
  setActiveOrganization,
} from "@/features/organizations/api/organization-storage";
import type { ActiveOrganization } from "@/features/organizations/types/organization-types";
import { useMyOrganizationsQuery } from "@/features/auth/hooks/auth-hooks";

export function useActiveOrganization() {
  const organizationsQuery = useMyOrganizationsQuery();
  const [activeOrganization, setActiveOrganizationState] =
    useState<ActiveOrganization | null>(null);

  useEffect(() => {
    const storedOrganization = getActiveOrganization();

    if (storedOrganization) {
      setActiveOrganizationState(storedOrganization);
    }
  }, []);

  useEffect(() => {
    if (!organizationsQuery.data || organizationsQuery.data.length === 0) {
      return;
    }

    const storedOrganization = getActiveOrganization();

    const storedOrganizationStillExists = storedOrganization
      ? organizationsQuery.data.some(
          (organization) =>
            organization.organizationId === storedOrganization.organizationId
        )
      : false;

    if (storedOrganization && storedOrganizationStillExists) {
      setActiveOrganizationState(storedOrganization);
      return;
    }

    const firstOrganization = organizationsQuery.data[0];
    setActiveOrganization(firstOrganization);
    setActiveOrganizationState(firstOrganization);
  }, [organizationsQuery.data]);

  function changeActiveOrganization(organizationId: string) {
    const organization = organizationsQuery.data?.find(
      (item) => item.organizationId === organizationId
    );

    if (!organization) {
      return;
    }

    setActiveOrganization(organization);
    setActiveOrganizationState(organization);
  }

  const canManageCompliance = useMemo(() => {
    if (!activeOrganization) {
      return false;
    }

    return ["OWNER", "ADMIN", "COMPLIANCE_MANAGER"].includes(
      activeOrganization.role
    );
  }, [activeOrganization]);

  return {
    activeOrganization,
    organizations: organizationsQuery.data ?? [],
    isLoading: organizationsQuery.isLoading,
    error: organizationsQuery.error,
    changeActiveOrganization,
    canManageCompliance,
  };
}