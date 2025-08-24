// src/components/materials/Sidebar.tsx
import React from "react";

const categories = ["Studs", "OSB", "Drywall", "Housewrap", "PT Wood"];

const Sidebar: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-xl p-4 border border-gray-300">
      <h2 className="font-semibold text-lg mb-3">Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat}
            className="cursor-pointer hover:text-emerald-600 transition-colors"
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
