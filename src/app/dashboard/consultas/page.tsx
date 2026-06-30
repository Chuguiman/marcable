"use client";

import { useState, useCallback } from "react";
import { Select } from "@/components/ui/select";
import { MultiSelectAutocomplete, type AutocompleteOption } from "@/components/ui/multi-select-autocomplete";
import { NiceClassPicker } from "@/components/ui/nice-class-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { createClient } from "@/lib/supabase/client";

const queryTabs = [
  { id: "marca", label: "Expresion / Marca", placeholder: "Nombre de la marca..." },
  { id: "solicitante", label: "Solicitante / Titular", placeholder: "Nombre del solicitante o titular..." },
  { id: "representante", label: "Representante / Apoderado", placeholder: "Nombre del representante..." },
  { id: "expediente", label: "No. Solicitud / Expediente", placeholder: "Numero de solicitud, expediente o certificado..." },
  { id: "publicacion", label: "Publicacion", placeholder: "Numero de gaceta o publicacion..." },
  { id: "fechas", label: "Fechas", placeholder: "" },
] as const;

type TabId = (typeof queryTabs)[number]["id"];

const searchModes = [
  { value: "contenida", label: "Contenida" },
  { value: "exacta", label: "Exacta" },
  { value: "prefijo", label: "Prefijo" },
  { value: "sufijo", label: "Sufijo" },
];

const categoriaOptions = [
  { value: "", label: "Todas" },
  { value: "producto", label: "Producto" },
  { value: "servicio", label: "Servicio" },
];

const estatusOptions = [
  { value: "", label: "Todos" },
  { value: "tramite", label: "En tramite" },
  { value: "registrada", label: "Registrada" },
  { value: "negada", label: "Negada" },
  { value: "desistida", label: "Desistida" },
  { value: "vencida", label: "Vencida" },
];

const tipoMarcaOptions = [
  { value: "", label: "Todos" },
  { value: "nominativa", label: "Nominativa" },
  { value: "figurativa", label: "Figurativa" },
  { value: "mixta", label: "Mixta" },
  { value: "tridimensional", label: "Tridimensional" },
  { value: "sonora", label: "Sonora" },
];

const codigoVienaOptions = [
  { value: "", label: "Todos" },
];

const fechaTipoOptions = [
  { value: "solicitud", label: "Fecha de solicitud" },
  { value: "publicacion", label: "Fecha de publicacion" },
  { value: "registro", label: "Fecha de registro" },
  { value: "vencimiento", label: "Fecha de vencimiento" },
];

export default function ConsultasPage() {
  const [activeTab, setActiveTab] = useState<TabId>("marca");
  const [showFilters, setShowFilters] = useState(false);
  const [searchMode, setSearchMode] = useState("contenida");
  const [filters, setFilters] = useState({
    categoria: "",
    estatus: "",
    tipo: "",
    vienna: "",
  });
  const [niceClasses, setNiceClasses] = useState<number[]>([]);
  const [fechaTipo, setFechaTipo] = useState("solicitud");

  // Multi-select autocomplete state
  const [selectedSolicitantes, setSelectedSolicitantes] = useState<AutocompleteOption[]>([]);
  const [solicitanteOptions, setSolicitanteOptions] = useState<AutocompleteOption[]>([]);
  const [solicitanteLoading, setSolicitanteLoading] = useState(false);

  const [selectedRepresentantes, setSelectedRepresentantes] = useState<AutocompleteOption[]>([]);
  const [representanteOptions, setRepresentanteOptions] = useState<AutocompleteOption[]>([]);
  const [representanteLoading, setRepresentanteLoading] = useState(false);

  const searchApplicants = useCallback(async (query: string) => {
    if (query.length < 2) { setSolicitanteOptions([]); return; }
    setSolicitanteLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("applicants")
      .select("id, name")
      .ilike("name", `%${query}%`)
      .limit(15);
    setSolicitanteOptions(
      (data ?? []).map((d) => ({ value: String(d.id), label: d.name }))
    );
    setSolicitanteLoading(false);
  }, []);

  const searchRepresentatives = useCallback(async (query: string) => {
    if (query.length < 2) { setRepresentanteOptions([]); return; }
    setRepresentanteLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("representatives")
      .select("id, name")
      .ilike("name", `%${query}%`)
      .limit(15);
    setRepresentanteOptions(
      (data ?? []).map((d) => ({ value: String(d.id), label: d.name }))
    );
    setRepresentanteLoading(false);
  }, []);

  const currentTab = queryTabs.find((t) => t.id === activeTab)!;

  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Consultas</h1>
        <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
          Busca marcas por diferentes criterios
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 mb-6">
        <div className="border-b border-slate-200 dark:border-neutral-800 overflow-x-auto">
          <div className="flex min-w-max">
            {queryTabs.map((tab) => (
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

        {/* Search area */}
        <div className="p-5">
          {activeTab === "fechas" ? (
            <DateSearch fechaTipo={fechaTipo} onFechaTipoChange={setFechaTipo} />
          ) : (
            <>
              {/* Search mode pills — only for Expresion/Marca */}
              {activeTab === "marca" && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {searchModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setSearchMode(mode.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        searchMode === mode.value
                          ? "bg-brand/15 text-brand border border-brand/30"
                          : "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-500 border border-transparent hover:border-slate-300 dark:hover:border-neutral-600"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                {activeTab === "solicitante" ? (
                  <MultiSelectAutocomplete
                    placeholder={currentTab.placeholder}
                    selected={selectedSolicitantes}
                    onChange={setSelectedSolicitantes}
                    onSearch={searchApplicants}
                    loading={solicitanteLoading}
                    options={solicitanteOptions}
                  />
                ) : activeTab === "representante" ? (
                  <MultiSelectAutocomplete
                    placeholder={currentTab.placeholder}
                    selected={selectedRepresentantes}
                    onChange={setSelectedRepresentantes}
                    onSearch={searchRepresentatives}
                    loading={representanteLoading}
                    options={representanteOptions}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={currentTab.placeholder}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                  />
                )}
                <button className="px-5 py-2.5 bg-brand text-menu-text font-semibold text-sm rounded-lg hover:bg-brand-hover transition-colors shrink-0">
                  Buscar
                </button>
              </div>
            </>
          )}

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 mt-3 text-xs text-slate-500 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            <svg
              viewBox="0 0 24 24"
              className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="px-5 pb-5 border-t border-slate-100 dark:border-neutral-800 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select
                label="Categoria"
                value={filters.categoria}
                onChange={(v) => setFilters({ ...filters, categoria: v })}
                options={categoriaOptions}
              />
              <Select
                label="Estatus"
                value={filters.estatus}
                onChange={(v) => setFilters({ ...filters, estatus: v })}
                options={estatusOptions}
              />
              <Select
                label="Tipo de marca"
                value={filters.tipo}
                onChange={(v) => setFilters({ ...filters, tipo: v })}
                options={tipoMarcaOptions}
              />
              <NiceClassPicker
                label="Clases Niza"
                selected={niceClasses}
                onChange={setNiceClasses}
              />
              <Select
                label="Codigo Viena"
                value={filters.vienna}
                onChange={(v) => setFilters({ ...filters, vienna: v })}
                options={codigoVienaOptions}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-brand text-menu-text font-semibold text-xs rounded-lg hover:bg-brand-hover transition-colors">
                Aplicar filtros
              </button>
              <button
                onClick={() => { setFilters({ categoria: "", estatus: "", tipo: "", vienna: "" }); setNiceClasses([]); }}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-neutral-300 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results placeholder */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <p className="text-sm text-slate-500 dark:text-neutral-500">
          Realiza una busqueda para ver resultados aqui
        </p>
      </div>
    </div>
  );
}

function DateSearch({
  fechaTipo,
  onFechaTipoChange,
}: {
  fechaTipo: string;
  onFechaTipoChange: (v: string) => void;
}) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
      <Select
        label="Tipo de fecha"
        value={fechaTipo}
        onChange={onFechaTipoChange}
        options={fechaTipoOptions}
      />
      <DatePicker
        label="Desde"
        value={dateFrom}
        onChange={setDateFrom}
      />
      <DatePicker
        label="Hasta"
        value={dateTo}
        onChange={setDateTo}
      />
      <button className="px-5 py-2 bg-brand text-menu-text font-semibold text-sm rounded-lg hover:bg-brand-hover transition-colors h-[38px]">
        Buscar
      </button>
    </div>
  );
}
