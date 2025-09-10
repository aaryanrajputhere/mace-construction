import { useEffect, useState } from "react";
import type { Material } from "../types/materials";

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/materials`
        );
        const data = await res.json();
        if (data.success) {
          setMaterials(data.data);
        } else {
          setError(data.message || "Failed to fetch materials");
        }
      } catch (err: any) {
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  return { materials, loading, error };
}
