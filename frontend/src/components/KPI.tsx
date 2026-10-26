import type { LucideIcon } from "lucide-react";
import { Target, ShieldCheck, Zap } from "lucide-react";
import { useWindSummary } from "@/hooks/useWindSummary";

interface KPICardProps {
  title: string;
  value?: string | number;
  subtitle: string;
  Icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  isLoading?: boolean;
}

export function KPICard({
  title,
  value,
  subtitle,
  Icon,
  iconColorClass,
  iconBgClass,
  isLoading,
}: KPICardProps) {
  return (
    <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="w-full mr-2">
          <p className="text-[14px] font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          {isLoading ? (
            <div className="h-9 w-32 bg-slate-200 rounded-md animate-pulse mt-2" />
          ) : (
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              {value ?? "—"}
            </h3>
          )}
        </div>
        <div className={`p-3 rounded-lg shrink-0 ${iconBgClass}`}>
          <Icon className={`w-6 h-6 ${iconColorClass}`} />
        </div>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
        ) : (
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

const formatMW = (val?: number): string => {
  if (val === undefined || val === null || isNaN(val)) return "—";
  return `${val.toLocaleString(undefined, { maximumFractionDigits: 1 })} MW`;
};

export default function KPI() {
  const { data: summaryData, isLoading: summaryLoading } = useWindSummary();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <KPICard
        title="Forecast Error (MAE)"
        value={formatMW(summaryData?.mae)}
        subtitle="Average absolute deviation from actuals"
        Icon={Target}
        iconColorClass="text-rose-600"
        iconBgClass="bg-rose-50"
        isLoading={summaryLoading}
      />

      <KPICard
        title="95% Dependable Capacity"
        value={formatMW(summaryData?.dependable_capacity_mw)}
        subtitle="Output exceeded 95% of the time"
        Icon={ShieldCheck}
        iconColorClass="text-emerald-600"
        iconBgClass="bg-emerald-50"
        isLoading={summaryLoading}
      />

      <KPICard
        title="Avg Daily Generation"
        value={formatMW(summaryData?.average_generation)}
        subtitle="Mean generation across the month"
        Icon={Zap}
        iconColorClass="text-blue-600"
        iconBgClass="bg-blue-50"
        isLoading={summaryLoading}
      />
    </div>
  );
}
