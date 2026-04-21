export type AppLanguage = "en" | "mk";

export type BusinessStatus = "registered" | "not_registered";
export type Gender = "female" | "male" | "other";
export type SupportService =
  | "digitalization"
  | "incubation_program"
  | "acceleration_program"
  | "growth_program"
  | "one_to_one_mentorship"
  | "papposhop_platform";

export type AuthenticatedAdmin = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin";
};

export type Entrepreneur = {
  id: string;
  name: string;
  surname: string;
  phone_number: string;
  city: string;
  email: string;
  business_status: BusinessStatus;
  gender: Gender;
  age: number;
  support_services: SupportService[];
  notes: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  created_by_email?: string | null;
  created_by_name?: string | null;
  updated_by_email?: string | null;
  updated_by_name?: string | null;
};

export type ActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "imported"
  | "exported"
  | "signed_in";

export type ActivityLog = {
  id: string;
  entrepreneur_id: string | null;
  entrepreneur_name: string | null;
  actor_id: string | null;
  actor_email: string | null;
  actor_name: string | null;
  action: ActivityAction;
  changes: Record<string, unknown>;
  created_at: string;
};

export type FilterState = {
  search: string;
  city: string;
  gender: "" | Gender;
  businessStatus: "" | BusinessStatus;
  service: "" | SupportService;
  edit: string;
};

export type DistributionItem = {
  label: string;
  value: number;
};

export type DashboardData = {
  entrepreneurs: Entrepreneur[];
  activity: ActivityLog[];
  totals: {
    entrepreneurs: number;
    registeredBusinesses: number;
    notRegisteredBusinesses: number;
    serviceAssignments: number;
  };
  cityDistribution: DistributionItem[];
  genderDistribution: DistributionItem[];
  statusDistribution: DistributionItem[];
  serviceDistribution: DistributionItem[];
  cityOptions: string[];
};

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  issues?: ImportIssue[];
};

export type ImportIssue = {
  row: number;
  reason: string;
};

export type ImportRow = Record<string, string>;
