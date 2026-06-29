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
