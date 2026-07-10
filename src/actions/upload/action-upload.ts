"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadSchema } from "@/lib/validations";

export type UploadResult = {
  error?: string;
  url?: string;
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

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { url: publicUrl };
}

export async function uploadPaymentProof(
  formData: FormData,
  orderId: string,
): Promise<UploadResult> {
  const result = await uploadFile(formData, "payment-proofs", "proofs");

  if (result.error || !result.url) {
    return result;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "LOGIN_REQUIRED" };
  }

  const { error: insertError } = await supabase.from("payment_proofs").insert({
    order_id: orderId,
    file_url: result.url,
    uploaded_by: user.id,
  });

  if (insertError) {
    return { error: "ငွေလွှဲပြေစာသိမ်းဆည်း၍မရပါ" };
  }

  await supabase
    .from("orders")
    .update({ payment_status: "uploaded" })
    .eq("id", orderId)
    .eq("buyer_id", user.id);

  return { url: result.url };
}
