"use client";

interface AuthTabsProps {
  activeTab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex border-b border-slate-200 dark:border-neutral-800 mb-6">
      {(["login", "register"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab
              ? "border-brand text-slate-900 dark:text-neutral-100"
              : "border-transparent text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-neutral-300"
          }`}
        >
          {tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      ))}
    </div>
  );
}
