import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getMySellerApplication } from "@/actions/auth/action-become-seller";
import { SettingsClientWrapper } from "@/components/account/SettingsClientWrapper";

export const metadata = { title: "Settings - User Profile & Account Management" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const application = await getMySellerApplication();

  return (
    <SettingsClientWrapper
      user={user}
      profile={profile}
      application={application}
    />
  );
}
