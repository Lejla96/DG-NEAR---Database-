import { z } from "zod";

import {
  BUSINESS_STATUSES,
  GENDERS,
  SUPPORT_SERVICES,
} from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().trim().email("A valid email address is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const entrepreneurSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  surname: z.string().trim().optional().nullable(),
  phone_number: z.string().trim().optional().nullable(),
  city: z.string().trim().min(1, "City is required"),
  email: z
    .union([z.string().trim().email("A valid email address is required"), z.literal("")])
    .optional()
    .transform((value) => value || null),
  business_status: z.enum(BUSINESS_STATUSES),
  gender: z.enum(GENDERS),
  age: z
    .union([z.coerce.number().int().min(16).max(120), z.nan()])
    .transform((value) => (Number.isNaN(value) ? null : value)),
  mapped: z
    .union([z.boolean(), z.string(), z.null(), z.undefined()])
    .transform((value) => value === true || value === "true" || value === "on"),
  support_services: z
    .array(z.enum(SUPPORT_SERVICES))
    .min(1, "Select at least one support service"),
  notes: z.string().trim().max(4000).optional().nullable(),
});

export const filtersSchema = z.object({
  search: z.string().trim().optional().default(""),
  city: z.string().trim().optional().default(""),
  gender: z.enum(["", ...GENDERS]).optional().default(""),
  businessStatus: z.enum(["", ...BUSINESS_STATUSES]).optional().default(""),
  service: z.enum(["", ...SUPPORT_SERVICES]).optional().default(""),
  edit: z.string().trim().optional().default(""),
});

export const importRowSchema = entrepreneurSchema;

export type LoginInput = z.infer<typeof loginSchema>;
export type EntrepreneurInput = z.infer<typeof entrepreneurSchema>;
export type FiltersInput = z.infer<typeof filtersSchema>;
