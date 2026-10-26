import Charts from "./Charts";
import Header from "./Header";
import { KPICard } from "./KPICard";
import { Wind, Target, ShieldCheck, Zap } from "lucide-react";
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Forecast Error (MAE)"
          value="452 MW"
          subtitle="Average absolute deviation from actuals"
          Icon={Target}
          iconColorClass="text-rose-600"
          iconBgClass="bg-rose-50"
        />

        <KPICard
          title="95% Dependable Capacity"
          value="2,100 MW"
          subtitle="Output exceeded 95% of the time"
          Icon={ShieldCheck}
          iconColorClass="text-emerald-600"
          iconBgClass="bg-emerald-50"
        />

        <KPICard
          title="Avg Daily Generation"
          value="14,500 MW"
          subtitle="Mean generation across the month"
          Icon={Zap}
          iconColorClass="text-blue-600"
          iconBgClass="bg-blue-50"
        />
      </div>

      <Charts />
    </div>
  );
}
