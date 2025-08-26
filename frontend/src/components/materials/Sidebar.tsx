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
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-gray-100"
        style={{ backgroundColor: "#033159" }}
      >
        <div className="flex items-center space-x-3">
          <Filter className="h-4 w-4 text-white" />
          <h2
            className="font-bold text-base text-white"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            Categories
          </h2>
        </div>
      </div>

      {/* Categories List */}
      <div className="p-2">
        <ul className="space-y-0.5">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;
            const isHovered = hoveredCategory === category.name;

            return (
              <li key={category.name}>
                <button
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    isActive
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setActiveCategory(isActive ? null : category.name)
                  }
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`h-3.5 w-3.5 transition-colors duration-200 ${
                        isActive
                          ? "text-blue-600"
                          : isHovered
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors duration-200 ${
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

                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                      style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                    >
                      {category.count}
                    </span>
                    <ChevronRight
                      className={`h-3 w-3 transition-all duration-200 ${
                        isActive
                          ? "rotate-90 text-blue-600"
                          : isHovered
                          ? "text-gray-600 translate-x-0.5"
                          : "text-gray-300"
                      }`}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer Stats */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span
            className="text-gray-600 font-medium"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            Total Items
          </span>
          <span
            className="font-bold"
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
  );
};

export default Sidebar;
