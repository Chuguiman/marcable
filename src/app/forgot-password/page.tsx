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
