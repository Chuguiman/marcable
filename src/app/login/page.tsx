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
