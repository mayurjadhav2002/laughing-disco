interface StatRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function StatRow({ label, value, valueClassName = "text-slate-800" }: StatRowProps) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={`font-bold tabular-nums ${valueClassName}`}>{value}</span>
    </div>
  );
}

interface DailySummaryProps {
  avgActual: number;
  avgForecast: number;
  mae: number;
}

export function DailySummary({ avgActual, avgForecast, mae }: DailySummaryProps) {
  return (
    <div className="pt-4 border-t border-slate-200 space-y-2.5">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
        Summary
      </p>
      <StatRow label="Avg Actual" value={`${avgActual.toLocaleString()} MW`} />
      <StatRow label="Avg Forecast" value={`${avgForecast.toLocaleString()} MW`} />
      <div className="pt-2 border-t border-slate-100">
        <StatRow
          label="MAE (day)"
          value={`${mae.toLocaleString()} MW`}
          valueClassName="text-rose-600"
        />
      </div>
    </div>
  );
}
