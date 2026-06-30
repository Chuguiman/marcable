export default function VigilanciaPage() {
  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Vigilancia</h1>
          <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
            Monitorea nuevas marcas similares automaticamente
          </p>
        </div>
        <button
          className="px-4 py-2 bg-brand text-menu-text font-semibold text-sm rounded-lg opacity-50 cursor-not-allowed"
          disabled
        >
          + Nueva vigilancia
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-neutral-400 mb-1">No tienes vigilancias activas</p>
        <p className="text-xs text-slate-400 dark:text-neutral-500">
          Crea una vigilancia para recibir alertas cuando se registren marcas similares
        </p>
      </div>
    </div>
  );
}
