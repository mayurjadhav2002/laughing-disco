export default function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Forecasting Analytics
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Wind Generation Analysis • January 2026
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        All systems operational
      </div>
    </header>
  );
}
