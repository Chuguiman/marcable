"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Consultas",
    href: "/dashboard/consultas",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    label: "Busqueda AI",
    href: "/dashboard/busqueda",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    label: "Vigilancia",
    href: "/dashboard/vigilancia",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const bottomItems = [
  {
    label: "Configuracion",
    href: "/dashboard/settings",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Perfil",
    href: "/dashboard/perfil",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
];

function NavItem({
  item,
  isActive,
  collapsed,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-all ${
        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
      } ${
        isActive
          ? "bg-brand/15 text-brand"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {item.icon}
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function Sidebar({
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}: {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[68px] w-64" : "w-64"}`}
        style={{ background: "#0D302D" }}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-white/10 ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}>
          {collapsed ? (
            <div
              className="rounded-lg flex items-center justify-center shrink-0"
              style={{
                width: 28,
                height: 28,
                background: "linear-gradient(135deg, #69EA9B 0%, #54D987 100%)",
                boxShadow: "0 4px 12px rgba(13, 48, 45, 0.22)",
              }}
            >
              <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="#0D302D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.98 2.3l-1.05 7A2 2 0 0 1 18.78 21H6a2 2 0 0 1-2-2v-7.34a2 2 0 0 1 .59-1.41l6.41-6.41a2 2 0 0 1 3.41 1.63Z" />
              </svg>
            </div>
          ) : (
            <>
              <Logo size={28} variant="light" />
              <button
                onClick={onClose}
                className="lg:hidden text-white/60 hover:text-white p-1"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Main nav */}
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} isActive={isActive(item.href)} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom nav */}
        <div className={`py-4 space-y-1 border-t border-white/10 ${collapsed ? "px-2" : "px-3"}`}>
          {bottomItems.map((item) => (
            <NavItem key={item.href} item={item} isActive={isActive(item.href)} collapsed={collapsed} />
          ))}

          {/* Collapse toggle — desktop only */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center gap-3 w-full rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-colors px-3 py-2.5 justify-center"
            title={collapsed ? "Expandir menu" : "Colapsar menu"}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-5 h-5 shrink-0 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m11 17-5-5 5-5" />
              <path d="m18 17-5-5 5-5" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
