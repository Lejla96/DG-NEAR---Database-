"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DistributionItem } from "@/lib/types";

const COLORS = ["#205493", "#2b6cb0", "#0f9d7a", "#f3b23c", "#7b61ff", "#d14343"];

type ChartsProps = {
  cityDistribution: DistributionItem[];
  genderDistribution: DistributionItem[];
  statusDistribution: DistributionItem[];
  serviceDistribution: DistributionItem[];
  labels: {
    byCity: string;
    byGender: string;
    byStatus: string;
    serviceCoverage: string;
  };
};

export function DashboardCharts({
  cityDistribution,
  genderDistribution,
  statusDistribution,
  serviceDistribution,
  labels,
}: ChartsProps) {
  return (
    <div className="charts-grid">
      <ChartCard title={labels.byCity}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cityDistribution}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#205493" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={labels.serviceCoverage}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={serviceDistribution} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#0f9d7a" radius={[0, 10, 10, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={labels.byGender}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={genderDistribution} dataKey="value" nameKey="label" outerRadius={90}>
              {genderDistribution.map((item, index) => (
                <Cell key={item.label} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={labels.byStatus}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={statusDistribution} dataKey="value" nameKey="label" outerRadius={90}>
              {statusDistribution.map((item, index) => (
                <Cell key={item.label} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
