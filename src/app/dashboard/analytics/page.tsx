export default function AnalyticsPage() {
  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
          Estadisticas de uso, busquedas y tendencias
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MiniStat label="Busquedas totales" value="0" />
        <MiniStat label="Marcas vigiladas" value="0" />
        <MiniStat label="Alertas recibidas" value="0" />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-neutral-400 mb-1">Sin datos suficientes</p>
        <p className="text-xs text-slate-400 dark:text-neutral-500">
          Comienza a usar Marcable para ver estadisticas aqui
        </p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-5">
      <p className="text-2xl font-bold font-display">{value}</p>
      <p className="text-xs text-slate-500 dark:text-neutral-500 mt-1">{label}</p>
    </div>
  );
}
