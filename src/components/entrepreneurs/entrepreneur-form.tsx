"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";

import {
  createEntrepreneurAction,
  updateEntrepreneurAction,
} from "@/app/actions";
import {
  BUSINESS_STATUS_OPTIONS,
  GENDER_OPTIONS,
  SUPPORT_SERVICE_OPTIONS,
} from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState, Entrepreneur } from "@/lib/types";

type Props = {
  entrepreneur?: Entrepreneur | null;
};

const initialState: ActionState = { status: "idle" };

export function EntrepreneurForm({ entrepreneur }: Props) {
  const action = entrepreneur ? updateEntrepreneurAction : createEntrepreneurAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const { language, t } = useLanguage();
  const [selectedServices, setSelectedServices] = useState<string[]>(() =>
    entrepreneur?.support_services ?? [],
  );

  return (
    <Card className="card-surface">
      <CardHeader>
        <CardTitle>
          {entrepreneur ? t["form.editEntrepreneur"] : t["form.addEntrepreneur"]}
        </CardTitle>
        <CardDescription>
          {entrepreneur
            ? language === "en"
              ? "Update beneficiary details and keep support delivery records current."
              : "Ажурирајте ги деталите за корисникот и одржувајте ја евиденцијата за поддршката."
            : language === "en"
              ? "Add entrepreneurs manually when data is collected outside bulk import."
              : "Рачно додавајте претприемачи кога податоците не се внесуваат преку масовен увоз."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="form-stack">
          <input type="hidden" name="language" value={language} />
          {entrepreneur ? <input type="hidden" name="id" value={entrepreneur.id} /> : null}

          <div className="form-grid">
            <Field label={t["form.name"]}>
              <Input name="name" defaultValue={entrepreneur?.name ?? ""} required />
            </Field>
            <Field label={t["form.surname"]}>
              <Input name="surname" defaultValue={entrepreneur?.surname ?? ""} required />
            </Field>
            <Field label={t["form.phone"]}>
              <Input
                name="phone_number"
                defaultValue={entrepreneur?.phone_number ?? ""}
                required
              />
            </Field>
            <Field label={t["form.city"]}>
              <Input name="city" defaultValue={entrepreneur?.city ?? ""} required />
            </Field>
            <Field label={t["form.email"]}>
              <Input
                name="email"
                type="email"
                defaultValue={entrepreneur?.email ?? ""}
                required
              />
            </Field>
            <Field label={t["form.age"]}>
              <Input
                name="age"
                type="number"
                min={16}
                max={120}
                defaultValue={entrepreneur?.age ?? ""}
                required
              />
            </Field>
            <Field label={t["form.businessStatus"]}>
              <Select
                name="business_status"
                defaultValue={entrepreneur?.business_status ?? BUSINESS_STATUS_OPTIONS[0].value}
              >
                {BUSINESS_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[language]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t["form.gender"]}>
              <Select name="gender" defaultValue={entrepreneur?.gender ?? GENDER_OPTIONS[0].value}>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[language]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label={t["form.mapped"]}>
            <label className="toggle-option">
              <input
                type="checkbox"
                name="mapped"
                value="true"
                defaultChecked={entrepreneur?.mapped ?? false}
              />
              <span>{t["form.mappedDescription"]}</span>
            </label>
          </Field>

          <Field label={t["form.supportServices"]}>
            <div className="service-grid">
              {SUPPORT_SERVICE_OPTIONS.map((service) => {
                const checked = selectedServices.includes(service.value);
                return (
                  <label
                    key={service.value}
                    className={`service-option ${checked ? "service-option-active" : ""}`}
                  >
                    <input
                      type="checkbox"
                      name="support_services"
                      value={service.value}
                      checked={checked}
                      onChange={(event) => {
                        setSelectedServices((current) =>
                          event.target.checked
                            ? [...current, service.value]
                            : current.filter((item) => item !== service.value),
                        );
                      }}
                    />
                    <span>{service.label[language]}</span>
                  </label>
                );
              })}
            </div>
          </Field>

          <Field label={t["form.notes"]}>
            <Textarea
              name="notes"
              rows={5}
              defaultValue={entrepreneur?.notes ?? ""}
              placeholder={
                language === "en"
                  ? "Meeting outcomes, follow-up actions, donor context, or support notes."
                  : "Исходи од состаноци, следни чекори, донаторски контекст или белешки за поддршка."
              }
            />
          </Field>

          {state.message ? (
            <div
              className={`alert ${state.status === "error" ? "alert-error" : "alert-success"}`}
            >
              {state.message}
            </div>
          ) : null}

          <div className="actions-row">
            <Button type="submit" isLoading={isPending}>
              <Save size={16} />
              {entrepreneur ? t["form.submitUpdate"] : t["form.submitCreate"]}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field-block">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
