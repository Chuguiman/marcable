"use client";

import { useState, useRef, useEffect } from "react";

const CLASS_GROUPS = [
  { name: "Todas", classes: [] as number[] },
  { name: "Alimentos y bebidas", classes: [29, 30, 31, 32, 33] },
  { name: "Vestimenta y moda", classes: [18, 25, 26, 14] },
  { name: "Tecnologia", classes: [9, 35, 38, 42] },
  { name: "Salud y farmacia", classes: [3, 5, 10, 44] },
  { name: "Construccion e industria", classes: [6, 7, 11, 17, 19, 37] },
  { name: "Transporte y vehiculos", classes: [12, 39] },
  { name: "Educacion y entretenimiento", classes: [16, 41] },
  { name: "Servicios financieros", classes: [36] },
  { name: "Servicios legales", classes: [45] },
];

export function NiceClassPicker({
  label,
  selected,
  onChange,
}: {
  label?: string;
  selected: number[];
  onChange: (classes: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAll = selected.length === 0;

  function toggleClass(n: number) {
    if (selected.includes(n)) {
      onChange(selected.filter((c) => c !== n));
    } else {
      onChange([...selected, n].sort((a, b) => a - b));
    }
  }

  function selectGroup(classes: number[]) {
    if (classes.length === 0) {
      // "Todas"
      onChange([]);
    } else {
      // Toggle group: if all are selected, remove them; otherwise add them
      const allSelected = classes.every((c) => selected.includes(c));
      if (allSelected) {
        onChange(selected.filter((c) => !classes.includes(c)));
      } else {
        const merged = Array.from(new Set([...selected, ...classes])).sort((a, b) => a - b);
        onChange(merged);
      }
    }
  }

  const displayText = isAll
    ? "Todas las clases"
    : selected.length <= 5
      ? selected.map((c) => `Clase ${c}`).join(", ")
      : `${selected.length} clases seleccionadas`;

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-xs font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
          open
            ? "border-brand ring-2 ring-brand/40 bg-white dark:bg-neutral-800"
            : "border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 hover:border-slate-300 dark:hover:border-neutral-600"
        }`}
      >
        <span className={`truncate ${isAll ? "text-slate-500" : ""}`}>{displayText}</span>
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Selected chips (outside dropdown) */}
      {!isAll && selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand/10 text-brand text-xs font-medium"
            >
              {c}
              <button
                type="button"
                onClick={() => toggleClass(c)}
                className="hover:text-red-500 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 px-1"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden min-w-[320px]">
          {/* Quick groups */}
          <div className="px-3 pt-3 pb-2 border-b border-slate-100 dark:border-neutral-800">
            <p className="text-[10px] font-medium text-slate-400 dark:text-neutral-600 uppercase tracking-wider mb-2">
              Grupos rapidos
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CLASS_GROUPS.map((group) => {
                const isGroupAll = group.classes.length === 0;
                const isGroupActive = isGroupAll
                  ? isAll
                  : group.classes.every((c) => selected.includes(c));

                return (
                  <button
                    key={group.name}
                    type="button"
                    onClick={() => selectGroup(group.classes)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      isGroupActive
                        ? "bg-brand/15 text-brand border border-brand/30"
                        : "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-500 border border-transparent hover:border-slate-300 dark:hover:border-neutral-600"
                    }`}
                  >
                    {group.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Individual classes grid */}
          <div className="p-3 max-h-52 overflow-y-auto">
            <p className="text-[10px] font-medium text-slate-400 dark:text-neutral-600 uppercase tracking-wider mb-2">
              Seleccion individual
            </p>
            <div className="grid grid-cols-9 gap-1">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
                const isSelected = selected.includes(n);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggleClass(n)}
                    className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-brand text-menu-text"
                        : "bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
