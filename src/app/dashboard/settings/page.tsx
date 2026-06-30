export default function SettingsPage() {
  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Configuracion</h1>
        <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
          Administra tu cuenta y preferencias
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Plan */}
        <Section title="Plan actual">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Gratuito</p>
              <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">5 busquedas por dia</p>
            </div>
            <button
              className="px-4 py-2 bg-brand text-menu-text font-semibold text-sm rounded-lg opacity-50 cursor-not-allowed"
              disabled
            >
              Mejorar plan
            </button>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notificaciones">
          <div className="space-y-3">
            <ToggleRow label="Alertas de vigilancia" description="Recibe notificaciones cuando se detecten marcas similares" />
            <ToggleRow label="Resumen semanal" description="Recibe un resumen de tu actividad cada semana" />
          </div>
        </Section>

        {/* Danger zone */}
        <Section title="Zona de peligro" danger>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Eliminar cuenta</p>
              <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">Esta accion no se puede deshacer</p>
            </div>
            <button
              className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 font-semibold text-sm rounded-lg opacity-50 cursor-not-allowed"
              disabled
            >
              Eliminar
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  danger,
  children,
}: {
  title: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-xl border p-6 ${
      danger
        ? "border-red-200 dark:border-red-900/40"
        : "border-slate-200 dark:border-neutral-800"
    }`}>
      <h2 className={`font-display text-sm font-semibold mb-4 ${danger ? "text-red-600" : ""}`}>{title}</h2>
      {children}
    </div>
  );
}

function ToggleRow({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">{description}</p>
      </div>
      <div className="w-10 h-6 bg-slate-200 dark:bg-neutral-700 rounded-full relative cursor-not-allowed opacity-50">
        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1" />
      </div>
    </div>
  );
}
