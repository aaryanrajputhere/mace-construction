// src/pages/Materials.tsx
import React from "react";
import Sidebar from "../components/materials/Sidebar";
import SearchBar from "../components/materials/SearchBar";
import Filters from "../components/materials/Filters";
import MaterialsGrid from "../components/materials/MaterialsGrid";

const Materials: React.FC = () => {
  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-64">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 space-y-4">
        <SearchBar />
        <Filters />
        <MaterialsGrid />
      </div>
    </div>
  );
};

export default Materials;
