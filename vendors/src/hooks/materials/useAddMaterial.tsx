import { api } from "../../lib/axios";
import type { Material } from "../../types/material";

export function useAddMaterial() {
  const addMaterial = async (material: Material) => {
    const res = await api.post("/materials", material);
    return res.data;
  };

  return { addMaterial };
}
