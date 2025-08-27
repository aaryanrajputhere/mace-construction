import React, { useState } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  TrendingUp,
  Package,
  CheckCircle,
  XCircle,
  RotateCcw,
  Filter,
  ChevronUp,
} from "lucide-react";

const SearchFilterBar = () => {
  // Search state
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Filter state
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [isClearing, setIsClearing] = useState(false);

  // UI state
  const [filtersExpanded, setFiltersExpanded] = useState(false);

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
  const activeFiltersCount = [sortBy, filterBy, priceRange].filter(
    Boolean
  ).length;

  const handleSearch = () => {
    if (searchValue.trim()) {
      // Add your search logic here
      console.log("Searching for:", searchValue);
      // You can emit an event, call an API, or update state here
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const clearAllFilters = () => {
    setIsClearing(true);
    setTimeout(() => {
      setSortBy("");
      setFilterBy("");
      setPriceRange("");
      setIsClearing(false);
    }, 150);
  };

  type FilterType = "sort" | "availability" | "price";

  const clearIndividualFilter = (filterType: FilterType): void => {
    switch (filterType) {
      case "sort":
        setSortBy("");
        break;
      case "availability":
        setFilterBy("");
        break;
      case "price":
        setPriceRange("");
        break;
    }
  };

  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      {/* Main Search Row */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Search Input - Takes most of the width */}
          <div
            className={`flex-1 relative flex items-center transition-all duration-200 ${
              isFocused
                ? "ring-2 ring-blue-500 ring-opacity-20"
                : "hover:shadow-sm"
            }`}
          >
            <div className="absolute left-3 flex items-center pointer-events-none">
              <Search
                className={`h-4 w-4 transition-colors duration-200 ${
                  isFocused ? "text-blue-500" : "text-gray-400"
                }`}
              />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              placeholder="Search for materials, tools, or equipment..."
              className={`w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm transition-all duration-200 outline-none ${
                isFocused
                  ? "bg-white border-blue-300 shadow-sm"
                  : "hover:bg-white hover:border-gray-300"
              }`}
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            />
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 group"
                aria-label="Clear search"
              >
                <X className="h-3 w-3 text-gray-600 group-hover:text-white" />
              </button>
            )}
          </div>

          {/* Search Button - Only shows when there's a search value */}
          {searchValue && (
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 outline-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 whitespace-nowrap"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
          )}

          {/* Filter Toggle Button */}
          <button
            onClick={toggleFilters}
            className={`
              inline-flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none
              focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 whitespace-nowrap
              ${
                filtersExpanded || hasActiveFilters
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }
            `}
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="mr-2">
              Filters
              {hasActiveFilters && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </span>
            {filtersExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Search Info Row */}
        {searchValue && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span
              className="text-gray-500"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Searching in all categories
            </span>
            <span
              className="font-medium text-blue-600"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Press Enter to search
            </span>
          </div>
        )}
      </div>

      {/* Expandable Filters Section */}
      {filtersExpanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-4">
            {/* Filter Controls */}
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
                    className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm transition-all duration-200 outline-none hover:border-gray-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 appearance-none cursor-pointer"
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
                    className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm transition-all duration-200 outline-none hover:border-gray-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 appearance-none cursor-pointer"
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
                    className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm transition-all duration-200 outline-none hover:border-gray-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 appearance-none cursor-pointer"
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
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <h4
                    className="text-sm font-medium text-gray-700"
                    style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                  >
                    Active Filters ({activeFiltersCount})
                  </h4>

                  {/* Clear All Button */}
                  <button
                    onClick={clearAllFilters}
                    disabled={isClearing}
                    className={`
                      inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium 
                      transition-all duration-200 outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                      ${
                        isClearing
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 active:bg-red-200"
                      }
                    `}
                    style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                    aria-label={`Clear all ${activeFiltersCount} active filters`}
                  >
                    {isClearing ? (
                      <>
                        <RotateCcw className="h-3 w-3 mr-1.5 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-3 w-3 mr-1.5" />
                        Clear All
                      </>
                    )}
                  </button>
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap gap-2">
                  {sortBy && (
                    <div className="inline-flex items-center pl-3 pr-1 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 group">
                      <TrendingUp className="h-3 w-3 mr-1.5" />
                      <span className="mr-1">
                        {sortOptions.find((opt) => opt.value === sortBy)?.label}
                      </span>
                      <button
                        onClick={() => clearIndividualFilter("sort")}
                        className="ml-1 p-0.5 rounded-full hover:bg-blue-200 transition-colors duration-150 outline-none focus:ring-1 focus:ring-blue-400"
                        aria-label="Clear sort filter"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {filterBy && (
                    <div className="inline-flex items-center pl-3 pr-1 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 group">
                      <Package className="h-3 w-3 mr-1.5" />
                      <span className="mr-1">
                        {
                          availabilityOptions.find(
                            (opt) => opt.value === filterBy
                          )?.label
                        }
                      </span>
                      <button
                        onClick={() => clearIndividualFilter("availability")}
                        className="ml-1 p-0.5 rounded-full hover:bg-green-200 transition-colors duration-150 outline-none focus:ring-1 focus:ring-green-400"
                        aria-label="Clear availability filter"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {priceRange && (
                    <div className="inline-flex items-center pl-3 pr-1 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 group">
                      <span className="mr-2">
                        {
                          priceRanges.find((opt) => opt.value === priceRange)
                            ?.label
                        }
                      </span>
                      <button
                        onClick={() => clearIndividualFilter("price")}
                        className="ml-1 p-0.5 rounded-full hover:bg-purple-200 transition-colors duration-150 outline-none focus:ring-1 focus:ring-purple-400"
                        aria-label="Clear price range filter"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Filters State */}
            {!hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center py-2">
                  <SlidersHorizontal className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                  >
                    No filters applied. Use the dropdowns above to filter
                    results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
