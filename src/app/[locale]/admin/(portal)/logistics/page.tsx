import { getLogisticsPartners } from "@/actions/admin/action-logistics-partners";
import LogisticsPartnersClient from "@/components/admin/LogisticsPartnersClient";

export const metadata = {
  title: "Logistics Partners Management | Yoe Yar Zay Admin",
};

export default async function AdminLogisticsPage() {
  const partners = await getLogisticsPartners();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <LogisticsPartnersClient initialPartners={partners} />
    </div>
  );
}
