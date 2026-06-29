# Login & Authentication — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the login/registration screen with Supabase Auth (email + Google), middleware route protection, and auto-provisioning of user profiles with freemium plan.

**Architecture:** Next.js App Router with Supabase Auth via `@supabase/ssr`. Split-screen login page (dark branding left, form right). DB trigger auto-creates user profile + freemium subscription on signup. Middleware protects all routes except public auth pages.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Supabase Auth (`@supabase/supabase-js`, `@supabase/ssr`), Google Fonts (Poppins, Jost)

---

## File Structure

```
marcable/
├── .env.local                          # Supabase keys (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── middleware.ts                        # Route protection
├── src/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser Supabase client
│   │   │   ├── server.ts               # Server Supabase client (cookies)
│   │   │   └── middleware.ts           # Supabase client for middleware
│   │   └── auth-errors.ts             # Error message mapping
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (fonts, theme)
│   │   ├── globals.css                 # Tailwind + custom styles
│   │   ├── login/
│   │   │   └── page.tsx               # Login/Register split-screen
│   │   ├── forgot-password/
│   │   │   └── page.tsx               # Forgot password form
│   │   ├── reset-password/
│   │   │   └── page.tsx               # Reset password form
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts           # OAuth + email verify callback
│   │   └── dashboard/
│   │       └── page.tsx               # Placeholder post-login page
│   └── components/
│       ├── auth/
│       │   ├── login-form.tsx          # Login tab form
│       │   ├── register-form.tsx       # Register tab form
│       │   ├── social-login.tsx        # Google OAuth button
│       │   ├── auth-tabs.tsx           # Tab toggle Login/Registro
│       │   └── branding-panel.tsx      # Left split-screen panel
│       ├── ui/
│       │   ├── input.tsx               # Styled input with error
│       │   ├── button.tsx              # Button with loading state
│       │   └── logo.tsx                # Marcable logo component
│       └── email-verify-banner.tsx     # Email verification banner
├── supabase/
│   └── migrations/
│       └── 001_auth_provisioning.sql   # Trigger + seed + RLS
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.gitignore`, `.env.local`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

- [ ] **Step 1: Initialize Next.js with TypeScript and Tailwind**

```bash
cd C:/laragon/www/marcable
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git --turbopack
```

Use `--no-git` since we'll init git separately. Accept defaults for everything else.

- [ ] **Step 2: Install Supabase dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 3: Install Google Fonts (Poppins + Jost)**

No package needed — use `next/font/google` in layout. Verify by checking `src/app/layout.tsx` exists.

- [ ] **Step 4: Create `.env.local` with Supabase placeholders**

Create `C:/laragon/www/marcable/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 5: Add `.env.local` and `.superpowers/` to `.gitignore`**

Append to `.gitignore`:

```
.env.local
.superpowers/
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on `http://localhost:3000`, shows Next.js default page.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js project with Supabase deps"
```

---

## Task 2: Configure Tailwind with Marcable design system

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update `tailwind.config.ts` with brand colors and fonts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#69EA9B",
          hover: "#54D987",
          dark: "#69EA9B",
          subtle: "rgba(105, 234, 155, 0.18)",
        },
        page: {
          bg: "#e0e1da",
          deep: "#d5d7cf",
        },
        menu: {
          green: "#69EA9B",
          text: "#0D302D",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-jost)", "var(--font-poppins)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Update `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --page-bg: #e0e1da;
  --page-bg-deep: #d5d7cf;
  --menu-green: #69EA9B;
  --menu-text: #0D302D;
}

body {
  font-family: var(--font-poppins), system-ui, sans-serif;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.38), transparent 34%),
    linear-gradient(180deg, var(--page-bg) 0%, var(--page-bg-deep) 100%);
}

.dark body {
  background: #0a0a0a;
}

* {
  -webkit-tap-highlight-color: transparent;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #404040;
}
```

- [ ] **Step 3: Update `src/app/layout.tsx` with fonts**

```tsx
import type { Metadata } from "next";
import { Poppins, Jost } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Marcable — Búsqueda inteligente de marcas",
  description: "Motor de búsqueda de similitud de marcas registradas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${poppins.variable} ${jost.variable}`}>
      <body className="bg-page-bg dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify fonts load correctly**

```bash
npm run dev
```

Open `http://localhost:3000` — text should render in Poppins.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx
git commit -m "style: configure Tailwind with Marcable design system (brand colors, Poppins/Jost fonts)"
```

---

## Task 3: Create Supabase client utilities

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`

- [ ] **Step 1: Create browser client — `src/lib/supabase/client.ts`**

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 2: Create server client — `src/lib/supabase/server.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
```

- [ ] **Step 3: Create middleware client — `src/lib/supabase/middleware.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password", "/auth/callback"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Authenticated user on login page → redirect to dashboard
  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

- [ ] **Step 4: Create root middleware — `middleware.ts`**

```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/supabase/ middleware.ts
git commit -m "feat: add Supabase client utilities and auth middleware"
```

---

## Task 4: Create shared UI components

**Files:**
- Create: `src/components/ui/logo.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/button.tsx`

- [ ] **Step 1: Create Logo component — `src/components/ui/logo.tsx`**

```tsx
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-lg flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #69EA9B 0%, #54D987 100%)",
          boxShadow: "0 4px 12px rgba(13, 48, 45, 0.22)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={size * 0.6}
          height={size * 0.6}
          fill="none"
          stroke="#0D302D"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10v12" />
          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.98 2.3l-1.05 7A2 2 0 0 1 18.78 21H6a2 2 0 0 1-2-2v-7.34a2 2 0 0 1 .59-1.41l6.41-6.41a2 2 0 0 1 3.41 1.63Z" />
        </svg>
      </div>
      <span className="font-display text-lg font-bold tracking-tight">
        Marcable
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Create Input component — `src/components/ui/input.tsx`**

```tsx
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-500 dark:text-neutral-500 mb-1.5 uppercase tracking-wide"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-11 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-sm focus:outline-none transition-colors ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 dark:border-neutral-700 focus:border-brand"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
```

- [ ] **Step 3: Create Button component — `src/components/ui/button.tsx`**

```tsx
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg text-sm h-11 px-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand hover:bg-brand-hover text-menu-text shadow-sm",
    outline:
      "border border-slate-300 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300",
    ghost:
      "hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add shared UI components (Logo, Input, Button)"
```

---

## Task 5: Create auth error mapper

**Files:**
- Create: `src/lib/auth-errors.ts`

- [ ] **Step 1: Create `src/lib/auth-errors.ts`**

```ts
const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos",
  "invalid_credentials": "Correo o contraseña incorrectos",
  "Email not confirmed": "Debes verificar tu email antes de iniciar sesión",
  "User already registered": "Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?",
  "over_email_send_rate_limit": "Demasiados intentos. Espera unos minutos.",
  "over_request_rate_limit": "Demasiados intentos. Espera unos minutos.",
};

export function getAuthErrorMessage(error: { message?: string; code?: string }): string {
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  if (error.message && ERROR_MESSAGES[error.message]) {
    return ERROR_MESSAGES[error.message];
  }
  return "Algo salió mal. Intenta de nuevo.";
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth-errors.ts
git commit -m "feat: add Supabase auth error message mapper (Spanish)"
```

---

## Task 6: Build the branding panel (left side of login)

**Files:**
- Create: `src/components/auth/branding-panel.tsx`

- [ ] **Step 1: Create `src/components/auth/branding-panel.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/auth/branding-panel.tsx
git commit -m "feat: add branding panel for login split-screen"
```

---

## Task 7: Build auth form components

**Files:**
- Create: `src/components/auth/auth-tabs.tsx`
- Create: `src/components/auth/login-form.tsx`
- Create: `src/components/auth/register-form.tsx`
- Create: `src/components/auth/social-login.tsx`

- [ ] **Step 1: Create `src/components/auth/auth-tabs.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/components/auth/login-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!email) errors.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Formato de correo inválido";
    if (!password) errors.password = "La contraseña es obligatoria";
    else if (password.length < 8)
      errors.password = "Mínimo 8 caracteres";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(getAuthErrorMessage(authError));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Correo electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        disabled={loading}
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        disabled={loading}
      />
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-brand hover:text-brand-hover font-medium"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full">
        Iniciar sesión
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Create `src/components/auth/register-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!email) errors.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Formato de correo inválido";
    if (!password) errors.password = "La contraseña es obligatoria";
    else if (password.length < 8)
      errors.password = "Mínimo 8 caracteres";
    if (!confirmPassword)
      errors.confirmPassword = "Confirma tu contraseña";
    else if (password !== confirmPassword)
      errors.confirmPassword = "Las contraseñas no coinciden";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(getAuthErrorMessage(authError));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Correo electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        disabled={loading}
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        disabled={loading}
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={fieldErrors.confirmPassword}
        disabled={loading}
      />
      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full">
        Crear cuenta
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Create `src/components/auth/social-login.tsx`**

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function SocialLogin() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-slate-200 dark:bg-neutral-800" />
        <span className="text-xs text-slate-400 dark:text-neutral-600">o</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-neutral-800" />
      </div>
      <Button
        variant="outline"
        loading={loading}
        onClick={handleGoogleLogin}
        className="w-full"
        type="button"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continuar con Google
      </Button>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/auth/
git commit -m "feat: add auth form components (login, register, social, tabs)"
```

---

## Task 8: Build login page

**Files:**
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Create `src/app/login/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { BrandingPanel, BrandingHeader } from "@/components/auth/branding-panel";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { SocialLogin } from "@/components/auth/social-login";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile header */}
      <BrandingHeader />

      {/* Desktop left panel */}
      <BrandingPanel />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-[#fafaf7] dark:bg-[#0A0A0A] px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-neutral-100">
              {activeTab === "login" ? "Bienvenido" : "Crea tu cuenta"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
              {activeTab === "login"
                ? "Ingresa a tu cuenta para continuar"
                : "Regístrate gratis y empieza a buscar"}
            </p>
          </div>

          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}

          <SocialLogin />

          <p className="text-center text-xs text-slate-500 dark:text-neutral-500 mt-6">
            {activeTab === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="text-menu-text dark:text-brand font-semibold hover:underline"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-menu-text dark:text-brand font-semibold hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify login page renders**

```bash
npm run dev
```

Open `http://localhost:3000/login` — should see split-screen with branding left, form right.

- [ ] **Step 3: Commit**

```bash
git add src/app/login/
git commit -m "feat: add login page with split-screen layout"
```

---

## Task 9: Build forgot-password and reset-password pages

**Files:**
- Create: `src/app/forgot-password/page.tsx`
- Create: `src/app/reset-password/page.tsx`

- [ ] **Step 1: Create `src/app/forgot-password/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("El correo es obligatorio");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` }
    );

    setLoading(false);
    if (resetError) {
      setError("Algo salió mal. Intenta de nuevo.");
      return;
    }
    setSuccess(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf7] dark:bg-[#0A0A0A] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Logo size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold">
            Recuperar contraseña
          </h1>
          <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
            Te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
              Te enviamos un email con instrucciones. Revisa tu bandeja de entrada.
            </div>
            <Link
              href="/login"
              className="text-sm text-brand hover:text-brand-hover font-medium"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" loading={loading} className="w-full">
              Enviar enlace
            </Button>
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-neutral-100"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/reset-password/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!password) errors.password = "La contraseña es obligatoria";
    else if (password.length < 8) errors.password = "Mínimo 8 caracteres";
    if (!confirmPassword)
      errors.confirmPassword = "Confirma tu contraseña";
    else if (password !== confirmPassword)
      errors.confirmPassword = "Las contraseñas no coinciden";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);
    if (updateError) {
      setError("No se pudo actualizar la contraseña. Intenta de nuevo.");
      return;
    }

    router.push("/login?message=password-updated");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf7] dark:bg-[#0A0A0A] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Logo size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold">
            Nueva contraseña
          </h1>
          <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
            Ingresa tu nueva contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nueva contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            disabled={loading}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={fieldErrors.confirmPassword}
            disabled={loading}
          />
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <Button type="submit" loading={loading} className="w-full">
            Actualizar contraseña
          </Button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/forgot-password/ src/app/reset-password/
git commit -m "feat: add forgot-password and reset-password pages"
```

---

## Task 10: Build OAuth callback route

**Files:**
- Create: `src/app/auth/callback/route.ts`

- [ ] **Step 1: Create `src/app/auth/callback/route.ts`**

```ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/auth/
git commit -m "feat: add OAuth callback route handler"
```

---

## Task 11: Build email verification banner and dashboard placeholder

**Files:**
- Create: `src/components/email-verify-banner.tsx`
- Create: `src/app/dashboard/page.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/email-verify-banner.tsx`**

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function EmailVerifyBanner() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function resendVerification() {
    setSending(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });
    }
    setSending(false);
    setSent(true);
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <p className="text-amber-800 dark:text-amber-300">
          Verifica tu correo electrónico para acceder a todas las funciones.
        </p>
        {sent ? (
          <span className="text-xs text-amber-600 dark:text-amber-400">
            Email reenviado
          </span>
        ) : (
          <button
            onClick={resendVerification}
            disabled={sending}
            className="text-xs font-semibold text-amber-900 dark:text-amber-200 hover:underline disabled:opacity-50"
          >
            {sending ? "Enviando..." : "Reenviar email"}
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/dashboard/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { EmailVerifyBanner } from "@/components/email-verify-banner";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const showVerifyBanner = user && !user.email_confirmed_at;

  return (
    <div>
      {showVerifyBanner && <EmailVerifyBanner />}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-500 mt-2">
          Bienvenido a Marcable, {user?.email}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update root page to redirect to login**

Replace the content of `src/app/page.tsx`:

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/email-verify-banner.tsx src/app/dashboard/ src/app/page.tsx
git commit -m "feat: add email verify banner, dashboard placeholder, root redirect"
```

---

## Task 12: Database migration — auto-provisioning trigger + freemium seed

**Files:**
- Create: `supabase/migrations/001_auth_provisioning.sql`

- [ ] **Step 1: Create `supabase/migrations/001_auth_provisioning.sql`**

```sql
-- =============================================================================
-- Auth Auto-Provisioning
-- Creates user_profiles + freemium subscription on new signup
-- =============================================================================

-- 1. Seed freemium plan (idempotent)
INSERT INTO subscription_plans (code, name, description, search_limit, is_active, sort_order)
VALUES ('free', 'Gratuito', 'Plan gratuito con búsquedas limitadas', 5, true, 0)
ON CONFLICT (code) DO NOTHING;

-- 2. Auto-provisioning function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_id bigint;
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (auth_user_id, email)
  VALUES (NEW.id, NEW.email);

  -- Assign freemium subscription
  SELECT id INTO free_plan_id
  FROM public.subscription_plans
  WHERE code = 'free' AND is_active = true
  LIMIT 1;

  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (
      user_profile_id,
      plan_id,
      status,
      started_at,
      amount,
      currency
    )
    VALUES (
      (SELECT id FROM public.user_profiles WHERE auth_user_id = NEW.id),
      free_plan_id,
      'active',
      now(),
      0,
      'USD'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Additional RLS policies for user_profiles
CREATE POLICY "users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "users can insert own profile"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());
```

- [ ] **Step 2: Commit**

```bash
git add supabase/
git commit -m "feat: add auth auto-provisioning trigger and freemium plan seed"
```

---

## Task 13: Login page toast for password reset success

**Files:**
- Modify: `src/app/login/page.tsx`

- [ ] **Step 1: Add toast for `?message=password-updated` query param**

Add to login page, after the `useState` declarations:

```tsx
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Inside the component, add:
function LoginPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const message = searchParams.get("message");

  // In the JSX, before AuthTabs:
  {message === "password-updated" && (
    <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
      Contraseña actualizada. Inicia sesión con tu nueva contraseña.
    </div>
  )}
}
```

Full updated file `src/app/login/page.tsx`:

```tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BrandingPanel, BrandingHeader } from "@/components/auth/branding-panel";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { SocialLogin } from "@/components/auth/social-login";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <BrandingHeader />
      <BrandingPanel />

      <div className="flex-1 flex items-center justify-center bg-[#fafaf7] dark:bg-[#0A0A0A] px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-neutral-100">
              {activeTab === "login" ? "Bienvenido" : "Crea tu cuenta"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-neutral-500 mt-1">
              {activeTab === "login"
                ? "Ingresa a tu cuenta para continuar"
                : "Regístrate gratis y empieza a buscar"}
            </p>
          </div>

          {message === "password-updated" && (
            <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
              Contraseña actualizada. Inicia sesión con tu nueva contraseña.
            </div>
          )}

          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}

          <SocialLogin />

          <p className="text-center text-xs text-slate-500 dark:text-neutral-500 mt-6">
            {activeTab === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="text-menu-text dark:text-brand font-semibold hover:underline"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-menu-text dark:text-brand font-semibold hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/login/page.tsx
git commit -m "feat: add password-updated toast on login page"
```

---

## Task 14: Manual verification and cleanup

- [ ] **Step 1: Set real Supabase credentials in `.env.local`**

Update `.env.local` with actual project URL and anon key from Supabase dashboard.

- [ ] **Step 2: Apply migration to Supabase**

Apply `supabase/migrations/001_auth_provisioning.sql` via Supabase SQL editor or CLI.

- [ ] **Step 3: Enable Google OAuth in Supabase**

In Supabase dashboard → Authentication → Providers → Google: enable and set client ID + secret.

- [ ] **Step 4: Verify all flows**

```
1. Open http://localhost:3000 → redirects to /login
2. Login page shows split-screen (desktop) or stacked (mobile)
3. Register with email → redirected to /dashboard → verify banner shown
4. Logout → login with same email → works
5. Wrong password → "Contraseña incorrecta" shown
6. Google OAuth → redirects, comes back, lands on dashboard
7. Forgot password → email sent → reset works → toast on login
8. Visit /dashboard without session → redirected to /login
9. Visit /login with session → redirected to /dashboard
10. Dark mode: check login page styles
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: finalize login auth implementation"
```
