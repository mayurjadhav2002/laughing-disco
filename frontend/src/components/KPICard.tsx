import React from "react";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  Icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  Icon,
  iconColorClass,
  iconBgClass,
}: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${iconBgClass}`}>
          <Icon className={`w-6 h-6 ${iconColorClass}`} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}
