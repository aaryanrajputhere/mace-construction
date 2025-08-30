// src/pages/Materials.tsx
import React, { useState } from "react";
import Sidebar from "../components/materials/Sidebar";
import SearchBar from "../components/materials/SearchBar";
import MaterialsGrid from "../components/materials/MaterialsGrid";

const Materials: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

        <MaterialsGrid />
      </div>
    </div>
  );
};

export default Materials;
