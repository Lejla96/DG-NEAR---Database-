import { deleteEntrepreneurAction } from "@/app/actions";
import { EntrepreneurForm } from "@/components/entrepreneurs/entrepreneur-form";
import { DashboardCharts } from "@/components/analytics/charts";
import { ExportButton } from "@/components/export/export-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { SUPPORT_SERVICES } from "@/lib/constants";
import { getDashboardData } from "@/lib/data";
import {
  getDictionary,
  translateBusinessStatus,
  translateGender,
  translateSupportService,
} from "@/lib/translations";
import type { AppLanguage, FilterState, SupportService } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(
  value: string | string[] | undefined,
  fallback = "",
) {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

export default async function EntrepreneursPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const locale = (getSearchValue(params.lang, "en") === "mk"
    ? "mk"
    : "en") as AppLanguage;
  const filters: FilterState = {
    search: getSearchValue(params.search),
    city: getSearchValue(params.city),
    gender: getSearchValue(params.gender) as FilterState["gender"],
    businessStatus: getSearchValue(
      params.businessStatus,
    ) as FilterState["businessStatus"],
    service: getSearchValue(params.service) as FilterState["service"],
    edit: getSearchValue(params.edit),
  };
  const dictionary = getDictionary(locale);
  const data = await getDashboardData(filters);
  const editing =
    data.entrepreneurs.find((item) => item.id === filters.edit) ?? null;

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">{dictionary["nav.entrepreneurs"]}</p>
          <h2>{dictionary["form.addEntrepreneur"]}</h2>
          <p>{dictionary["app.subtitle"]}</p>
        </div>
      </div>

      <div className="page-grid dashboard-grid">
        <EntrepreneurForm entrepreneur={editing} />

        <Card>
          <CardHeader>
            <CardTitle>{dictionary["common.filters"]}</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="get" className="form-grid">
              <input type="hidden" name="lang" value={locale} />
              <div className="field">
                <label htmlFor="search">{dictionary["common.search"]}</label>
                <input
                  id="search"
                  name="search"
                  defaultValue={filters.search}
                  className="form-control"
                />
              </div>
              <div className="field">
                <label htmlFor="city">{dictionary["filters.city"]}</label>
                <select
                  id="city"
                  name="city"
                  defaultValue={filters.city}
                  className="form-control"
                >
                  <option value="">All</option>
                  {data.cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="gender">{dictionary["filters.gender"]}</label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={filters.gender}
                  className="form-control"
                >
                  <option value="">All</option>
                  <option value="female">
                    {translateGender("female", locale)}
                  </option>
                  <option value="male">
                    {translateGender("male", locale)}
                  </option>
                  <option value="other">
                    {translateGender("other", locale)}
                  </option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="businessStatus">
                  {dictionary["filters.businessStatus"]}
                </label>
                <select
                  id="businessStatus"
                  name="businessStatus"
                  defaultValue={filters.businessStatus}
                  className="form-control"
                >
                  <option value="">All</option>
                  <option value="registered">
                    {translateBusinessStatus("registered", locale)}
                  </option>
                  <option value="not_registered">
                    {translateBusinessStatus("not_registered", locale)}
                  </option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="service">{dictionary["filters.supportService"]}</label>
                <select
                  id="service"
                  name="service"
                  defaultValue={filters.service}
                  className="form-control"
                >
                  <option value="">All</option>
                  {SUPPORT_SERVICES.map((service) => (
                    <option key={service} value={service}>
                      {translateSupportService(service as SupportService, locale)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="actions-row">
                <Button type="submit">{dictionary["common.search"]}</Button>
                <a href={`/entrepreneurs?lang=${locale}`} className="button-link">
                  {dictionary["common.clear"]}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts
        cityDistribution={data.cityDistribution}
        genderDistribution={data.genderDistribution.map((item) => ({
          ...item,
          label: translateGender(item.label as "female" | "male" | "other", locale),
        }))}
        statusDistribution={data.statusDistribution.map((item) => ({
          ...item,
          label: translateBusinessStatus(
            item.label as "registered" | "not_registered",
            locale,
          ),
        }))}
        serviceDistribution={data.serviceDistribution.map((item) => ({
          ...item,
          label: translateSupportService(item.label as SupportService, locale),
        }))}
        labels={{
          byCity: dictionary["dashboard.byCity"],
          byGender: dictionary["dashboard.byGender"],
          byStatus: dictionary["dashboard.byStatus"],
          serviceCoverage: dictionary["dashboard.serviceCoverage"],
        }}
      />

      <Card>
        <CardHeader className="card-header-row">
          <CardTitle>{dictionary["nav.entrepreneurs"]}</CardTitle>
          <ExportButton filters={filters} label={dictionary["common.export"]} />
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>{dictionary["table.fullName"]}</TH>
                <TH>{dictionary["table.phone"]}</TH>
                <TH>{dictionary["table.email"]}</TH>
                <TH>{dictionary["table.city"]}</TH>
                <TH>{dictionary["table.status"]}</TH>
                <TH>{dictionary["table.gender"]}</TH>
                <TH>{dictionary["table.age"]}</TH>
                <TH>{dictionary["table.supportServices"]}</TH>
                <TH>{dictionary["common.notes"]}</TH>
                <TH>{dictionary["common.lastUpdated"]}</TH>
                <TH>{dictionary["common.actions"]}</TH>
              </TR>
            </THead>
            <TBody>
              {data.entrepreneurs.length ? (
                data.entrepreneurs.map((entrepreneur) => (
                  <TR key={entrepreneur.id}>
                    <TD>
                      <strong>
                        {entrepreneur.name} {entrepreneur.surname}
                      </strong>
                    </TD>
                    <TD>{entrepreneur.phone_number}</TD>
                    <TD>{entrepreneur.email}</TD>
                    <TD>{entrepreneur.city}</TD>
                    <TD>
                      <Badge
                        tone={
                          entrepreneur.business_status === "registered"
                            ? "success"
                            : "warning"
                        }
                      >
                        {translateBusinessStatus(
                          entrepreneur.business_status,
                          locale,
                        )}
                      </Badge>
                    </TD>
                    <TD>{translateGender(entrepreneur.gender, locale)}</TD>
                    <TD>{entrepreneur.age}</TD>
                    <TD>
                      <div className="badge-list">
                        {entrepreneur.support_services.map((service) => (
                          <Badge key={service} tone="info">
                            {translateSupportService(service, locale)}
                          </Badge>
                        ))}
                      </div>
                    </TD>
                    <TD>{entrepreneur.notes || "-"}</TD>
                    <TD>{formatDate(entrepreneur.updated_at, locale)}</TD>
                    <TD>
                      <div className="table-actions">
                        <a
                          href={`/entrepreneurs?lang=${locale}&edit=${entrepreneur.id}`}
                          className="button-link button-link-small"
                        >
                          {dictionary["common.edit"]}
                        </a>
                        <form
                          action={async (formData) => {
                            "use server";
                            await deleteEntrepreneurAction(formData);
                          }}
                        >
                          <input type="hidden" name="id" value={entrepreneur.id} />
                          <input type="hidden" name="language" value={locale} />
                          <Button type="submit" variant="danger" className="button-small">
                            {dictionary["common.delete"]}
                          </Button>
                        </form>
                      </div>
                    </TD>
                  </TR>
                ))
              ) : (
                <TR>
                  <TD colSpan={11} className="empty-cell">
                    {dictionary["common.noResults"]}
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
