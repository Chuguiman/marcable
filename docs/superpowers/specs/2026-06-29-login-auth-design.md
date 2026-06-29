# Login & Authentication — Design Spec

**Date:** 2026-06-29
**Status:** Draft
**Scope:** Login, registration, password recovery, auth middleware, auto-provisioning

---

## 1. Overview

First screen users see. Split-screen layout (approach C) with persuasive branding on the left and auth form on the right. Supabase Auth handles all authentication. On first login, a DB trigger auto-creates user profile and assigns freemium plan.

### Auth Providers (v1)
- Email + password
- Google OAuth

### Future Providers (roadmap)
- Microsoft, Facebook, X (Twitter), Notion

---

## 2. Architecture & Stack

- **Framework:** Next.js (App Router)
- **Auth:** Supabase Auth (`@supabase/ssr` for server-side session management)
- **Database:** Supabase PostgreSQL (schema v5)
- **Styling:** Tailwind CSS (matching wireframe design system)

### Routes

| Route | Access | Purpose |
|---|---|---|
| `/login` | Public | Login + Registration (tabbed) |
| `/forgot-password` | Public | Request password reset email |
| `/reset-password` | Public | Set new password (from email link) |
| `/auth/callback` | Public | OAuth + email verification callback |
| `/dashboard` | Protected | Post-login landing |

### Data Flow

```
User → Supabase Auth (email/Google) → JWT session cookie
  → Next.js middleware verifies session → allows access
  → On first signup: DB trigger creates user_profiles row + freemium subscription
```

---

## 3. Login Screen — Layout

### Split Screen (Desktop)

- **Left panel (55%):** Dark branding — `#0D302D` background
  - Logo (Marcable icon + wordmark)
  - Headline: "Protege tu marca antes de que alguien ms lo haga."
  - Subtitle: "Busqueda fonetica inteligente en +1M marcas registradas en Colombia."
  - Stats row: `1M+` Marcas | `12` Algoritmos | `98%` Precision
  - Decorative abstract shapes (circles with subtle green `#69EA9B` borders/glows)

- **Right panel (45%):** Light form — `#fafaf7` background
  - Tab toggle: Login / Registro
  - **Login tab:** email, password, "Olvidaste tu contrasena?" link, "Iniciar sesion" button
  - **Register tab:** email, password, confirm password, "Crear cuenta" button
  - Divider "o"
  - Google OAuth button
  - Toggle link to opposite tab

### Responsive (Mobile)
- Left panel collapses to compact header: logo + short headline
- Form takes full width below

### Dark Mode
- Right panel: `#0A0A0A`
- Inputs: `neutral-950` background
- Left panel stays dark (no change needed)

### Design System
- Brand color: `#69EA9B` (hover: `#54D987`)
- Dark text on brand: `#0D302D`
- Fonts: Jost (headings), Poppins (body)
- Glass-card style for elevated elements
- Border radius: `8px` inputs, `16px` card containers

---

## 4. Auth Flows

### 4.1 Login (Email/Password)

1. User enters email + password
2. Client-side validation (format, non-empty, min 8 chars)
3. `supabase.auth.signInWithPassword({ email, password })`
4. Success → redirect to `/dashboard`
5. Error → specific inline message:
   - Email not found → "No encontramos una cuenta con ese email"
   - Wrong password → "Contrasena incorrecta"
   - Rate limited → "Demasiados intentos. Espera unos minutos."

**Security note:** Specific error messages reveal email existence. Accepted trade-off for UX — Marcable is not a banking app.

### 4.2 Registration (Email/Password)

1. User enters email + password + confirm password
2. Client-side validation (format, min 8 chars, passwords match)
3. `supabase.auth.signUp({ email, password })`
4. Supabase sends verification email
5. User enters app immediately → redirect to `/dashboard`
6. Banner "Verifica tu email" shown on all pages until confirmed
7. DB trigger auto-creates `user_profiles` row + freemium `subscriptions` row

Errors:
- Email already registered → "Ya existe una cuenta con ese email. Quieres iniciar sesion?"

### 4.3 Google OAuth

1. Click "Continuar con Google"
2. `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/auth/callback' } })`
3. User authorizes on Google
4. Redirect to `/auth/callback`
5. Callback exchanges code for session
6. Redirect to `/dashboard`
7. If first login, DB trigger creates profile + freemium subscription

### 4.4 Forgot Password

1. Page `/forgot-password` — email field only
2. `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/reset-password' })`
3. Success → "Te enviamos un email con instrucciones"
4. User clicks link in email → lands on `/reset-password`
5. Form: new password + confirm
6. `supabase.auth.updateUser({ password })`
7. Success → redirect to `/login` with toast "Contrasena actualizada"

### 4.5 Email Verification

- Banner appears on all pages when `email_confirmed_at` is null
- "Reenviar email" button inside banner
- Auto-hides when user verifies (next page load checks)
- No hard block in v1 — soft reminder only

---

## 5. Middleware (Route Protection)

Next.js middleware at `middleware.ts`:

- **Public routes:** `/login`, `/forgot-password`, `/reset-password`, `/auth/callback`
- **All other routes:** require valid Supabase session
  - No session → redirect to `/login`
  - Active session on `/login` → redirect to `/dashboard`
- Uses `@supabase/ssr` `createServerClient` to verify session from cookies
- Refreshes expired tokens automatically

---

## 6. Database Changes

Schema v5 already provides `user_profiles`, `subscription_plans`, `subscriptions`. Minimal additions:

### 6.1 Freemium Plan Seed

```sql
INSERT INTO subscription_plans (code, name, description, search_limit, is_active, sort_order)
VALUES ('free', 'Gratuito', 'Plan gratuito con busquedas limitadas', 5, true, 0);
```

### 6.2 Auto-Provisioning Trigger

```sql
-- Trigger on auth.users INSERT:
-- 1. Create user_profiles row (auth_user_id, email from auth.users)
-- 2. Find freemium plan (code = 'free')
-- 3. Create subscriptions row (status = 'active', plan_id = free plan)
```

Runs with `service_role` — no RLS issues.

### 6.3 Additional RLS Policies

- `user_profiles` INSERT policy for the trigger (service_role bypass)
- `user_profiles` UPDATE policy for own profile (`auth_user_id = auth.uid()`)

---

## 7. Validation & Error Handling

### Client-Side Validation
- Email: valid format, non-empty
- Password: minimum 8 characters
- Confirm password (registration): must match
- Inline error messages below each field

### Loading States
- Submit button shows spinner during request
- All inputs disabled during request
- Google button shows loading state too

### Error Messages (from Supabase)

| Scenario | Message |
|---|---|
| Email not found | "No encontramos una cuenta con ese email" |
| Wrong password | "Contrasena incorrecta" |
| Email already registered | "Ya existe una cuenta con ese email. Quieres iniciar sesion?" |
| Rate limited | "Demasiados intentos. Espera unos minutos." |
| Generic error | "Algo salio mal. Intenta de nuevo." |

---

## 8. Testing Plan

- Login email/password — success and each error case
- Registration — new user, verify profile + subscription created
- Google OAuth — full flow
- Middleware — redirect to `/login` without session
- Middleware — redirect to `/dashboard` with active session
- Forgot/reset password — full flow
- Email verification banner — shows/hides correctly
- Responsive: mobile, tablet, desktop
- Dark mode on all screens
- Tab toggle between login/register
