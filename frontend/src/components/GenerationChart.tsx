import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { GenerationSlot } from "@/data/windData";

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-semibold text-slate-600 mb-2">Time: {label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500 capitalize">{p.name}:</span>
          <span className="font-bold text-slate-800 tabular-nums">
            {p.value.toLocaleString()} MW
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Legend items ─────────────────────────────────────────────────────────────
function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 font-medium text-slate-500 text-xs">
      <span
        className="w-3 inline-block"
        style={{
          height: 2,
          background: dashed ? "transparent" : color,
          borderTop: dashed ? `2px dashed ${color}` : "none",
          borderRadius: 2,
        }}
      />
      {label}
    </span>
  );
}

// ─── Chart gradients ──────────────────────────────────────────────────────────
function ChartDefs() {
  return (
    <defs>
      <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12} />
        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

// ─── Main chart component ─────────────────────────────────────────────────────
interface Props {
  data: GenerationSlot[];
  dateLabel: string;
}

export function GenerationChart({ data, dateLabel }: Props) {
  return (
    <div className="flex-1 p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
            Half-Hourly Generation Profile
          </p>
          <h2 className="text-base font-bold text-slate-800">
            {dateLabel} — 48 Intervals
          </h2>
        </div>
        <div className="flex gap-3">
          <LegendItem color="#3b82f6" label="Actual" />
          <LegendItem color="#f59e0b" label="Forecast" dashed />
        </div>
      </div>

      {/* Recharts */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
            <ChartDefs />
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              interval={5}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#gradActual)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              name="Forecast"
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fill="url(#gradForecast)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
