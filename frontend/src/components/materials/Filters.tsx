import React, { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  TrendingUp,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Filters: React.FC = () => {
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "newest", label: "Newest First" },
  ];

  const availabilityOptions = [
    { value: "", label: "All Items" },
    { value: "available", label: "In Stock", icon: CheckCircle },
    { value: "low-stock", label: "Low Stock", icon: Package },
    { value: "out-of-stock", label: "Out of Stock", icon: XCircle },
  ];

  const priceRanges = [
    { value: "", label: "Any Price" },
    { value: "0-50", label: "Under $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-500", label: "$100 - $500" },
    { value: "500+", label: "$500+" },
  ];

  const hasActiveFilters = sortBy || filterBy || priceRange;

  const clearAllFilters = () => {
    setSortBy("");
    setFilterBy("");
    setPriceRange("");
  };

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      {/* Filter Controls */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sort By */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Sort By
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm transition-all duration-200 outline-none hover:bg-white hover:border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 appearance-none cursor-pointer"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Availability
            </label>
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm transition-all duration-200 outline-none hover:bg-white hover:border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 appearance-none cursor-pointer"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
              >
                {availabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Price Range
            </label>
            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm transition-all duration-200 outline-none hover:bg-white hover:border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 appearance-none cursor-pointer"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
              >
                {priceRanges.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {sortBy && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {sortOptions.find((opt) => opt.value === sortBy)?.label}
                </span>
              )}
              {filterBy && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Package className="h-3 w-3 mr-1" />
                  {
                    availabilityOptions.find((opt) => opt.value === filterBy)
                      ?.label
                  }
                </span>
              )}
              {priceRange && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  ${priceRanges.find((opt) => opt.value === priceRange)?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span
            className="text-gray-600 font-medium"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            Active Filters
          </span>
          <span
            className="font-bold"
            style={{
              color: "#033159",
              fontFamily: "Helvetica Neue, sans-serif",
            }}
          >
            {hasActiveFilters ? "Applied" : "None"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
