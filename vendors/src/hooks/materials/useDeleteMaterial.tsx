import { api } from "../../lib/axios";

export function useDeleteMaterial() {
  const deleteMaterial = async (id: string) => {
    await api.delete(`/materials/${id}`);
  };

  return { deleteMaterial };
}
