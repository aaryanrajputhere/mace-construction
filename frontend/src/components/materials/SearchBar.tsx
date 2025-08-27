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
  Info,
  HelpCircle,
  Lightbulb,
  Star,
} from "lucide-react";

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({
  content,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-20 px-3 py-2 text-xs font-medium text-white bg-gray-800 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap max-w-xs">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

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
  const [showQuickTips, setShowQuickTips] = useState(true);

  const sortOptions = [
    { value: "", label: "Default (Best Match)" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "newest", label: "Newest First" },
  ];

  const availabilityOptions = [
    { value: "", label: "All Items" },
    { value: "available", label: "✅ In Stock", icon: CheckCircle },
    { value: "low-stock", label: "⚠️ Low Stock", icon: Package },
    { value: "out-of-stock", label: "❌ Out of Stock", icon: XCircle },
  ];

  const priceRanges = [
    { value: "", label: "Any Price Range" },
    { value: "0-50", label: "Under $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-500", label: "$100 - $500" },
    { value: "500+", label: "$500+" },
  ];

  const searchSuggestions = [
    "concrete mixer",
    "steel rebar",
    "safety helmet",
    "power drill",
    "plywood sheets",
  ];

  const hasActiveFilters = sortBy || filterBy || priceRange;
  const activeFiltersCount = [sortBy, filterBy, priceRange].filter(
    Boolean
  ).length;

  const handleSearch = () => {
    if (searchValue.trim()) {
      console.log("Searching for:", searchValue);
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

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      {/* Quick Tips Banner */}
      {showQuickTips && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">
                Quick Tip:
              </span>
              <span className="text-sm text-blue-700">
                Try searching for "concrete", "tools", or "safety equipment" to
                get started
              </span>
            </div>
            <button
              onClick={() => setShowQuickTips(false)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="Close tip"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Search Row */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for materials, tools, or equipment..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Search Button */}
          {searchValue && (
            <button
              onClick={handleSearch}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Search
            </button>
          )}

          {/* Filter Toggle */}
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className={`px-4 py-3 rounded-lg text-sm font-medium border ${
              filtersExpanded || hasActiveFilters
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-gray-50 text-gray-700 border-gray-300"
            }`}
          >
            <Filter className="h-4 w-4 inline mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                {activeFiltersCount}
              </span>
            )}
            {filtersExpanded ? (
              <ChevronUp className="h-4 w-4 inline ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 inline ml-1" />
            )}
          </button>
        </div>
      </div>
      {/* Expandable Filters Section */}
      {filtersExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-5">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sort By */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <label
                    className="block text-sm font-bold text-gray-900"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    Sort By
                  </label>
                  <Tooltip content="Choose how to order your search results. Best Match uses relevance scoring and popularity.">
                    <Info className="h-4 w-4 text-gray-600" />
                  </Tooltip>
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm transition-all duration-200 outline-none hover:border-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 appearance-none cursor-pointer font-semibold text-gray-900"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <label
                    className="block text-sm font-bold text-gray-900"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    Availability
                  </label>
                  <Tooltip content="Filter by stock status. In Stock items are ready to ship immediately, Low Stock may have limited quantities available.">
                    <Info className="h-4 w-4 text-gray-600" />
                  </Tooltip>
                </div>
                <div className="relative">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm transition-all duration-200 outline-none hover:border-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 appearance-none cursor-pointer font-semibold text-gray-900"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    {availabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <label
                    className="block text-sm font-bold text-gray-900"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    Price Range
                  </label>
                  <Tooltip content="Filter by price ranges to find materials within your budget. All prices are per unit and exclude shipping.">
                    <Info className="h-4 w-4 text-gray-600" />
                  </Tooltip>
                </div>
                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm transition-all duration-200 outline-none hover:border-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 appearance-none cursor-pointer font-semibold text-gray-900"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    {priceRanges.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h4
                      className="text-base font-bold text-gray-900"
                      style={{
                        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                      }}
                    >
                      Active Filters ({activeFiltersCount})
                    </h4>
                    <Tooltip content="These filters are currently applied to your search results. Click the X on any filter to remove it individually, or use Clear All to reset.">
                      <HelpCircle className="h-4 w-4 text-gray-600" />
                    </Tooltip>
                  </div>

                  {/* Clear All Button */}
                  <Tooltip content="Remove all active filters and reset to default view">
                    <button
                      onClick={clearAllFilters}
                      disabled={isClearing}
                      className={`
                        inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold 
                        transition-all duration-200 outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                        ${
                          isClearing
                            ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                            : "bg-red-100 text-red-900 hover:bg-red-200 hover:text-red-900 active:bg-red-300 shadow-md hover:shadow-lg"
                        }
                      `}
                      style={{
                        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                      }}
                      aria-label={`Clear all ${activeFiltersCount} active filters`}
                    >
                      {isClearing ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                          Clearing...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Clear All Filters
                        </>
                      )}
                    </button>
                  </Tooltip>
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap gap-3">
                  {sortBy && (
                    <div className="inline-flex items-center pl-4 pr-2 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-900 group shadow-md">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span className="mr-2">
                        {sortOptions.find((opt) => opt.value === sortBy)?.label}
                      </span>
                      <Tooltip content="Remove sort filter">
                        <button
                          onClick={() => clearIndividualFilter("sort")}
                          className="ml-1 p-1 rounded-full hover:bg-blue-200 transition-colors duration-150 outline-none focus:ring-1 focus:ring-blue-500"
                          aria-label="Clear sort filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </div>
                  )}

                  {filterBy && (
                    <div className="inline-flex items-center pl-4 pr-2 py-2 rounded-full text-sm font-bold bg-green-100 text-green-900 group shadow-md">
                      <Package className="h-4 w-4 mr-2" />
                      <span className="mr-2">
                        {
                          availabilityOptions.find(
                            (opt) => opt.value === filterBy
                          )?.label
                        }
                      </span>
                      <Tooltip content="Remove availability filter">
                        <button
                          onClick={() => clearIndividualFilter("availability")}
                          className="ml-1 p-1 rounded-full hover:bg-green-200 transition-colors duration-150 outline-none focus:ring-1 focus:ring-green-500"
                          aria-label="Clear availability filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </div>
                  )}

                  {priceRange && (
                    <div className="inline-flex items-center pl-4 pr-2 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-900 group shadow-md">
                      <span className="mr-3">
                        {
                          priceRanges.find((opt) => opt.value === priceRange)
                            ?.label
                        }
                      </span>
                      <Tooltip content="Remove price range filter">
                        <button
                          onClick={() => clearIndividualFilter("price")}
                          className="ml-1 p-1 rounded-full hover:bg-purple-200 transition-colors duration-150 outline-none focus:ring-1 focus:ring-purple-500"
                          aria-label="Clear price range filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Filters State with Helpful Guidance */}
            {!hasActiveFilters && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <SlidersHorizontal className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                  <h3
                    className="text-base font-bold text-gray-900 mb-2"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    No filters applied yet
                  </h3>
                  <p
                    className="text-sm text-gray-700 mb-3"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    Use the dropdowns above to narrow down your search results
                    and find exactly what you need.
                  </p>
                  <div className="flex justify-center space-x-4 text-xs text-gray-600">
                    <span>💡 Sort by price</span>
                    <span>📦 Filter by stock</span>
                    <span>💰 Set price range</span>
                  </div>
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
