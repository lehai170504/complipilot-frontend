import { z } from "zod";

// ── Auth ──

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required").min(2, "Name must be at least 2 characters"),
  organizationName: z.string().min(1, "Organization name is required").min(2, "Min 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

// ── Evidence ──

export const urlEvidenceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  externalUrl: z.string().min(1, "URL is required").url("Must be a valid URL"),
  description: z.string().max(1000, "Description too long").optional(),
  evidenceType: z.string(),
});

export const editEvidenceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000).optional(),
  evidenceType: z.string(),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// ── Tasks ──

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title too long"),
  description: z.string().max(2000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  dueDate: z.string().optional(),
});

export const editTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title too long"),
  description: z.string().max(2000).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  dueDate: z.string().optional(),
});

// ── Frameworks ──

export const createFrameworkSchema = z.object({
  code: z.string().min(1, "Code is required").max(50, "Code too long"),
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  description: z.string().max(500).optional(),
});

export const createRequirementSchema = z.object({
  code: z.string().min(1, "Code is required").max(50, "Code too long"),
  title: z.string().min(1, "Title is required").max(300, "Title too long"),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  sortOrder: z.coerce.number().int().min(1, "Must be at least 1"),
});

// ── Types ──

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UrlEvidenceFormData = z.infer<typeof urlEvidenceSchema>;
export type EditEvidenceFormData = z.infer<typeof editEvidenceSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type EditTaskFormData = z.infer<typeof editTaskSchema>;
export type CreateFrameworkFormData = z.infer<typeof createFrameworkSchema>;
export type CreateRequirementFormData = z.infer<typeof createRequirementSchema>;
