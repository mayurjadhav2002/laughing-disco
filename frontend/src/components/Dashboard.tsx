import Charts from "./AnalysisChart";
import Header from "./Header";
import KPI from "./KPI";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Header />
        <KPI />
        <Charts />
      </div>
    </div>
  );
}
