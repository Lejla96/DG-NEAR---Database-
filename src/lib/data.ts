import { unstable_noStore as noStore } from "next/cache";

import {
  SUPPORT_SERVICE_OPTIONS,
  entrepreneurSelectableFields,
} from "@/lib/constants";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ActivityLog,
  AuthenticatedAdmin,
  DashboardData,
  DistributionItem,
  Entrepreneur,
  FilterState,
} from "@/lib/types";

export async function getCurrentUserProfile(): Promise<AuthenticatedAdmin | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const adminSupabase = createAdminSupabaseClient();
  const { data, error } = await adminSupabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (
    error ||
    !data ||
    (data.role !== "admin" && data.role !== "super_admin")
  ) {
    return null;
  }

  return data as AuthenticatedAdmin;
}

function buildDistribution(values: string[]) {
  return Object.entries(
    values.reduce<Record<string, number>>((accumulator, value) => {
      accumulator[value] = (accumulator[value] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getDashboardData(filters: FilterState): Promise<DashboardData> {
  noStore();
  const authSupabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const adminSupabase = createAdminSupabaseClient();
  const { data: profile, error: profileError } = await adminSupabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    (profile.role !== "admin" && profile.role !== "super_admin")
  ) {
    throw new Error("Unauthorized");
  }

  let query = adminSupabase
    .from("entrepreneurs")
    .select(entrepreneurSelectableFields)
    .order("created_at", { ascending: false });

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,surname.ilike.%${filters.search}%,email.ilike.%${filters.search}%,city.ilike.%${filters.search}%`,
    );
  }
  if (filters.city) {
    query = query.eq("city", filters.city);
  }
  if (filters.gender) {
    query = query.eq("gender", filters.gender);
  }
  if (filters.businessStatus) {
    query = query.eq("business_status", filters.businessStatus);
  }
  if (filters.service) {
    query = query.contains("support_services", [filters.service]);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const entrepreneurs = (data ?? []) as Entrepreneur[];
  const cityOptions = Array.from(
    new Set(entrepreneurs.map((record) => record.city).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const totals = {
    entrepreneurs: entrepreneurs.length,
    registeredBusinesses: entrepreneurs.filter(
      (record) => record.business_status === "registered",
    ).length,
    notRegisteredBusinesses: entrepreneurs.filter(
      (record) => record.business_status === "not_registered",
    ).length,
    serviceAssignments: entrepreneurs.reduce(
      (sum, record) => sum + record.support_services.length,
      0,
    ),
  };

  const cityDistribution = buildDistribution(
    entrepreneurs.map((record) => record.city),
  );
  const genderDistribution = buildDistribution(
    entrepreneurs.map((record) => record.gender),
  );
  const statusDistribution = buildDistribution(
    entrepreneurs.map((record) => record.business_status),
  );
  const serviceDistribution: DistributionItem[] = SUPPORT_SERVICE_OPTIONS.map(
    (service) => ({
      label: service.value,
      value: entrepreneurs.filter((record) =>
        record.support_services.includes(service.value),
      ).length,
    }),
  );

  const { data: activityData, error: activityError } = await adminSupabase
    .from("activity_log_view")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);

  if (activityError) {
    throw new Error(activityError.message);
  }

  return {
    entrepreneurs,
    activity: (activityData ?? []) as ActivityLog[],
    totals,
    cityDistribution,
    genderDistribution,
    statusDistribution,
    serviceDistribution,
    cityOptions,
  };
}
