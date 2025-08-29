import React, { useState } from "react";
import {
  Building2,
  Hammer,
  Home,
  Shield,
  Wrench,
  Zap,
  Paintbrush,
  HardHat,
  ChevronRight,
  Filter,
} from "lucide-react";

const categories = [
  { name: "Lumber & Panels", icon: Building2, count: 45 },
  { name: "Concrete & Masonry", icon: Building2, count: 28 },
  { name: "Roofing", icon: Home, count: 15 },
  { name: "Insulation", icon: Shield, count: 12 },
  { name: "Drywall & Finishes", icon: Paintbrush, count: 22 },
  { name: "Fasteners & Adhesives", icon: Wrench, count: 38 },
  { name: "Plumbing", icon: Wrench, count: 29 },
  { name: "Electrical", icon: Zap, count: 41 },
  { name: "Doors & Windows", icon: Home, count: 16 },
  { name: "Paint & Coatings", icon: Paintbrush, count: 33 },
  { name: "Equipment", icon: Hammer, count: 27 },
  { name: "Hand Tools", icon: Hammer, count: 19 },
  { name: "Power Tools", icon: Hammer, count: 25 },
  { name: "Safety Gear", icon: HardHat, count: 14 },
];

const Sidebar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
            const isActive = activeCategory === category.name;
            const isHovered = hoveredCategory === category.name;

            return (
              <li key={category.name}>
                <button
                  className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 ease-out flex items-center justify-between group shadow-sm hover:shadow-md ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 shadow-md transform scale-[1.02]"
                      : "hover:bg-gray-50 hover:transform hover:scale-[1.01] active:scale-[0.99]"
                  }`}
                  onClick={() =>
                    setActiveCategory(isActive ? null : category.name)
                  }
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
                      {category.count}
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
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
