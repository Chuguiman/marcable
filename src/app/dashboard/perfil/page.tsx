import { createClient } from "@/lib/supabase/server";

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const initials = email.split("@")[0].slice(0, 2).toUpperCase();
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Mi perfil</h1>
        <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
          Informacion de tu cuenta
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Avatar + name */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand/20 text-brand flex items-center justify-center text-xl font-bold font-display">
              {initials}
            </div>
            <div>
              <p className="font-semibold">{email.split("@")[0]}</p>
              <p className="text-sm text-slate-500 dark:text-neutral-500">{email}</p>
              <p className="text-xs text-slate-400 dark:text-neutral-600 mt-1">
                Miembro desde {createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-6">
          <h2 className="font-display text-sm font-semibold mb-4">Datos personales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre completo" placeholder="Tu nombre" />
            <Field label="Empresa" placeholder="Nombre de tu empresa" />
            <Field label="Telefono" placeholder="+57 300 000 0000" />
            <Field label="Pais" placeholder="Colombia" />
          </div>
          <button
            className="mt-4 px-5 py-2.5 bg-brand text-menu-text font-semibold text-sm rounded-lg opacity-50 cursor-not-allowed"
            disabled
          >
            Guardar cambios
          </button>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-6">
          <h2 className="font-display text-sm font-semibold mb-4">Seguridad</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cambiar contrasena</p>
              <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">
                Actualiza tu contrasena de acceso
              </p>
            </div>
            <button
              className="px-4 py-2 border border-slate-200 dark:border-neutral-700 text-sm font-medium rounded-lg opacity-50 cursor-not-allowed"
              disabled
            >
              Cambiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-neutral-400 mb-1.5">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        disabled
      />
    </div>
  );
}
