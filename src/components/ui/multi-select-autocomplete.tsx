"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface AutocompleteOption {
  value: string;
  label: string;
}

export function MultiSelectAutocomplete({
  placeholder,
  selected,
  onChange,
  onSearch,
  loading,
  options,
}: {
  placeholder: string;
  selected: AutocompleteOption[];
  onChange: (items: AutocompleteOption[]) => void;
  onSearch: (query: string) => void;
  loading?: boolean;
  options: AutocompleteOption[];
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);
      if (value.length > 0) setOpen(true);
    },
    [onSearch]
  );

  function addItem(item: AutocompleteOption) {
    if (!selected.some((s) => s.value === item.value)) {
      onChange([...selected, item]);
    }
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeItem(value: string) {
    onChange(selected.filter((s) => s.value !== value));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Backspace" && query === "" && selected.length > 0) {
      removeItem(selected[selected.length - 1].value);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const filteredOptions = options.filter(
    (o) => !selected.some((s) => s.value === o.value)
  );

  return (
    <div ref={ref} className="relative flex-1">
      {/* Input area with tags */}
      <div
        className={`flex flex-wrap items-center gap-1.5 min-h-[42px] px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-text ${
          open
            ? "border-brand ring-2 ring-brand/40 bg-white dark:bg-neutral-800"
            : "border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800"
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected tags */}
        {selected.map((item) => (
          <span
            key={item.value}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand/10 text-brand text-xs font-medium max-w-[200px]"
          >
            <span className="truncate">{item.label}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.value);
              }}
              className="shrink-0 hover:text-red-500 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => { if (query.length > 0) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : "Agregar..."}
          className="flex-1 min-w-[120px] py-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
        />

        {/* Loading spinner */}
        {loading && (
          <svg className="w-4 h-4 shrink-0 text-slate-400 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
          {loading && filteredOptions.length === 0 ? (
            <p className="px-3 py-2 text-xs text-slate-400">Buscando...</p>
          ) : filteredOptions.length === 0 ? (
            <p className="px-3 py-2 text-xs text-slate-400">
              {query.length < 2 ? "Escribe al menos 2 caracteres" : "Sin resultados"}
            </p>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => addItem(opt)}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
