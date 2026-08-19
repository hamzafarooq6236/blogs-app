"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { randomUUID } from "crypto";

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImageAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const session = await auth();
    const userId = session?.user?.id || "public-uploads";

    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File)) {
      return { success: false, error: "No image file provided." };
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed." };
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File size exceeds 5MB limit." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop() || "jpg";
    const uniqueFilename = `${userId}/${Date.now()}-${randomUUID()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME as string)
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      let userFriendlyError = error.message;

      if (error.message.toLowerCase().includes("bucket not found") || (error as any).statusCode === "404") {
        userFriendlyError = `Bucket '${BUCKET_NAME}' was not found in Supabase. Please create a public bucket named '${BUCKET_NAME}' in your Supabase Dashboard under Storage.`;
      } else if (error.message.toLowerCase().includes("row-level security") || error.message.toLowerCase().includes("policy")) {
        userFriendlyError = `Supabase Storage RLS policy error. Please ensure the '${BUCKET_NAME}' bucket is set to Public, or configure an INSERT policy for storage.objects.`;
      }

      return { success: false, error: userFriendlyError };
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME as string)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (error: any) {
    console.error("Error in uploadImageAction:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while uploading.",
    };
  }
}
