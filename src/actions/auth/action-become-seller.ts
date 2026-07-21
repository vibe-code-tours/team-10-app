"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const ApplicationSchema = z.object({
  shop_name: z.string().min(2, "Shop name required"),
  owner_name: z.string().min(2, "Owner name required"),
  phone: z.string().min(6, "Phone required"),
  nrc: z.string().min(4, "NRC required"),
  business_license: z.string().min(2, "Business license required"),
  address: z.string().min(5, "Address required"),
});

export type ApplicationState = {
  error?: string;
  success?: boolean;
};

export async function submitSellerApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const parsed = ApplicationSchema.safeParse({
    shop_name: formData.get("shop_name"),
    owner_name: formData.get("owner_name"),
    phone: formData.get("phone"),
    nrc: formData.get("nrc"),
    business_license: formData.get("business_license"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let nrcDocumentUrl: string | null = null;
  let licenseDocumentUrl: string | null = null;
  const adminSupabase = createAdminClient();

  // Upload NRC Document File if attached
  const nrcFile = formData.get("nrc_document") as File | null;
  if (nrcFile && nrcFile.size > 0 && nrcFile.name !== "undefined") {
    try {
      const ext = nrcFile.name.split(".").pop() || "png";
      const filePath = `nrc_${user.id}_${Date.now()}.${ext}`;
      const buffer = Buffer.from(await nrcFile.arrayBuffer());

      const { error: uploadErr } = await adminSupabase.storage
        .from("seller-documents")
        .upload(filePath, buffer, {
          contentType: nrcFile.type || "image/png",
          upsert: true,
        });

      if (!uploadErr) {
        const { data: publicUrlData } = adminSupabase.storage
          .from("seller-documents")
          .getPublicUrl(filePath);
        nrcDocumentUrl = publicUrlData.publicUrl;
      } else {
        console.warn("NRC document upload notice:", uploadErr.message);
      }
    } catch (e) {
      console.warn("Error uploading NRC document:", e);
    }
  }

  // Upload License Document File if attached
  const licenseFile = formData.get("license_document") as File | null;
  if (licenseFile && licenseFile.size > 0 && licenseFile.name !== "undefined") {
    try {
      const ext = licenseFile.name.split(".").pop() || "png";
      const filePath = `license_${user.id}_${Date.now()}.${ext}`;
      const buffer = Buffer.from(await licenseFile.arrayBuffer());

      const { error: uploadErr } = await adminSupabase.storage
        .from("seller-documents")
        .upload(filePath, buffer, {
          contentType: licenseFile.type || "image/png",
          upsert: true,
        });

      if (!uploadErr) {
        const { data: publicUrlData } = adminSupabase.storage
          .from("seller-documents")
          .getPublicUrl(filePath);
        licenseDocumentUrl = publicUrlData.publicUrl;
      } else {
        console.warn("License document upload notice:", uploadErr.message);
      }
    } catch (e) {
      console.warn("Error uploading License document:", e);
    }
  }

  const payload: Record<string, any> = {
    user_id: user.id,
    ...parsed.data,
    status: "pending",
  };

  if (nrcDocumentUrl) payload.nrc_document_url = nrcDocumentUrl;
  if (licenseDocumentUrl) payload.license_document_url = licenseDocumentUrl;

  const { error } = await adminSupabase
    .from("seller_applications")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    console.error("submitSellerApplication:", error);
    return { error: "Failed to submit application. Please try again." };
  }

  return { success: true };
}

export async function getMySellerApplication() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("seller_applications")
    .select("status, rejection_reason, shop_name, created_at, nrc_document_url, license_document_url")
    .eq("user_id", user.id)
    .single();

  return data;
}
