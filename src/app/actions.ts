"use server";

import ExcelJS from "exceljs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  entrepreneurSelectableFields,
  supportServiceLabelMap,
} from "@/lib/constants";
import { getDictionary } from "@/lib/translations";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionState, AppLanguage, Entrepreneur, ImportIssue } from "@/lib/types";
import {
  normalizeServiceList,
  normalizeString,
  parseNumber,
} from "@/lib/utils";
import {
  entrepreneurSchema,
  filtersSchema,
  importRowSchema,
  loginSchema,
} from "@/lib/validation";

function getLanguage(formData: FormData): AppLanguage {
  return formData.get("language") === "mk" ? "mk" : "en";
}

function buildActionState(
  status: ActionState["status"],
  message?: string,
  issues?: ImportIssue[],
): ActionState {
  return { status, message, issues };
}

function toFormValue(value: unknown) {
  return value as FormDataEntryValue | null | undefined;
}

async function getAuthorizedContext() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id || !user.email) {
    throw new Error("Unauthorized");
  }

  const email = user.email.toLowerCase();
  const adminSupabase = createAdminSupabaseClient();
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || profile.email.toLowerCase() !== email) {
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

function mapEntrepreneurFormData(formData: FormData) {
  return {
    name: normalizeString(formData.get("name")),
    surname: normalizeString(formData.get("surname")),
    phone_number: normalizeString(formData.get("phone_number")),
    city: normalizeString(formData.get("city")),
    email: normalizeString(formData.get("email")).toLowerCase(),
    business_status: normalizeString(formData.get("business_status")),
    gender: normalizeString(formData.get("gender")),
    age: parseNumber(formData.get("age")),
    support_services: normalizeServiceList(
      formData.getAll("support_services").map(String),
    ),
    notes: normalizeString(formData.get("notes")) || null,
  };
}

async function logActivity(
  entrepreneurId: string | null,
  action: string,
  changes: Record<string, unknown>,
) {
  const { supabase } = await getAuthorizedContext();
  await supabase.rpc("log_activity", {
    p_entrepreneur_id: entrepreneurId,
    p_action: action,
    p_changes: changes,
  });
}

async function refreshAllViews() {
  revalidatePath("/dashboard");
  revalidatePath("/entrepreneurs");
  revalidatePath("/import-export");
}

export async function signInAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = getLanguage(formData);
  const t = getDictionary(locale);
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return buildActionState("error", t["validation.required"]);
  }

  const email = parsed.data.email.toLowerCase();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error) {
    return buildActionState("error", error.message);
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createEntrepreneurAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = getLanguage(formData);
  const t = getDictionary(locale);
  const parsed = entrepreneurSchema.safeParse(mapEntrepreneurFormData(formData));

  if (!parsed.success) {
    return buildActionState(
      "error",
      parsed.error.issues[0]?.message ?? t["messages.error"],
    );
  }

  const { supabase, user } = await getAuthorizedContext();
  const { data, error } = await supabase
    .from("entrepreneurs")
    .insert({
      ...parsed.data,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    return buildActionState("error", error.message);
  }

  await logActivity(data.id, "created", parsed.data);
  await refreshAllViews();

  return buildActionState("success", t["messages.saved"]);
}

export async function updateEntrepreneurAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = getLanguage(formData);
  const t = getDictionary(locale);
  const id = normalizeString(formData.get("id"));
  const parsed = entrepreneurSchema.safeParse(mapEntrepreneurFormData(formData));

  if (!id || !parsed.success) {
    return buildActionState(
      "error",
      parsed.success
        ? t["messages.error"]
        : (parsed.error.issues[0]?.message ?? t["messages.error"]),
    );
  }

  const { supabase, user } = await getAuthorizedContext();
  const { error } = await supabase
    .from("entrepreneurs")
    .update({
      ...parsed.data,
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) {
    return buildActionState("error", error.message);
  }

  await logActivity(id, "updated", parsed.data);
  await refreshAllViews();

  return buildActionState("success", t["messages.updated"]);
}

export async function deleteEntrepreneurAction(formData: FormData) {
  const locale = getLanguage(formData);
  const t = getDictionary(locale);
  const id = normalizeString(formData.get("id"));

  if (!id) {
    return buildActionState("error", t["messages.error"]);
  }

  const { supabase } = await getAuthorizedContext();
  const { error } = await supabase.from("entrepreneurs").delete().eq("id", id);

  if (error) {
    return buildActionState("error", error.message);
  }

  await logActivity(id, "deleted", {});
  await refreshAllViews();

  return buildActionState("success", t["messages.deleted"]);
}

export async function importEntrepreneursAction(rows: unknown[]): Promise<ActionState> {
  const t = getDictionary("en");

  if (!rows.length) {
    return buildActionState("error", t["import.noData"]);
  }

  const issues: ImportIssue[] = [];
  const validRows: Array<ReturnType<typeof entrepreneurSchema.parse>> = [];

  rows.forEach((row, index) => {
    const record = row as Record<string, unknown>;
    const parsed = importRowSchema.safeParse({
      name: normalizeString(toFormValue(record.name ?? record.Name)),
      surname: normalizeString(toFormValue(record.surname ?? record.Surname)),
      phone_number: normalizeString(
        toFormValue(record.phone_number ?? record["Phone Number"]),
      ),
      city: normalizeString(toFormValue(record.city ?? record.City)),
      email: normalizeString(toFormValue(record.email ?? record.Email)).toLowerCase(),
      business_status: normalizeString(
        toFormValue(record.business_status ?? record["Business Status"]),
      ),
      gender: normalizeString(toFormValue(record.gender ?? record.Gender)),
      age: parseNumber(toFormValue(record.age ?? record.Age)),
      support_services: normalizeServiceList(
        String(record.support_services ?? record["Support Services"] ?? "")
          .split(/[;,]/)
          .map((item) => item.trim()),
      ),
      notes: normalizeString(toFormValue(record.notes ?? record.Notes)) || null,
    });

    if (!parsed.success) {
      issues.push({
        row: index + 2,
        reason: parsed.error.issues[0]?.message ?? "Invalid row",
      });
      return;
    }

    validRows.push(parsed.data);
  });

  if (!validRows.length) {
    return buildActionState("error", t["import.noValidRows"], issues);
  }

  const { supabase, user } = await getAuthorizedContext();
  const { data, error } = await supabase
    .from("entrepreneurs")
    .insert(
      validRows.map((row) => ({
        ...row,
        created_by: user.id,
        updated_by: user.id,
      })),
    )
    .select("id");

  if (error) {
    return buildActionState("error", error.message, issues);
  }

  await Promise.all(
    (data ?? []).map((row, index) =>
      supabase.rpc("log_activity", {
        p_entrepreneur_id: row.id,
        p_action: "imported",
        p_changes: validRows[index],
      }),
    ),
  );

  await refreshAllViews();
  return buildActionState(
    "success",
    `${validRows.length} entrepreneur records imported successfully.`,
    issues,
  );
}

export async function exportEntrepreneursAction(
  formData: FormData,
): Promise<{ filename: string; content: string; mimeType: string }> {
  const filtersInput = filtersSchema.safeParse({
    search: formData.get("search"),
    city: formData.get("city"),
    gender: formData.get("gender"),
    businessStatus: formData.get("businessStatus"),
    service: formData.get("service"),
    edit: "",
  });

  const filters = filtersInput.success
    ? filtersInput.data
    : {
        search: "",
        city: "",
        gender: "",
        businessStatus: "",
        service: "",
        edit: "",
      };
  const { supabase } = await getAuthorizedContext();

  let query = supabase
    .from("entrepreneurs")
    .select(entrepreneurSelectableFields)
    .order("created_at", { ascending: false });

  if ("city" in filters && filters.city) query = query.eq("city", filters.city);
  if ("gender" in filters && filters.gender) query = query.eq("gender", filters.gender);
  if ("businessStatus" in filters && filters.businessStatus) {
    query = query.eq("business_status", filters.businessStatus);
  }
  if ("service" in filters && filters.service) {
    query = query.contains("support_services", [filters.service]);
  }
  if ("search" in filters && filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,surname.ilike.%${filters.search}%,email.ilike.%${filters.search}%,city.ilike.%${filters.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Entrepreneurs");
  sheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Surname", key: "surname", width: 20 },
    { header: "Phone Number", key: "phone_number", width: 18 },
    { header: "City", key: "city", width: 18 },
    { header: "Email", key: "email", width: 28 },
    { header: "Business Status", key: "business_status", width: 22 },
    { header: "Gender", key: "gender", width: 14 },
    { header: "Age", key: "age", width: 10 },
    { header: "Support Services", key: "support_services", width: 42 },
    { header: "Notes", key: "notes", width: 42 },
    { header: "Date Added", key: "created_at", width: 24 },
    { header: "Last Updated", key: "updated_at", width: 24 },
  ];

  ((data ?? []) as Entrepreneur[]).forEach((row) => {
    sheet.addRow({
      ...row,
      support_services: row.support_services
        .map((service) => supportServiceLabelMap[service])
        .join(", "),
      created_at: new Date(row.created_at).toLocaleString("en-GB"),
      updated_at: new Date(row.updated_at).toLocaleString("en-GB"),
    });
  });

  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  await logActivity(null, "exported", {
    count: Array.isArray(data) ? data.length : 0,
  });

  return {
    filename: `entrepreneurs-${new Date().toISOString().slice(0, 10)}.xlsx`,
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    content: Buffer.from(buffer).toString("base64"),
  };
}

export async function inviteDefaultAdminsAction() {
  const admin = createAdminSupabaseClient();
  const defaultAdmins = ["martina@redi-ngo.eu", "lejla@redi-ngo.eu"];

  await Promise.all(
    defaultAdmins.map((email) =>
      admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/login`
          : undefined,
        data: {
          role: "admin",
          full_name: email.split("@")[0],
        },
      }),
    ),
  );

  return { invited: defaultAdmins.length };
}
