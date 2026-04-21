import { clsx, type ClassValue } from "clsx";

import { SUPPORT_SERVICE_OPTIONS } from "@/lib/constants";
import type { SupportService } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | null | undefined, locale = "en") {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatNumber(value: number, locale = "en") {
  return new Intl.NumberFormat(locale).format(value);
}

export function normalizeString(value: FormDataEntryValue | string | null | undefined) {
  return String(value ?? "").trim();
}

export function parseNumber(value: FormDataEntryValue | string | null | undefined) {
  const parsed = Number(normalizeString(value));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function normalizeServiceList(values: string[]) {
  const allowed = new Set(
    SUPPORT_SERVICE_OPTIONS.map((service) => service.value as SupportService),
  );

  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].filter(
    (value): value is SupportService => allowed.has(value as SupportService),
  );
}
