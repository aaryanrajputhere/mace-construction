import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import type { Material } from "../../types/material";

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const res = await api.get("/materials");
        console.log("API Response:", res.data);

        // Handle different response structures
        const materialsData = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.materials || [];

        console.log("Processed materials:", materialsData);
        setMaterials(materialsData);
      } catch (err) {
        console.error("Error fetching materials", err);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMaterials();
  }, []);

  return { materials, loading, setMaterials };
}
