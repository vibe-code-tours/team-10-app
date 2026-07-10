import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, {
      message: "ဖိုင်အရွယ်အစား 1 MB ထက်မပိုရပါ",
    })
    .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.type), {
      message: "JPEG, PNG, WebP ဖိုင်အမျိုးအစားများသာ တင်ခွင့်ပြုပါသည်",
    }),
});

export type UploadInput = z.infer<typeof uploadSchema>;
