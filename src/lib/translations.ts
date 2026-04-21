import type { AppLanguage, BusinessStatus, Gender, SupportService } from "@/lib/types";

export const locales = ["en", "mk"] as const;

export type TranslationKey =
  | "app.title"
  | "app.subtitle"
  | "app.language"
  | "auth.title"
  | "auth.subtitle"
  | "auth.email"
  | "auth.password"
  | "auth.signIn"
  | "auth.signOut"
  | "auth.allowedAccounts"
  | "nav.dashboard"
  | "nav.entrepreneurs"
  | "nav.importExport"
  | "nav.activity"
  | "dashboard.overview"
  | "dashboard.totalEntrepreneurs"
  | "dashboard.registeredBusinesses"
  | "dashboard.notRegisteredBusinesses"
  | "dashboard.serviceAssignments"
  | "dashboard.serviceCoverage"
  | "dashboard.byCity"
  | "dashboard.byGender"
  | "dashboard.byStatus"
  | "dashboard.recentActivity"
  | "dashboard.empty"
  | "common.save"
  | "common.cancel"
  | "common.delete"
  | "common.edit"
  | "common.create"
  | "common.update"
  | "common.search"
  | "common.filters"
  | "common.clear"
  | "common.actions"
  | "common.notes"
  | "common.dateAdded"
  | "common.lastUpdated"
  | "common.loading"
  | "common.noResults"
  | "common.optional"
  | "common.downloadTemplate"
  | "common.export"
  | "form.name"
  | "form.surname"
  | "form.phone"
  | "form.city"
  | "form.email"
  | "form.businessStatus"
  | "form.gender"
  | "form.age"
  | "form.supportServices"
  | "form.submitCreate"
  | "form.submitUpdate"
  | "form.addEntrepreneur"
  | "form.editEntrepreneur"
  | "form.notes"
  | "form.importTitle"
  | "form.importDescription"
  | "form.importFile"
  | "form.importSubmit"
  | "table.fullName"
  | "table.supportServices"
  | "table.status"
  | "table.city"
  | "table.gender"
  | "table.age"
  | "table.email"
  | "table.phone"
  | "table.notes"
  | "table.updatedBy"
  | "filters.city"
  | "filters.gender"
  | "filters.businessStatus"
  | "filters.supportService"
  | "activity.title"
  | "activity.empty"
  | "status.registered"
  | "status.notRegistered"
  | "gender.female"
  | "gender.male"
  | "gender.other"
  | "service.digitalization"
  | "service.incubation"
  | "service.acceleration"
  | "service.growth"
  | "service.mentorship"
  | "service.papposhop"
  | "messages.saved"
  | "messages.updated"
  | "messages.deleted"
  | "messages.imported"
  | "messages.exported"
  | "messages.error"
  | "messages.unauthorized"
  | "messages.fileReady"
  | "validation.required"
  | "validation.email"
  | "validation.age"
  | "validation.service"
  | "import.invalidFile"
  | "import.noData"
  | "import.noValidRows"
  | "import.issues"
  | "activity.created"
  | "activity.updated"
  | "activity.deleted"
  | "activity.imported"
  | "activity.signed_in"
  | "activity.exported";

export type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  "app.title": "DG NEAR 2 Project",
  "app.subtitle": "Entrepreneur beneficiary database",
  "app.language": "Language",
  "auth.title": "Admin access",
  "auth.subtitle": "Sign in with an approved DG NEAR 2 administrator account.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.signIn": "Sign in",
  "auth.signOut": "Sign out",
  "auth.allowedAccounts": "Approved administrators: martina@redi-ngo.eu and lejla@redi-ngo.eu",
  "nav.dashboard": "Dashboard",
  "nav.entrepreneurs": "Entrepreneurs",
  "nav.importExport": "Import / Export",
  "nav.activity": "Activity log",
  "dashboard.overview": "Overview",
  "dashboard.totalEntrepreneurs": "Total entrepreneurs",
  "dashboard.registeredBusinesses": "Registered businesses",
  "dashboard.notRegisteredBusinesses": "Not registered businesses",
  "dashboard.serviceAssignments": "Support assignments",
  "dashboard.serviceCoverage": "Beneficiaries by support service",
  "dashboard.byCity": "Entrepreneurs by city",
  "dashboard.byGender": "Entrepreneurs by gender",
  "dashboard.byStatus": "Business registration status",
  "dashboard.recentActivity": "Recent activity",
  "dashboard.empty": "No entrepreneur data is available yet.",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.create": "Create",
  "common.update": "Update",
  "common.search": "Search",
  "common.filters": "Filters",
  "common.clear": "Clear",
  "common.actions": "Actions",
  "common.notes": "Notes",
  "common.dateAdded": "Date added",
  "common.lastUpdated": "Last updated",
  "common.loading": "Loading",
  "common.noResults": "No records match the current filters.",
  "common.optional": "Optional",
  "common.downloadTemplate": "Download CSV template",
  "common.export": "Export to Excel",
  "form.name": "Name",
  "form.surname": "Surname",
  "form.phone": "Phone number",
  "form.city": "City",
  "form.email": "Email",
  "form.businessStatus": "Business status",
  "form.gender": "Gender",
  "form.age": "Age",
  "form.supportServices": "Support services",
  "form.submitCreate": "Create entrepreneur",
  "form.submitUpdate": "Update entrepreneur",
  "form.addEntrepreneur": "Add entrepreneur",
  "form.editEntrepreneur": "Edit entrepreneur",
  "form.notes": "Notes",
  "form.importTitle": "Import entrepreneurs",
  "form.importDescription": "Upload CSV or XLSX files that use the template columns below.",
  "form.importFile": "Choose file",
  "form.importSubmit": "Import data",
  "table.fullName": "Full name",
  "table.supportServices": "Support services",
  "table.status": "Status",
  "table.city": "City",
  "table.gender": "Gender",
  "table.age": "Age",
  "table.email": "Email",
  "table.phone": "Phone",
  "table.notes": "Notes",
  "table.updatedBy": "Updated by",
  "filters.city": "City",
  "filters.gender": "Gender",
  "filters.businessStatus": "Business status",
  "filters.supportService": "Support service",
  "activity.title": "Activity log",
  "activity.empty": "No activity has been recorded yet.",
  "status.registered": "Registered business",
  "status.notRegistered": "Not registered business",
  "gender.female": "Female",
  "gender.male": "Male",
  "gender.other": "Other",
  "service.digitalization": "Digitalization",
  "service.incubation": "Incubation Program",
  "service.acceleration": "Acceleration Program",
  "service.growth": "Growth Program",
  "service.mentorship": "One-to-One Mentorship",
  "service.papposhop": "PappoShop Platform",
  "messages.saved": "Changes saved successfully.",
  "messages.updated": "Record updated successfully.",
  "messages.deleted": "Record deleted successfully.",
  "messages.imported": "Records imported successfully.",
  "messages.exported": "Export created successfully.",
  "messages.error": "Something went wrong. Please review the input and try again.",
  "messages.unauthorized": "Only approved administrators can access this platform.",
  "messages.fileReady": "Your export file is ready.",
  "validation.required": "Please complete all required fields.",
  "validation.email": "Enter a valid email address.",
  "validation.age": "Age must be between 18 and 100.",
  "validation.service": "Select at least one support service.",
  "import.invalidFile": "The uploaded file could not be read.",
  "import.noData": "The uploaded file does not contain any rows.",
  "import.noValidRows": "No valid rows were found in the uploaded file.",
  "import.issues": "Rows skipped during import",
  "activity.created": "created entrepreneur",
  "activity.updated": "updated entrepreneur",
  "activity.deleted": "deleted entrepreneur",
  "activity.imported": "imported entrepreneurs",
  "activity.signed_in": "signed in",
  "activity.exported": "exported entrepreneur data",
};

const mk: Dictionary = {
  "app.title": "DG NEAR 2 Проект",
  "app.subtitle": "База на корисници претприемачи",
  "app.language": "Јазик",
  "auth.title": "Администраторски пристап",
  "auth.subtitle": "Најавете се со одобрен администраторски профил за DG NEAR 2.",
  "auth.email": "Е-пошта",
  "auth.password": "Лозинка",
  "auth.signIn": "Најави се",
  "auth.signOut": "Одјави се",
  "auth.allowedAccounts": "Одобрени администратори: martina@redi-ngo.eu и lejla@redi-ngo.eu",
  "nav.dashboard": "Контролна табла",
  "nav.entrepreneurs": "Претприемачи",
  "nav.importExport": "Увоз / Извоз",
  "nav.activity": "Дневник на активности",
  "dashboard.overview": "Преглед",
  "dashboard.totalEntrepreneurs": "Вкупно претприемачи",
  "dashboard.registeredBusinesses": "Регистрирани бизниси",
  "dashboard.notRegisteredBusinesses": "Нерегистрирани бизниси",
  "dashboard.serviceAssignments": "Доделени услуги",
  "dashboard.serviceCoverage": "Корисници по услуга за поддршка",
  "dashboard.byCity": "Претприемачи по град",
  "dashboard.byGender": "Претприемачи по пол",
  "dashboard.byStatus": "Статус на регистрација на бизнис",
  "dashboard.recentActivity": "Последни активности",
  "dashboard.empty": "Се уште нема внесени податоци за претприемачи.",
  "common.save": "Зачувај",
  "common.cancel": "Откажи",
  "common.delete": "Избриши",
  "common.edit": "Уреди",
  "common.create": "Креирај",
  "common.update": "Ажурирај",
  "common.search": "Пребарај",
  "common.filters": "Филтри",
  "common.clear": "Исчисти",
  "common.actions": "Акции",
  "common.notes": "Белешки",
  "common.dateAdded": "Датум на внес",
  "common.lastUpdated": "Последно ажурирање",
  "common.loading": "Се вчитува",
  "common.noResults": "Нема записи што одговараат на тековните филтри.",
  "common.optional": "Опционално",
  "common.downloadTemplate": "Преземи CSV шаблон",
  "common.export": "Извези во Excel",
  "form.name": "Име",
  "form.surname": "Презиме",
  "form.phone": "Телефонски број",
  "form.city": "Град",
  "form.email": "Е-пошта",
  "form.businessStatus": "Статус на бизнис",
  "form.gender": "Пол",
  "form.age": "Возраст",
  "form.supportServices": "Услуги за поддршка",
  "form.submitCreate": "Креирај претприемач",
  "form.submitUpdate": "Ажурирај претприемач",
  "form.addEntrepreneur": "Додади претприемач",
  "form.editEntrepreneur": "Уреди претприемач",
  "form.notes": "Белешки",
  "form.importTitle": "Увоз на претприемачи",
  "form.importDescription": "Прикачете CSV или XLSX датотеки што ги користат колоните од шаблонот подолу.",
  "form.importFile": "Избери датотека",
  "form.importSubmit": "Увези податоци",
  "table.fullName": "Име и презиме",
  "table.supportServices": "Услуги за поддршка",
  "table.status": "Статус",
  "table.city": "Град",
  "table.gender": "Пол",
  "table.age": "Возраст",
  "table.email": "Е-пошта",
  "table.phone": "Телефон",
  "table.notes": "Белешки",
  "table.updatedBy": "Ажурирано од",
  "filters.city": "Град",
  "filters.gender": "Пол",
  "filters.businessStatus": "Статус на бизнис",
  "filters.supportService": "Услуга за поддршка",
  "activity.title": "Дневник на активности",
  "activity.empty": "Се уште нема евидентирани активности.",
  "status.registered": "Регистриран бизнис",
  "status.notRegistered": "Нерегистриран бизнис",
  "gender.female": "Женски",
  "gender.male": "Машки",
  "gender.other": "Друго",
  "service.digitalization": "Дигитализација",
  "service.incubation": "Инкубациска програма",
  "service.acceleration": "Акселерациска програма",
  "service.growth": "Програма за раст",
  "service.mentorship": "Индивидуално менторство",
  "service.papposhop": "PappoShop платформа",
  "messages.saved": "Промените се успешно зачувани.",
  "messages.updated": "Записот е успешно ажуриран.",
  "messages.deleted": "Записот е успешно избришан.",
  "messages.imported": "Записите се успешно увезени.",
  "messages.exported": "Извозот е успешно креиран.",
  "messages.error": "Настана грешка. Проверете ги податоците и обидете се повторно.",
  "messages.unauthorized": "Само одобрени администратори имаат пристап до платформата.",
  "messages.fileReady": "Вашата датотека за извоз е подготвена.",
  "validation.required": "Пополнете ги сите задолжителни полиња.",
  "validation.email": "Внесете валидна е-пошта.",
  "validation.age": "Возрастa мора да биде помеѓу 18 и 100.",
  "validation.service": "Изберете најмалку една услуга за поддршка.",
  "import.invalidFile": "Прикачената датотека не може да се прочита.",
  "import.noData": "Прикачената датотека не содржи редови.",
  "import.noValidRows": "Во прикачената датотека нема валидни редови.",
  "import.issues": "Редови прескокнати при увоз",
  "activity.created": "креираше претприемач",
  "activity.updated": "ажурираше претприемач",
  "activity.deleted": "избриша претприемач",
  "activity.imported": "увезе претприемачи",
  "activity.signed_in": "се најави",
  "activity.exported": "извезе податоци за претприемачи",
};

export const dictionary: Record<AppLanguage, Dictionary> = { en, mk };

export function getDictionary(locale: AppLanguage) {
  return dictionary[locale];
}

export function isLocale(value: string): value is AppLanguage {
  return locales.includes(value as AppLanguage);
}

export function translateBusinessStatus(
  status: BusinessStatus,
  locale: AppLanguage,
) {
  return dictionary[locale][
    status === "registered" ? "status.registered" : "status.notRegistered"
  ];
}

export function translateGender(gender: Gender, locale: AppLanguage) {
  const key =
    gender === "female"
      ? "gender.female"
      : gender === "male"
        ? "gender.male"
        : "gender.other";
  return dictionary[locale][key];
}

export function translateSupportService(
  service: SupportService,
  locale: AppLanguage,
) {
  const key =
    service === "digitalization"
      ? "service.digitalization"
      : service === "incubation_program"
        ? "service.incubation"
        : service === "acceleration_program"
          ? "service.acceleration"
          : service === "growth_program"
            ? "service.growth"
            : service === "one_to_one_mentorship"
              ? "service.mentorship"
              : "service.papposhop";
  return dictionary[locale][key];
}
