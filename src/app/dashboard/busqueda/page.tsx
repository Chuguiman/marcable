"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import { NiceClassPicker } from "@/components/ui/nice-class-picker";

type Mode = "directa" | "guiada";

const profileOptions = [
  { value: "moderate", label: "Moderado — equilibrio precision/cobertura" },
  { value: "strict", label: "Estricto — alta coincidencia requerida" },
  { value: "broad", label: "Amplio — maxima cobertura" },
];

const countryOptions = [
  { value: "CO", label: "Colombia" },
];

export default function BusquedaAIPage() {
  const [mode, setMode] = useState<Mode | null>(null);

  return (
    <div className="px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
          Busqueda AI
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand/15 text-brand">Beta</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
          Un agente de IA analiza tu marca por escritura, fonetica e imagen
        </p>
      </div>

      {mode === null ? (
        /* Mode selection cards */
        <ModeSelector onSelect={setMode} />
      ) : (
        <>
          {/* Back + mode indicator */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setMode(null)}
              className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Cambiar modo
            </button>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 font-medium">
              {mode === "directa" ? "Busqueda directa" : "Busqueda guiada"}
            </span>
          </div>

          {mode === "directa" ? <DirectSearch /> : <GuidedSearch />}
        </>
      )}

      {/* Results area */}
      <ResultsPlaceholder />
    </div>
  );
}

/* ============================================================
   MODE SELECTOR — Landing cards
   ============================================================ */
function ModeSelector({ onSelect }: { onSelect: (mode: Mode) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
      {/* Guided */}
      <button
        onClick={() => onSelect("guiada")}
        className="text-left bg-white dark:bg-neutral-900 rounded-xl border-2 border-slate-200 dark:border-neutral-800 p-6 hover:border-brand/50 hover:shadow-md transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/15 transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-brand transition-colors">
          Busqueda guiada
        </h3>
        <p className="text-sm text-slate-500 dark:text-neutral-500 leading-relaxed mb-3">
          Te llevamos paso a paso. Ideal si es tu primera vez buscando marcas
          o si prefieres que te expliquemos cada opcion.
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-neutral-600">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m5 12 5 5L20 7" />
            </svg>
            4 pasos simples
          </span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m5 12 5 5L20 7" />
            </svg>
            Explicaciones claras
          </span>
        </div>
        <div className="mt-4 text-sm font-semibold text-brand flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Comenzar
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </button>

      {/* Direct */}
      <button
        onClick={() => onSelect("directa")}
        className="text-left bg-white dark:bg-neutral-900 rounded-xl border-2 border-slate-200 dark:border-neutral-800 p-6 hover:border-brand/50 hover:shadow-md transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/15 transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </div>
        <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-brand transition-colors">
          Busqueda directa
        </h3>
        <p className="text-sm text-slate-500 dark:text-neutral-500 leading-relaxed mb-3">
          Escribe la marca y analiza. Sin pasos intermedios.
          Para quienes ya saben lo que buscan.
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-neutral-600">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m5 12 5 5L20 7" />
            </svg>
            Un solo paso
          </span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m5 12 5 5L20 7" />
            </svg>
            Rapido y directo
          </span>
        </div>
        <div className="mt-4 text-sm font-semibold text-brand flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Comenzar
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </button>
    </div>
  );
}

/* ============================================================
   DIRECT SEARCH — Expert mode: one line, go.
   ============================================================ */
function DirectSearch() {
  const [profile, setProfile] = useState("moderate");
  const [niceClasses, setNiceClasses] = useState<number[]>([]);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-5 mb-6">
      <div className="flex flex-col lg:flex-row gap-3">
        <input
          type="text"
          placeholder="Nombre de la marca a analizar..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />
        <div className="flex gap-3 shrink-0">
          <div className="w-48">
            <Select
              value={profile}
              onChange={setProfile}
              options={profileOptions}
            />
          </div>
          <div className="w-44">
            <NiceClassPicker
              selected={niceClasses}
              onChange={setNiceClasses}
            />
          </div>
          <button className="px-5 py-2.5 bg-brand text-menu-text font-semibold text-sm rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-2 shrink-0">
            <SparkleIcon />
            Analizar
          </button>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-2.5">
        Nuestro agente analiza escritura, fonetica e imagen para encontrar marcas similares.
      </p>
    </div>
  );
}

/* ============================================================
   GUIDED SEARCH — Step-by-step for non-experts
   ============================================================ */
function GuidedSearch() {
  const [step, setStep] = useState(1);
  const [marca, setMarca] = useState("");
  const [profile, setProfile] = useState("moderate");
  const [niceClasses, setNiceClasses] = useState<number[]>([]);
  const [country, setCountry] = useState("CO");

  const totalSteps = 4;
  const canNext =
    (step === 1 && marca.trim().length >= 2) ||
    step === 2 ||
    step === 3 ||
    step === 4;

  function handleAnalyze() {
    // TODO: trigger search
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 mb-6">
      {/* Progress bar */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-brand">Paso {step} de {totalSteps}</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Step 1: Brand name */}
        {step === 1 && (
          <StepContainer
            title="¿Que marca deseas analizar?"
            hint="Escribe el nombre exacto como quieres registrarlo o como aparece en la solicitud."
          >
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="Ej: MARCABLE, NIKE, COCA-COLA..."
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-base focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              autoFocus
            />
          </StepContainer>
        )}

        {/* Step 2: Similarity profile */}
        {step === 2 && (
          <StepContainer
            title="¿Que tan estricta debe ser la busqueda?"
            hint="Determina cuantos resultados similares obtendras. Amplio encuentra mas coincidencias, Estricto solo las mas cercanas."
          >
            <div className="space-y-2">
              {[
                { value: "broad", name: "Amplio", desc: "Maxima cobertura. Encuentra similitudes lejanas. Ideal para due diligence completo.", icon: "🔍" },
                { value: "moderate", name: "Moderado", desc: "Equilibrio entre precision y cobertura. Recomendado para la mayoria de casos.", icon: "⚖️", recommended: true },
                { value: "strict", name: "Estricto", desc: "Solo muestra marcas muy similares. Alta precision, menos resultados.", icon: "🎯" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setProfile(p.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    profile === p.value
                      ? "border-brand bg-brand/5"
                      : "border-slate-200 dark:border-neutral-700 hover:border-slate-300 dark:hover:border-neutral-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{p.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{p.name}</span>
                        {p.recommended && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand/15 text-brand">Recomendado</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">{p.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 ${
                      profile === p.value ? "border-brand bg-brand" : "border-slate-300 dark:border-neutral-600"
                    }`}>
                      {profile === p.value && (
                        <svg viewBox="0 0 24 24" className="w-full h-full text-white p-[2px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <path d="m5 12 5 5L20 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </StepContainer>
        )}

        {/* Step 3: Filters */}
        {step === 3 && (
          <StepContainer
            title="¿Quieres filtrar por clase o pais?"
            hint="Opcional. Puedes limitar la busqueda a una clase Nice especifica o un pais."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NiceClassPicker
                label="Clases Niza"
                selected={niceClasses}
                onChange={setNiceClasses}
              />
              <Select
                label="Pais"
                value={country}
                onChange={setCountry}
                options={countryOptions}
              />
            </div>
          </StepContainer>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <StepContainer
            title="Confirma tu busqueda"
            hint="Revisa los parametros antes de lanzar el analisis."
          >
            <div className="bg-slate-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
              <ReviewRow label="Marca" value={marca} />
              <ReviewRow label="Perfil" value={profileOptions.find((p) => p.value === profile)?.label.split(" — ")[0] ?? profile} />
              <ReviewRow label="Clases Niza" value={niceClasses.length === 0 ? "Todas" : niceClasses.join(", ")} />
              <ReviewRow label="Pais" value={countryOptions.find((c) => c.value === country)?.label ?? country} />
            </div>
          </StepContainer>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              step === 1
                ? "invisible"
                : "text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
            }`}
          >
            Atras
          </button>

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                canNext
                  ? "bg-brand text-menu-text hover:bg-brand-hover"
                  : "bg-slate-200 dark:bg-neutral-700 text-slate-400 dark:text-neutral-500 cursor-not-allowed"
              }`}
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              className="px-5 py-2.5 bg-brand text-menu-text font-semibold text-sm rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-2"
            >
              <SparkleIcon />
              Analizar marca
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   RESULTS PLACEHOLDER
   ============================================================ */
function ResultsPlaceholder() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-10 text-center">
      <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
        <SparkleIcon size={24} />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-neutral-400 mb-1">
        Listo para analizar
      </p>
      <p className="text-xs text-slate-400 dark:text-neutral-500 max-w-md mx-auto">
        Nuestro agente de IA analiza tu marca en tres dimensiones para encontrar posibles conflictos
      </p>

      {/* Analysis dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto text-left">
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-neutral-800/50">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold mb-1">Escritura</h4>
          <p className="text-[11px] text-slate-500 dark:text-neutral-500 leading-relaxed">
            Compara como se escribe la marca: coincidencias exactas, parciales y variaciones ortograficas
          </p>
        </div>
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-neutral-800/50">
          <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 18v-6" />
              <path d="M8 18v-1" />
              <path d="M16 18v-3" />
              <path d="M20 18v-5" />
              <path d="M4 18v-2" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold mb-1">Fonetica</h4>
          <p className="text-[11px] text-slate-500 dark:text-neutral-500 leading-relaxed">
            Analiza como suena la marca: detecta marcas que suenan igual o parecido aunque se escriban diferente
          </p>
        </div>
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-neutral-800/50">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M20.4 14.5 16 10l-8 8" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold mb-1">Imagen</h4>
          <p className="text-[11px] text-slate-500 dark:text-neutral-500 leading-relaxed">
            Compara elementos visuales: logos, formas y colores similares entre marcas figurativas y mixtas
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SHARED COMPONENTS
   ============================================================ */
function StepContainer({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold mb-1">{title}</h2>
      <p className="text-xs text-slate-500 dark:text-neutral-500 mb-4">{hint}</p>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500 dark:text-neutral-500">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function SparkleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
