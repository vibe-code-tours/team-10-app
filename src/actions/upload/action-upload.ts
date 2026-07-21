"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadSchema } from "@/lib/validations";

export type UploadResult = {
  error?: string;
  url?: string;
  path?: string;
};

export async function uploadFile(
  formData: FormData,
  bucket: "payment-proofs" | "avatars" | "product-images",
  folder?: string,
): Promise<UploadResult> {
  const file = formData.get("file") as File | null;

  if (!file) {
    return { error: "ဖိုင်ရွေးချယ်ပါ" };
  }

  const parsed = uploadSchema.safeParse({ file });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "LOGIN_REQUIRED" };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const timestamp = Date.now();
  const fileName = `${folder ? folder + "/" : ""}${user.id}/${timestamp}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { error: "ဖိုင်တင်၍မရပါ" };
  }

  if (bucket === "payment-proofs") {
    return { url: data.path, path: data.path };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { url: publicUrl, path: data.path };
}

export async function uploadPaymentProof(
  formData: FormData,
  orderId: string,
): Promise<UploadResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "LOGIN_REQUIRED" };
  }

  // Verify ownership before creating a storage object.
  const { data: order, error: orderLookupError } = await supabase
    .from("orders")
    .select("id")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderLookupError || !order) {
    return { error: "ငွေလွှဲပြေစာသိမ်းဆည်း၍မရပါ" };
  }

  const result = await uploadFile(formData, "payment-proofs", "proofs");
  if (result.error || !result.url || !result.path) {
    return result;
  }

  const { data: proof, error: insertError } = await supabase
    .from("payment_proofs")
    .insert({
      order_id: orderId,
      file_url: result.url,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (insertError || !proof) {
    const { error: cleanupError } = await supabase.storage
      .from("payment-proofs")
      .remove([result.path]);
    if (cleanupError) {
      console.error("Payment proof cleanup error:", cleanupError);
    }
    return { error: "ငွေလွှဲပြေစာသိမ်းဆည်း၍မရပါ" };
  }

  const { error: orderUpdateError } = await supabase
    .from("orders")
    .update({ payment_status: "uploaded" })
    .eq("id", orderId)
    .eq("user_id", user.id);

  if (orderUpdateError) {
    const [proofCleanup, fileCleanup] = await Promise.all([
      supabase.from("payment_proofs").delete().eq("id", proof.id),
      supabase.storage.from("payment-proofs").remove([result.path]),
    ]);
    if (proofCleanup.error || fileCleanup.error) {
      console.error("Payment proof rollback error:", {
        proof: proofCleanup.error,
        file: fileCleanup.error,
      });
    }
    return { error: "ငွေလွှဲပြေစာသိမ်းဆည်း၍မရပါ" };
  }

  return { url: result.url, path: result.path };
}
