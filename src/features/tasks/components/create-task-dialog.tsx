"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTaskMutation } from "@/features/tasks/hooks/tasks-hooks";
import {
  createTaskSchema,
  type CreateTaskFormData,
} from "@/lib/validation-schemas";

const taskPriorityOptions = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export function CreateTaskDialog({
  open,
  onOpenChange,
  organizationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
}) {
  const t = useTranslations("taskDialog");
  const tStatus = useTranslations("status");
  const tCommon = useTranslations("common");

  const createMutation = useCreateTaskMutation(organizationId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "HIGH",
      dueDate: "",
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen && !createMutation.isPending) {
      reset();
    }
  }

  function onSubmit(data: CreateTaskFormData) {
    createMutation.mutate(
      {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        priority: data.priority,
        dueDate: data.dueDate || null,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="task-title">{t("fields.title")}</Label>
            <Input
              id="task-title"
              {...register("title")}
              placeholder={t("placeholders.title")}
            />
            {errors.title ? (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-desc">{t("fields.description")}</Label>
            <Textarea id="task-desc" {...register("description")} rows={3} />
            {errors.description ? (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("fields.priority")}</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taskPriorityOptions.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {tStatus(priority)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("fields.dueDate")}</Label>
              <Input type="date" {...register("dueDate")} />
            </div>
          </div>

          {createMutation.error ? (
            <ErrorAlert error={createMutation.error} />
          ) : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              disabled={isSubmitting || createMutation.isPending}
              type="submit"
            >
              {createMutation.isPending ? t("creating") : t("createTask")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}