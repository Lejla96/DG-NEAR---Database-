import type { AppLanguage, BusinessStatus, Gender, SupportService } from "@/lib/types";

export const ADMIN_EMAILS = ["martina@redi-ngo.eu", "lejla@redi-ngo.eu"] as const;

export const APP_LANGUAGES: AppLanguage[] = ["en", "mk"];

export const BUSINESS_STATUSES: BusinessStatus[] = ["registered", "not_registered"];
export const GENDERS: Gender[] = ["female", "male", "other"];
export const SUPPORT_SERVICES: SupportService[] = [
  "digitalization",
  "incubation_program",
  "acceleration_program",
  "growth_program",
  "one_to_one_mentorship",
  "papposhop_platform",
];

export const BUSINESS_STATUS_OPTIONS = [
  {
    value: "registered" as const,
    label: {
      en: "Registered business",
      mk: "Регистриран бизнис",
    },
  },
  {
    value: "not_registered" as const,
    label: {
      en: "Not registered business",
      mk: "Нерегистриран бизнис",
    },
  },
];

export const GENDER_OPTIONS = [
  {
    value: "female" as const,
    label: {
      en: "Female",
      mk: "Женски",
    },
  },
  {
    value: "male" as const,
    label: {
      en: "Male",
      mk: "Машки",
    },
  },
  {
    value: "other" as const,
    label: {
      en: "Other",
      mk: "Друго",
    },
  },
];

export const SUPPORT_SERVICE_OPTIONS = [
  {
    value: "digitalization" as const,
    label: {
      en: "Digitalization",
      mk: "Дигитализација",
    },
  },
  {
    value: "incubation_program" as const,
    label: {
      en: "Incubation Program",
      mk: "Инкубациска програма",
    },
  },
  {
    value: "acceleration_program" as const,
    label: {
      en: "Acceleration Program",
      mk: "Акселерациска програма",
    },
  },
  {
    value: "growth_program" as const,
    label: {
      en: "Growth Program",
      mk: "Програма за раст",
    },
  },
  {
    value: "one_to_one_mentorship" as const,
    label: {
      en: "One-to-One Mentorship",
      mk: "Индивидуално менторство",
    },
  },
  {
    value: "papposhop_platform" as const,
    label: {
      en: "PappoShop Platform",
      mk: "PappoShop платформа",
    },
  },
];

export const supportServiceLabelMap = Object.fromEntries(
  SUPPORT_SERVICE_OPTIONS.map((service) => [service.value, service.label.en]),
) as Record<SupportService, string>;

export const entrepreneurSelectableFields = `
  id,
  name,
  surname,
  phone_number,
  city,
  email,
  business_status,
  gender,
  age,
  support_services,
  notes,
  created_by,
  updated_by,
  created_at,
  updated_at
`;

export const entrepreneurCsvTemplateHeaders = [
  "Name",
  "Surname",
  "Phone Number",
  "City",
  "Email",
  "Business Status",
  "Gender",
  "Age",
  "Support Services",
  "Notes",
] as const;

export const defaultImportRows = [
  {
    Name: "Elena",
    Surname: "Petrovska",
    "Phone Number": "+38970123456",
    City: "Skopje",
    Email: "elena@example.com",
    "Business Status": "registered",
    Gender: "female",
    Age: "29",
    "Support Services": "digitalization;growth_program",
    Notes: "Interested in online sales support.",
  },
];
