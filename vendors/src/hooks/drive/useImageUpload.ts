import { useState } from "react";
import { api } from "../../lib/axios";

export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);

  const uploadImage = async (
    file: File,
    materialId?: number,
    materialName?: string
  ) => {
    const formData = new FormData();
    formData.append("image", file);

    if (materialId) {
      formData.append("materialId", materialId.toString());
    }

    if (materialName) {
      formData.append("materialName", materialName);
    }

    try {
      setLoading(true);
      const res = await api.post("/drive/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.imageUrl; // backend returns { imageUrl: "..." }
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading };
};
