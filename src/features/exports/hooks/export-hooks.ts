import { useMutation } from "@tanstack/react-query";

import {
  downloadAuditEventsCsv,
  downloadComplianceItemsCsv,
  downloadEvidenceCsv,
} from "@/features/exports/api/export-api";
import { toast } from "@/lib/toast";

export function useExportComplianceItemsCsvMutation() {
  return useMutation({
    mutationFn: (organizationId: string) =>
      downloadComplianceItemsCsv(organizationId),
    onSuccess: () => {
      toast.success("Compliance CSV exported");
    },
    onError: () => {
      toast.error("Failed to export compliance CSV");
    },
  });
}

export function useExportEvidenceCsvMutation() {
  return useMutation({
    mutationFn: (organizationId: string) => downloadEvidenceCsv(organizationId),
    onSuccess: () => {
      toast.success("Evidence CSV exported");
    },
    onError: () => {
      toast.error("Failed to export evidence CSV");
    },
  });
}

export function useExportAuditEventsCsvMutation() {
  return useMutation({
    mutationFn: (organizationId: string) =>
      downloadAuditEventsCsv(organizationId),
    onSuccess: () => {
      toast.success("Audit CSV exported");
    },
    onError: () => {
      toast.error("Failed to export audit CSV");
    },
  });
}
