import { useState } from "react";
import { postUploadPhoto } from "../endpoints/photos/upload_POST.schema";
import { postDeletePhoto } from "../endpoints/photos/delete_POST.schema";

export function usePhotoUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      // 1. Get presigned URL and final CDN URL
      const { presignedUrl, url } = await postUploadPhoto({
        filename: file.name,
        contentType: file.type as "image/jpeg" | "image/png" | "image/webp",
        sizeBytes: file.size,
      });

      // 2. Upload file directly to storage using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload the photo to storage");
      }

      // 3. Return the final permanent URL
      return url;
    } finally {
      setIsUploading(false);
    }
  };

  const deletePhoto = async (url: string): Promise<void> => {
    await postDeletePhoto({ url });
  };

  return {
    uploadPhoto,
    deletePhoto,
    isUploading,
  };
}