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
