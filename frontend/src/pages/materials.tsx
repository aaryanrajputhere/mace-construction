import React, { useState } from "react";
import type { Material } from "../types/materials";
import { useMaterials } from "../hooks/useMaterials";
import SearchBar from "../components/materials/SearchBar";
import Sidebar from "../components/materials/Sidebar";
import MaterialCard from "../components/materials/MaterialCard";

interface MaterialsGridProps {
  materials: Material[];
  loading: boolean;
  error: string | null;
}

const MaterialsGrid: React.FC<MaterialsGridProps> = ({
  materials,
  loading,
  error,
}) => {
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#033159] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading materials...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200">
          <p className="text-red-600 font-medium mb-2">
            Error loading materials
          </p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {materials.map((material) => (
      <MaterialCard key={material.id} material={material} />
      ))}
    </div>
  );
};

const MaterialsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { materials, loading, error } = useMaterials();

  return (
    <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 px-4 xl:px-8 lg:px-16">
      {/* Sidebar (Drawer on mobile) */}
      <div className="xl:w-64">
        {/* Mobile toggle button */}
        <button
          className="xl:hidden px-4 py-2 mb-2 rounded-lg bg-gray-200 text-gray-700 w-full shadow-sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Sidebar content */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } xl:block rounded-lg bg-white shadow-md xl:shadow-none`}
        >
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-4">
        <SearchBar />
        <MaterialsGrid
          materials={materials}
          loading={loading}
          error={error}
        />{" "}
      </div>
    </div>
  );
};

export default MaterialsPage;
