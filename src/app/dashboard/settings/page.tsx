"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

const tabs = [
  { id: "billing", label: "Billing" },
  { id: "historial", label: "Historial" },
  { id: "notificaciones", label: "Notificaciones" },
  { id: "cuenta", label: "Cuenta" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("billing");

  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Configuracion</h1>
        <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
          Administra tu cuenta, plan y preferencias
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-neutral-800 mb-6 overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "billing" && <BillingTab />}
      {activeTab === "historial" && <HistorialTab />}
      {activeTab === "notificaciones" && <NotificacionesTab />}
      {activeTab === "cuenta" && <CuentaTab />}
    </div>
  );
}

/* ============================================================
   BILLING TAB
   ============================================================ */
const plans = [
  {
    code: "free",
    name: "Gratuito",
    price: 0,
    priceYearly: 0,
    features: [
      "5 consultas basicas por dia",
    ],
    limitations: [
      "Sin busqueda AI",
      "Sin exportacion",
      "Sin vigilancia",
      "Sin analytics",
      "Sin soporte prioritario",
    ],
    current: true,
  },
  {
    code: "emprende",
    name: "Emprende",
    price: 19,
    priceYearly: 15,
    features: [
      "Consultas basicas ilimitadas",
      "Exportacion PDF / Excel",
      "3 busquedas AI por dia",
      "Soporte por email",
    ],
    limitations: [
      "Sin vigilancia (pay-to-go: $20/unidad)",
      "Sin analytics",
    ],
    extras: "Vigilancia pay-to-go: $20 por marca",
  },
  {
    code: "profesional",
    name: "Profesional",
    price: 59,
    priceYearly: 47,
    features: [
      "Todo lo de Emprende",
      "20 busquedas AI por dia",
      "Analytics completo",
      "1 vigilancia incluida",
      "Vigilancia adicional: $10/unidad",
      "Soporte por email",
    ],
    limitations: [],
    popular: true,
  },
  {
    code: "business",
    name: "Business",
    price: 199,
    priceYearly: 159,
    features: [
      "Todo lo de Profesional",
      "50 busquedas AI por dia",
      "5 vigilancias incluidas",
      "Vigilancia adicional: $5/unidad",
      "Soporte por email y chat",
    ],
    limitations: [],
  },
];

function BillingTab() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="space-y-6">
      {/* Current plan summary */}
      <Section title="Plan actual">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">Gratuito</p>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-500">Activo</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">5 consultas basicas por dia</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-display">$0</p>
            <p className="text-[10px] text-slate-400">USD / mes</p>
          </div>
        </div>
      </Section>

      {/* Usage */}
      <Section title="Uso del periodo actual">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <UsageBar label="Consultas basicas" used={0} limit={5} unit="hoy" />
          <UsageBar label="Busquedas AI" used={0} limit={0} unit="hoy" />
          <UsageBar label="Vigilancia" used={0} limit={0} unit="marcas" />
          <UsageBar label="Exportaciones" used={0} limit={0} unit="este mes" />
        </div>
      </Section>

      {/* Plans comparison */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-sm font-semibold">Planes disponibles</h2>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${!annual ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>Mensual</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`w-10 h-6 rounded-full relative transition-colors ${annual ? "bg-brand" : "bg-slate-200 dark:bg-neutral-700"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${annual ? "translate-x-5" : "translate-x-1"}`} />
            </button>
            <span className={`text-xs font-medium ${annual ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
              Anual
              <span className="ml-1 text-[10px] text-brand font-bold">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const price = annual ? plan.priceYearly : plan.price;
            const isPopular = "popular" in plan && plan.popular;
            const isCurrent = "current" in plan && plan.current;

            return (
              <div
                key={plan.code}
                className={`relative bg-white dark:bg-neutral-900 rounded-xl border-2 p-5 flex flex-col ${
                  isPopular
                    ? "border-brand shadow-sm"
                    : isCurrent
                      ? "border-slate-300 dark:border-neutral-600"
                      : "border-slate-200 dark:border-neutral-800"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full bg-brand text-menu-text whitespace-nowrap">
                    Mas popular
                  </span>
                )}
                <h3 className="font-display text-base font-semibold">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-1">
                  <span className="text-3xl font-bold font-display">${price}</span>
                  {price > 0 && <span className="text-sm text-slate-500">/ mes</span>}
                </div>
                {annual && price > 0 && (
                  <p className="text-[10px] text-slate-400 mb-3">
                    ${price * 12} USD facturado anualmente
                  </p>
                )}
                {!annual && price > 0 && (
                  <p className="text-[10px] text-slate-400 mb-3">
                    Facturado mensualmente
                  </p>
                )}
                {price === 0 && <p className="text-[10px] text-slate-400 mb-3">Gratis para siempre</p>}

                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {plan.limitations.map((l) => (
                    <li key={l} className="flex items-start gap-2 text-xs text-slate-400">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                      {l}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button className="w-full py-2.5 rounded-lg text-sm font-medium border border-slate-300 dark:border-neutral-600 text-slate-500 cursor-default">
                    Plan actual
                  </button>
                ) : (
                  <button className="w-full py-2.5 rounded-lg text-sm font-semibold bg-brand text-menu-text hover:bg-brand-hover transition-colors">
                    Elegir plan
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment history */}
      <Section title="Historial de pagos">
        <div className="text-center py-6">
          <p className="text-xs text-slate-400">No hay pagos registrados</p>
        </div>
      </Section>
    </div>
  );
}

function UsageBar({ label, used, limit, unit }: { label: string; used: number; limit: number; unit: string }) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isDisabled = limit === 0;

  return (
    <div className={isDisabled ? "opacity-50" : ""}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-[11px] text-slate-500">
          {isDisabled ? "No disponible" : `${used} / ${limit} ${unit}`}
        </span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct > 80 ? "bg-red-500" : "bg-brand"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   HISTORIAL TAB
   ============================================================ */
function HistorialTab() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tipo, setTipo] = useState<"todas" | "busqueda" | "consulta">("todas");

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <DatePicker label="Desde" value={dateFrom} onChange={setDateFrom} />
          <DatePicker label="Hasta" value={dateTo} onChange={setDateTo} />
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-neutral-400 mb-1.5">Tipo</label>
            <div className="flex bg-slate-100 dark:bg-neutral-800 rounded-lg p-0.5">
              {([
                { value: "todas", label: "Todas" },
                { value: "busqueda", label: "Busqueda AI" },
                { value: "consulta", label: "Consultas" },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTipo(t.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    tipo === t.value
                      ? "bg-white dark:bg-neutral-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <button className="px-4 py-2 bg-brand text-menu-text font-semibold text-xs rounded-lg hover:bg-brand-hover transition-colors h-[34px]">
            Filtrar
          </button>
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-neutral-800">
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-neutral-500">Fecha</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-neutral-500">Tipo</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-neutral-500">Consulta</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-neutral-500">Resultados</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-neutral-500">Perfil</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-12 text-xs text-slate-400">
                No hay busquedas registradas. Realiza tu primera busqueda para verla aqui.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   NOTIFICACIONES TAB
   ============================================================ */
function NotificacionesTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Section title="Alertas">
        <div className="space-y-3">
          <ToggleRow
            label="Alertas de vigilancia"
            description="Recibe notificaciones cuando se detecten marcas similares a las que monitoreas"
          />
          <ToggleRow
            label="Nuevas publicaciones"
            description="Notificacion cuando se publique una nueva gaceta de marcas"
          />
        </div>
      </Section>

      <Section title="Resumen">
        <div className="space-y-3">
          <ToggleRow
            label="Resumen semanal"
            description="Recibe un resumen de tu actividad cada semana por email"
          />
          <ToggleRow
            label="Novedades del producto"
            description="Enterate de nuevas funciones y mejoras en Marcable"
          />
        </div>
      </Section>

      <Section title="Canal de notificacion">
        <div className="space-y-3">
          <ToggleRow
            label="Email"
            description="Notificaciones a tu correo electronico"
            defaultOn
          />
          <ToggleRow
            label="Push (proximamente)"
            description="Notificaciones push en el navegador"
          />
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   CUENTA TAB
   ============================================================ */
function CuentaTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Section title="Preferencias">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-neutral-400 mb-1.5">Idioma</label>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand/15 text-brand border border-brand/30">
                Espanol
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-neutral-800 text-slate-500 border border-transparent hover:border-slate-300 dark:hover:border-neutral-600 transition-colors">
                English
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-neutral-400 mb-1.5">Pais por defecto</label>
            <p className="text-sm">Colombia</p>
          </div>
        </div>
      </Section>

      <Section title="Sesiones activas">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Sesion actual</p>
              <p className="text-[11px] text-slate-400">Este dispositivo</p>
            </div>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand/15 text-brand">Activa</span>
        </div>
      </Section>

      <Section title="Zona de peligro" danger>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Exportar mis datos</p>
              <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">Descarga toda tu informacion en formato JSON</p>
            </div>
            <button className="px-4 py-2 border border-slate-200 dark:border-neutral-700 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
              Exportar
            </button>
          </div>
          <div className="border-t border-red-100 dark:border-red-900/20 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Eliminar cuenta</p>
                <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">Se eliminaran todos tus datos permanentemente</p>
              </div>
              <button className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   SHARED
   ============================================================ */
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

function ToggleRow({ label, description, defaultOn }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-6 rounded-full relative transition-colors ${
          on ? "bg-brand" : "bg-slate-200 dark:bg-neutral-700"
        }`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
          on ? "translate-x-5" : "translate-x-1"
        }`} />
      </button>
    </div>
  );
}
