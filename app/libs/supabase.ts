import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFile({ file, path }: { file: File; path: string }) {
  try {
    const { data, error } = await supabase.storage
      .from("basil_pos")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (data) {
      const { data: img } = await supabase.storage
        .from("basil_pos")
        .getPublicUrl(data.path);

      return {
        path: data.path,
        publicUrl: img.publicUrl,
      };
    } else {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
}


export async function uploadMultipleFiles({
  files,
  path,
}: {
  files: File[];
  path: string;
}) {
  try {
    // Create an array of upload promises for each file
    const uploadPromises = files.map(async (file) => {
      const filePath = `${path}/${Date.now()}-${file.name}`;

      // Upload the file
      const { data, error } = await supabase.storage
        .from("basil_pos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw new Error(error.message);
      }

      // Get the public URL of the uploaded file
      const { data: img } = await supabase.storage
        .from("basil_pos")
        .getPublicUrl(data.path);

      return {
        path: data.path,
        publicUrl: img?.publicUrl,
      };
    });

    // Wait for all uploads to finish and return the results
    const uploadedFiles = await Promise.all(uploadPromises);

    return uploadedFiles; // Returns an array of uploaded file details with public URLs
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading files");
  }
}


export async function deleteImageFromStorage(url: string): Promise<void> {
  const { error } = await supabase.storage.from("basil_pos").remove([url]);

  if (error) {
    throw new Error("Failed to delete image from storage");
  }
}
