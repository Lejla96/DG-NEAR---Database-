import { ImportDialog } from "@/components/entrepreneurs/import-dialog";
import { ExportButton } from "@/components/export/export-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data";
import { getDictionary } from "@/lib/translations";
import type { AppLanguage, FilterState } from "@/lib/types";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ImportExportPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const locale = (getParam(params.lang) === "mk" ? "mk" : "en") as AppLanguage;
  const filters: FilterState = {
    search: getParam(params.search),
    city: getParam(params.city),
    gender: getParam(params.gender) as FilterState["gender"],
    businessStatus: getParam(params.businessStatus) as FilterState["businessStatus"],
    service: getParam(params.service) as FilterState["service"],
    edit: "",
  };
  const dictionary = getDictionary(locale);
  const dashboard = await getDashboardData(filters);

  return (
    <div className="page-grid">
      <section className="page-header">
        <div>
          <p className="eyebrow">{dictionary["nav.importExport"]}</p>
          <h2>{dictionary["form.importTitle"]}</h2>
          <p>{dictionary["form.importDescription"]}</p>
        </div>
        <ExportButton filters={filters} label={dictionary["common.export"]} />
      </section>

      <div className="dashboard-grid">
        <ImportDialog
          title={dictionary["form.importTitle"]}
          description={dictionary["form.importDescription"]}
          downloadTemplateLabel={dictionary["common.downloadTemplate"]}
          sampleLabel="Sample support services format"
        />

        <Card>
          <CardHeader>
            <CardTitle>{dictionary["dashboard.overview"]}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="details-list">
              <div>
                <dt>{dictionary["dashboard.totalEntrepreneurs"]}</dt>
                <dd>{dashboard.totals.entrepreneurs}</dd>
              </div>
              <div>
                <dt>{dictionary["dashboard.registeredBusinesses"]}</dt>
                <dd>{dashboard.totals.registeredBusinesses}</dd>
              </div>
              <div>
                <dt>{dictionary["dashboard.notRegisteredBusinesses"]}</dt>
                <dd>{dashboard.totals.notRegisteredBusinesses}</dd>
              </div>
              <div>
                <dt>{dictionary["dashboard.serviceAssignments"]}</dt>
                <dd>{dashboard.totals.serviceAssignments}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
