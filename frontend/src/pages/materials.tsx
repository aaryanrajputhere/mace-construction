// src/pages/Materials.tsx
import React, { useState } from "react";
import Sidebar from "../components/materials/Sidebar";
import SearchBar from "../components/materials/SearchBar";
import MaterialsGrid from "../components/materials/MaterialsGrid";

const Materials: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-4 px-30 md:gap-6">
      {/* Sidebar (Drawer on mobile) */}
      <div className="md:w-64">
        {/* Mobile toggle button */}
        <button
          className="md:hidden px-4 py-2 mb-2 rounded-lg bg-gray-200 text-gray-700 w-full"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Sidebar content */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block  rounded-lg  bg-white`}
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
