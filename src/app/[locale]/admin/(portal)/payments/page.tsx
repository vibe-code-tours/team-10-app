import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { getPaymentAccounts } from "@/actions/admin/action-payment-accounts";
import { PaymentAccountsClient } from "@/components/admin/PaymentAccountsClient";

export const metadata = {
  title: "Payment Accounts Management - Admin Portal",
};

export default async function AdminPaymentAccountsPage() {
  await requireAdmin();
  const accounts = await getPaymentAccounts();

  return <PaymentAccountsClient initialAccounts={accounts} />;
}
