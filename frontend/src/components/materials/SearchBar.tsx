// src/components/materials/SearchBar.tsx
import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-xl border border-gray-300 p-3">
      <input
        type="text"
        placeholder="Search materials..."
        className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
};

export default SearchBar;
