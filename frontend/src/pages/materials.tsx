import React, { useState, useCallback } from "react";
import type { Material } from "../types/materials";
import { useMaterials } from "../hooks/useMaterials";
import type { FilterOptions } from "../hooks/useMaterials";
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

  if (materials.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600 font-medium mb-2">No materials found</p>
          <p className="text-gray-500 text-sm">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600 font-medium">
          Showing {materials.length} material{materials.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {materials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
    </div>
  );
};

const MaterialsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    category: "",
    sortBy: "",
    availability: "",
    priceRange: "",
  });

  const { materials, loading, error } = useMaterials(filters);

  // Calculate category counts from all materials (not filtered)
  const { materials: allMaterials } = useMaterials({
    searchTerm: "",
    category: "",
    sortBy: "",
    availability: "",
    priceRange: "",
  });

  const calculateCategoryCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {};
    allMaterials.forEach((material) => {
      if (material.Category) {
        counts[material.Category] = (counts[material.Category] || 0) + 1;
      }
    });
    return counts;
  };

  const categoryCounts = calculateCategoryCounts();
  const totalCount = allMaterials.length;

  const handleFiltersChange = useCallback(
    (newFilters: Omit<FilterOptions, "category">) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const handleCategoryChange = useCallback((category: string | null) => {
    setFilters((prev) => ({ ...prev, category: category || "" }));
  }, []);

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
          <Sidebar
            onCategoryChange={handleCategoryChange}
            activeCategory={filters.category || null}
            categoryCounts={categoryCounts}
            totalCount={totalCount}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-4">
        <SearchBar onFiltersChange={handleFiltersChange} />
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
