// src/components/materials/MaterialsGrid.tsx
import React from "react";
import MaterialCard from "./MaterialCard";
import { useMaterials } from "../../hooks/useMaterials";
import type { Material } from "../../types/materials";

const MaterialsGrid: React.FC = () => {
  const { materials, loading, error } = useMaterials();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!materials.length) return <div>No materials found.</div>;

  return (
    <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
        role="feed"
        aria-label="Materials grid"
        style={{
          fontSize: "clamp(16px, 1.6vw, 18px)",
        }}
      >
        {materials.map((mat: Material, idx: number) => (
          <MaterialCard
            key={idx}
            material={mat}
          />
        ))}
      </div>
    </div>
  );
};

export default MaterialsGrid;
