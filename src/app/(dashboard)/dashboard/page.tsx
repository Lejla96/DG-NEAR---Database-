import { DashboardCharts } from "@/components/analytics/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data";
import {
  getDictionary,
  translateBusinessStatus,
  translateGender,
  translateSupportService,
} from "@/lib/translations";
import { formatDate, formatNumber } from "@/lib/utils";
import type { AppLanguage, FilterState, Gender, BusinessStatus, SupportService } from "@/lib/types";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const locale: AppLanguage = getValue(params.lang) === "mk" ? "mk" : "en";
  const dictionary = getDictionary(locale);

  const filters: FilterState = {
    search: getValue(params.search),
    city: getValue(params.city),
    gender: getValue(params.gender) as FilterState["gender"],
    businessStatus: getValue(params.businessStatus) as FilterState["businessStatus"],
    service: getValue(params.service) as FilterState["service"],
    edit: "",
  };

  const data = await getDashboardData(filters);

  return (
    <div className="page-stack">
      <section className="metrics-grid">
        <MetricCard
          title={dictionary["dashboard.totalEntrepreneurs"]}
          value={formatNumber(data.totals.entrepreneurs, locale)}
        />
        <MetricCard
          title={dictionary["dashboard.registeredBusinesses"]}
          value={formatNumber(data.totals.registeredBusinesses, locale)}
        />
        <MetricCard
          title={dictionary["dashboard.notRegisteredBusinesses"]}
          value={formatNumber(data.totals.notRegisteredBusinesses, locale)}
        />
        <MetricCard
          title={dictionary["dashboard.serviceAssignments"]}
          value={formatNumber(data.totals.serviceAssignments, locale)}
        />
      </section>

      <DashboardCharts
        cityDistribution={data.cityDistribution}
        genderDistribution={data.genderDistribution.map((item) => ({
          ...item,
          label: translateGender(item.label as Gender, locale),
        }))}
        statusDistribution={data.statusDistribution.map((item) => ({
          ...item,
          label: translateBusinessStatus(item.label as BusinessStatus, locale),
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

      <div className="two-column-grid">
        <Card>
          <CardHeader>
            <CardTitle>{dictionary["dashboard.recentActivity"]}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.activity.length ? (
              <div className="activity-list">
                {data.activity.map((entry) => (
                  <div key={entry.id} className="activity-item">
                    <strong>{entry.actor_name ?? entry.actor_email ?? "Admin"}</strong>
                    <p>
                      {
                        dictionary[
                          `activity.${entry.action}` as
                            | "activity.created"
                            | "activity.updated"
                            | "activity.deleted"
                            | "activity.imported"
                            | "activity.exported"
                            | "activity.signed_in"
                        ]
                      }
                      {entry.entrepreneur_name ? `: ${entry.entrepreneur_name}` : ""}
                    </p>
                    <span>{formatDate(entry.created_at, locale)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-copy">{dictionary["activity.empty"]}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{dictionary["nav.entrepreneurs"]}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.entrepreneurs.length ? (
              <div className="activity-list">
                {data.entrepreneurs.slice(0, 6).map((record) => (
                  <div key={record.id} className="activity-item">
                    <strong>
                      {record.name} {record.surname}
                    </strong>
                    <p>
                      {record.city} ·{" "}
                      {translateBusinessStatus(record.business_status, locale)}
                    </p>
                    <span>
                      {record.support_services
                        .map((service) => translateSupportService(service, locale))
                        .join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-copy">{dictionary["dashboard.empty"]}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="metric-card">
      <CardContent>
        <p className="metric-label">{title}</p>
        <strong className="metric-value">{value}</strong>
      </CardContent>
    </Card>
  );
}
