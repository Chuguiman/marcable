import { createClient } from "@/lib/supabase/server";

async function getStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { count: totalTrademarks } = await supabase
    .from("trademarks")
    .select("*", { count: "exact", head: true });

  const { count: totalDenominations } = await supabase
    .from("denominations")
    .select("*", { count: "exact", head: true });

  return {
    trademarks: totalTrademarks ?? 0,
    denominations: totalDenominations ?? 0,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const stats = await getStats(supabase);

  const greeting = getGreeting();

  return (
    <div className="px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {greeting}, {user?.email?.split("@")[0]}
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
          Resumen de tu actividad en Marcable
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Marcas en DB"
          value={formatNumber(stats.trademarks)}
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.98 2.3l-1.05 7A2 2 0 0 1 18.78 21H6a2 2 0 0 1-2-2v-7.34a2 2 0 0 1 .59-1.41l6.41-6.41a2 2 0 0 1 3.41 1.63Z" />
              <path d="M7 10v12" />
            </svg>
          }
        />
        <StatCard
          label="Denominaciones"
          value={formatNumber(stats.denominations)}
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="m3 15 2 2 4-4" />
            </svg>
          }
        />
        <StatCard
          label="Busquedas hoy"
          value="0"
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          }
        />
        <StatCard
          label="Plan actual"
          value="Gratuito"
          accent
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-4">Acciones rapidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            href="/dashboard/consultas"
            title="Nueva consulta"
            description="Busca marcas por nombre, clase o solicitante"
            color="bg-blue-500/10 text-blue-600"
          />
          <QuickAction
            href="/dashboard/busqueda"
            title="Busqueda AI"
            description="Analisis fonetico avanzado con inteligencia artificial"
            color="bg-brand/10 text-brand"
          />
          <QuickAction
            href="/dashboard/vigilancia"
            title="Crear vigilancia"
            description="Monitorea nuevas marcas similares automaticamente"
            color="bg-amber-500/10 text-amber-600"
          />
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Actividad reciente</h2>
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-neutral-500">
            No hay actividad reciente. Realiza tu primera busqueda para comenzar.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`p-2 rounded-lg ${accent ? "bg-brand/10 text-brand" : "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400"}`}>
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold font-display tracking-tight">{value}</p>
      <p className="text-xs text-slate-500 dark:text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  color,
}: {
  href: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="block bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-5 hover:border-brand/40 hover:shadow-sm transition-all group"
    >
      <h3 className="font-semibold text-sm group-hover:text-brand transition-colors">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-neutral-500 mt-1.5 leading-relaxed">{description}</p>
    </a>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
