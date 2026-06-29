import { Logo } from "@/components/ui/logo";

export function BrandingPanel() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-between lg:w-[55%] bg-[#0D302D] text-white p-10 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute -top-5 -right-5 w-[250px] h-[250px] rounded-full border border-brand/[0.12]" />
      <div className="absolute top-5 right-5 w-[180px] h-[180px] rounded-full border border-brand/[0.08]" />
      <div className="absolute bottom-10 -left-10 w-[120px] h-[120px] rounded-full bg-brand/[0.06] blur-[20px]" />

      {/* Logo */}
      <div className="relative z-10">
        <Logo size={32} />
      </div>

      {/* Headline */}
      <div className="relative z-10">
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight">
          Protege tu marca
          <br />
          antes de que
          <br />
          alguien más lo haga.
        </h1>
        <p className="mt-4 text-sm text-white/50 leading-relaxed">
          Búsqueda fonética inteligente en +1M marcas
          <br />
          registradas en Colombia.
        </p>
      </div>

      {/* Stats */}
      <div className="relative z-10 flex gap-8">
        {[
          { value: "1M+", label: "Marcas" },
          { value: "12", label: "Algoritmos" },
          { value: "98%", label: "Precisión" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-bold text-brand">{stat.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Compact mobile header shown above form on small screens */
export function BrandingHeader() {
  return (
    <div className="lg:hidden bg-[#0D302D] text-white px-6 py-8 text-center">
      <Logo size={28} />
      <h1 className="font-display text-xl font-bold mt-4 tracking-tight">
        Protege tu marca antes de que alguien más lo haga.
      </h1>
      <div className="flex justify-center gap-6 mt-4">
        {[
          { value: "1M+", label: "Marcas" },
          { value: "12", label: "Algoritmos" },
          { value: "98%", label: "Precisión" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-lg font-bold text-brand">{stat.value}</div>
            <div className="text-[10px] text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
