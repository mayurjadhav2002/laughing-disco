import type { GenerationSlot } from "@/data/windData";

/** Average of a numeric field across all slots */
export function avgField(data: GenerationSlot[], field: keyof Pick<GenerationSlot, "actual" | "forecast">): number {
  if (!data.length) return 0;
  return Math.round(data.reduce((sum, d) => sum + d[field], 0) / data.length);
}

/** Mean Absolute Error between actual and forecast */
export function calcMAE(data: GenerationSlot[]): number {
  if (!data.length) return 0;
  return Math.round(
    data.reduce((sum, d) => sum + Math.abs(d.actual - d.forecast), 0) / data.length,
  );
}

/** Format a Date to "02 Jan 2026" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
