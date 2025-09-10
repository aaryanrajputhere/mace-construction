import { useState, useEffect } from "react";
import type { Material } from "../types/materials";

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/materials`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug log

        // Handle different response formats
        let materialsArray: any[] = [];

        if (Array.isArray(data)) {
          materialsArray = data;
        } else if (data && Array.isArray(data.materials)) {
          materialsArray = data.materials;
        } else if (data && Array.isArray(data.data)) {
          materialsArray = data.data;
        } else {
          console.error("Unexpected API response format:", data);
          throw new Error("API response is not in expected format");
        }

        // Assign sequential IDs from 1 to n
        const materialsWithIds = materialsArray.map(
          (material: any, index: number) => ({
            ...material,
            id: index + 1, // Sequential IDs starting from 1
          })
        );

        setMaterials(materialsWithIds);
      } catch (err) {
        console.error("Error fetching materials:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setMaterials([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return { materials, loading, error };
};
