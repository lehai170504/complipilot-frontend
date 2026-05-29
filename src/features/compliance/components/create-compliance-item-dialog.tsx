"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateComplianceItemMutation,
  useFrameworksQuery,
  useRequirementsQuery,
} from "@/features/compliance/hooks/compliance-hooks";

export function CreateComplianceItemDialog({
  open,
  onOpenChange,
  organizationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
}) {
  const createMutation = useCreateComplianceItemMutation(organizationId);
  const frameworksQuery = useFrameworksQuery();

  const [selectedFrameworkId, setSelectedFrameworkId] = useState("");
  const [selectedRequirementId, setSelectedRequirementId] = useState("");

  const requirementsQuery = useRequirementsQuery(
    selectedFrameworkId || undefined,
  );

  const frameworks = frameworksQuery.data ?? [];
  const requirements = requirementsQuery.data ?? [];

  function resetForm() {
    setSelectedFrameworkId("");
    setSelectedRequirementId("");
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen && !createMutation.isPending) {
      resetForm();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRequirementId) {
      return;
    }

    createMutation.mutate(
      {
        requirementId: selectedRequirementId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create compliance item</DialogTitle>
          <DialogDescription>
            Select a framework and requirement to create a new compliance
            control.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Framework</Label>
            <Select
              value={selectedFrameworkId}
              onValueChange={(value) => {
                setSelectedFrameworkId(value);
                setSelectedRequirementId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a framework..." />
              </SelectTrigger>
              <SelectContent>
                {frameworksQuery.isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading frameworks...
                  </SelectItem>
                ) : frameworks.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No frameworks available
                  </SelectItem>
                ) : (
                  frameworks.map((framework) => (
                    <SelectItem key={framework.id} value={framework.id}>
                      {framework.code} — {framework.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedFrameworkId ? (
            <div className="space-y-2">
              <Label>Requirement</Label>
              <Select
                value={selectedRequirementId}
                onValueChange={setSelectedRequirementId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a requirement..." />
                </SelectTrigger>
                <SelectContent>
                  {requirementsQuery.isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading requirements...
                    </SelectItem>
                  ) : requirements.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No requirements in this framework
                    </SelectItem>
                  ) : (
                    requirements.map((requirement) => (
                      <SelectItem key={requirement.id} value={requirement.id}>
                        {requirement.code} — {requirement.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {createMutation.error ? (
            <ErrorAlert error={createMutation.error} />
          ) : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedRequirementId || createMutation.isPending}
              type="submit"
            >
              <Plus className="mr-2 size-4" />
              {createMutation.isPending ? "Creating..." : "Create item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
