import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmailVerifyBanner } from "@/components/email-verify-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const showVerifyBanner = !user.email_confirmed_at;

  return (
    <DashboardShell email={user.email ?? ""}>
      {showVerifyBanner && <EmailVerifyBanner />}
      {children}
    </DashboardShell>
  );
}
