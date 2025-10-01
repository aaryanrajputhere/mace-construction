import React, { useState } from "react";
import {
  Building2,
  Home,
  Shield,
  Wrench,
  Paintbrush,
  ChevronRight,
  Filter,
} from "lucide-react";

const categories = [
  { name: "Lumber", icon: Building2 },
  { name: "Panels", icon: Building2 },
  { name: "Exterior", icon: Home },
  { name: "Treated Lumber", icon: Building2 },
  { name: "Insulation", icon: Shield },
  { name: "Fasteners", icon: Wrench },
  { name: "Concrete", icon: Building2 },
  { name: "Roofing", icon: Home },
  { name: "Drywall", icon: Paintbrush },
];

interface SidebarProps {
  onCategoryChange: (category: string | null) => void;
  activeCategory?: string | null;
  categoryCounts?: Record<string, number>;
  totalCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  onCategoryChange,
  activeCategory: propActiveCategory,
  categoryCounts = {},
  totalCount = 0,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    const newCategory =
      propActiveCategory === categoryName ? null : categoryName;
    onCategoryChange(newCategory);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden max-w-sm mx-auto sm:max-w-none">
      {/* Header */}
      <div
        className="px-6 py-4 border-b border-gray-200"
        style={{ backgroundColor: "#033159" }}
      >
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-white" />
          <h2
            className="font-bold text-lg text-white tracking-tight"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            Categories
          </h2>
        </div>
      </div>

      {/* Categories List */}
      <div className="p-3 sm:p-4">
        <ul className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = propActiveCategory === category.name;
            const isHovered = hoveredCategory === category.name;

            return (
              <li key={category.name}>
                <button
                  className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 ease-out flex items-center justify-between group shadow-sm hover:shadow-md ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 shadow-md transform scale-[1.02]"
                      : "hover:bg-gray-50 hover:transform hover:scale-[1.01] active:scale-[0.99]"
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-1.5 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-blue-600 shadow-sm"
                          : isHovered
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 transition-colors duration-300 ${
                          isActive
                            ? "text-white"
                            : isHovered
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
                        isActive
                          ? "text-blue-900"
                          : isHovered
                          ? "text-gray-900"
                          : "text-gray-700"
                      }`}
                      style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                    >
                      {category.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full transition-all duration-300 shadow-sm ${
                        isActive
                          ? "bg-white text-blue-700 shadow-md"
                          : isHovered
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                    >
                      {categoryCounts[category.name] || 0}
                    </span>
                    <div
                      className={`p-1 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-blue-600 shadow-sm"
                          : isHovered
                          ? "bg-blue-100"
                          : "bg-transparent"
                      }`}
                    >
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-all duration-300 ${
                          isActive
                            ? "rotate-90 text-white"
                            : isHovered
                            ? "text-blue-600 translate-x-0.5"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span
            className="text-sm sm:text-base text-gray-700 font-semibold"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            Total Items
          </span>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span
              className="font-bold text-lg sm:text-xl"
              style={{
                color: "#033159",
                fontFamily: "Helvetica Neue, sans-serif",
              }}
            >
              {totalCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
