import { useMemo, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertCircle } from "lucide-react";
import type { IntradayPoint } from "../types/wind";

interface ChartPoint {
  timeLabel: string;
  actual: number;
  forecast: number;
}

function ChartLoading() {
  return (
    <div className="w-full h-full bg-slate-50/50 rounded-xl flex items-center justify-center animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-400">
          Loading generation profile...
        </p>
      </div>
    </div>
  );
}

function ChartError({ message }: { message?: string }) {
  return (
    <div className="w-full h-full bg-rose-50/30 rounded-xl flex flex-col items-center justify-center border border-rose-100 p-6 text-center">
      <div className="p-3 bg-rose-50 text-rose-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <p className="text-sm font-semibold">Unable to load generation data</p>
      <p className="text-xs text-gray-600 mt-1 max-w-sm">
        {message ||
          "There was an error retrieving the data. Please try again later."}
      </p>
    </div>
  );
}

function ChartEmpty() {
  return (
    <div className="w-full h-full bg-slate-50/50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
      <p className="text-sm font-medium text-slate-400">
        No generation profile data available for this date.
      </p>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const actual = payload.find((p: any) => p.dataKey === "actual")?.value;
  const forecast = payload.find((p: any) => p.dataKey === "forecast")?.value;
  const diff =
    typeof actual === "number" && typeof forecast === "number"
      ? actual - forecast
      : null;

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-3 text-xs min-w-[150px]">
      <p className="font-semibold text-slate-700 mb-2 border-b border-slate-100 pb-1">
        Time: <span className="font-mono text-blue-600">{label}</span>
      </p>
      {payload.map((p: any) => (
        <div
          key={p.dataKey}
          className="flex items-center justify-between gap-3 mb-1"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-slate-500 capitalize">{p.name}:</span>
          </div>
          <span className="font-bold text-slate-800 tabular-nums">
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value} MW
          </span>
        </div>
      ))}
      {diff !== null && (
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 mt-1 text-[11px]">
          <span className="text-slate-400">Variance:</span>
          <span
            className={`font-semibold tabular-nums ${
              diff >= 0 ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} MW
          </span>
        </div>
      )}
    </div>
  );
}

function LegendItem({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
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

function VerticalTick({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  if (!payload?.value || !payload.value.endsWith(":00")) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={8}
        dx={-4}
        textAnchor="end"
        fill="#94a3b8"
        fontSize={10}
        transform="rotate(-90)"
      >
        {payload.value}
      </text>
    </g>
  );
}

function HorizontalTick({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  if (!payload?.value || !payload.value.endsWith(":00")) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={10}
      >
        {payload.value}
      </text>
    </g>
  );
}

function ProfileAreaChart({
  data,
  needsVertical,
}: {
  data: ChartPoint[];
  needsVertical: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 8,
          right: 8,
          left: -12,
          bottom: needsVertical ? 18 : 4,
        }}
      >
        <ChartDefs />
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />
        <XAxis
          dataKey="timeLabel"
          tick={needsVertical ? <VerticalTick /> : <HorizontalTick />}
          tickFormatter={(v: string) => (v && v.endsWith(":00") ? v : "")}
          height={needsVertical ? 48 : 30}
          interval={0}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{
            stroke: "#94a3b8",
            strokeWidth: 1,
            strokeDasharray: "3 3",
          }}
        />
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
  );
}

interface Props {
  data: IntradayPoint[];
  dateLabel: string;
  isLoading?: boolean;
  error?: boolean | string | Error | null;
}

export function GenerationChart({ data, dateLabel, isLoading, error }: Props) {
  const [needsVertical, setNeedsVertical] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setNeedsVertical(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formattedData = useMemo<ChartPoint[]>(() => {
    if (!data || data.length === 0) return [];

    const timeMap = new Map<string, ChartPoint>();

    data.forEach((item) => {
      let timeLabel = "";
      if (typeof item.start_time === "string") {
        const timePart = item.start_time.includes("T")
          ? item.start_time.split("T")[1]
          : item.start_time.includes(" ")
          ? item.start_time.split(" ")[1]
          : item.start_time;
        timeLabel = timePart ? timePart.slice(0, 5) : "";
      }
      if (!timeLabel) return;

      if (!timeMap.has(timeLabel)) {
        timeMap.set(timeLabel, {
          timeLabel,
          actual: item.actual_generation ?? 0,
          forecast: item.forecast_generation ?? 0,
        });
      }
    });

    return Array.from(timeMap.values()).sort((a, b) =>
      a.timeLabel.localeCompare(b.timeLabel),
    );
  }, [data]);

  const errorMessage = useMemo(() => {
    if (!error) return undefined;
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return undefined;
  }, [error]);

  const renderChartContent = () => {
    if (isLoading) {
      return <ChartLoading />;
    }
    if (error) {
      return <ChartError message={errorMessage} />;
    }
    if (formattedData.length === 0) {
      return <ChartEmpty />;
    }
    return (
      <ProfileAreaChart data={formattedData} needsVertical={needsVertical} />
    );
  };

  return (
    <div className="flex-1 min-w-0 w-full p-4 sm:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
            Half-Hourly Generation Profile
          </p>
          <h2 className="text-base font-bold text-slate-800">
            {dateLabel}{" "}
            {!isLoading &&
              !error &&
              formattedData.length > 0 &&
              `— ${formattedData.length} Intervals`}
          </h2>
        </div>
        <div className="flex gap-4 items-center">
          <LegendItem color="#3b82f6" label="Actual" />
          <LegendItem color="#f59e0b" label="Forecast" dashed />
        </div>
      </div>

      <div className="w-full min-w-0 h-[340px] sm:h-[400px] md:h-[440px] relative">
        {renderChartContent()}
      </div>
    </div>
  );
}
