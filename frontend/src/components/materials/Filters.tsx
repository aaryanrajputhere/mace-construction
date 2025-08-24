// src/components/materials/Filters.tsx
import React from "react";

const Filters: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-xl border border-gray-300 p-3 flex gap-4">
      <select className="border p-2 rounded-lg focus:ring-emerald-500">
        <option>Sort by</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>

      <select className="border p-2 rounded-lg focus:ring-emerald-500">
        <option>Filter</option>
        <option>Available</option>
        <option>Out of Stock</option>
      </select>
    </div>
  );
};

export default Filters;
