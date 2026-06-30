export default function BusquedaAIPage() {
  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
          Busqueda AI
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand/15 text-brand">Beta</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
          Analisis fonetico avanzado potenciado con inteligencia artificial
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ingresa la marca a analizar..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            disabled
          />
          <button
            className="px-5 py-2.5 bg-brand text-menu-text font-semibold text-sm rounded-lg opacity-50 cursor-not-allowed flex items-center gap-2"
            disabled
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
            Analizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FeatureCard
          title="12 Algoritmos foneticos"
          description="Soundex, Metaphone, Double Metaphone, NYSIIS, Caverphone, IPA y mas"
        />
        <FeatureCard
          title="Perfiles de similitud"
          description="Estricto, Moderado o Amplio — configura el nivel de coincidencia"
        />
        <FeatureCard
          title="Resultados ponderados"
          description="Score combinado con pesos configurables por algoritmo"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-5">
      <h3 className="text-sm font-semibold mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-neutral-500 leading-relaxed">{description}</p>
    </div>
  );
}
