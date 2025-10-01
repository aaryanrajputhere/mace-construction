import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  TrendingUp,
  RotateCcw,
  Filter,
  ChevronUp,
  Info,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface SearchFilterBarProps {
  onFiltersChange: (filters: {
    searchTerm: string;
    sortBy: string;
    availability: string;
    priceRange: string;
  }) => void;
}

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

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  onFiltersChange,
}) => {
  // Search state
  const [searchValue, setSearchValue] = useState("");

  // Filter state
  const [sortBy, setSortBy] = useState("");
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

  const priceRanges = [
    { value: "", label: "Any Price Range" },
    { value: "0-50", label: "Under $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-500", label: "$100 - $500" },
    { value: "500+", label: "$500+" },
  ];

  const hasActiveFilters = sortBy || priceRange;
  const activeFiltersCount = [sortBy, priceRange].filter(Boolean).length;

  // Call onFiltersChange whenever any filter changes
  useEffect(() => {
    onFiltersChange({
      searchTerm: searchValue,
      sortBy,
      availability: "",
      priceRange,
    });
  }, [searchValue, sortBy, priceRange, onFiltersChange]);

  const handleSearch = () => {
    // Search is handled automatically by useEffect
    console.log("Searching for:", searchValue);
  };

  const clearAllFilters = () => {
    setIsClearing(true);
    setTimeout(() => {
      setSortBy("");
      setPriceRange("");
      setIsClearing(false);
    }, 150);
  };

  type FilterType = "sort" | "price";

  const clearIndividualFilter = (filterType: FilterType): void => {
    switch (filterType) {
      case "sort":
        setSortBy("");
        break;
      case "price":
        setPriceRange("");
        break;
    }
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 w-full max-w-md mx-auto sm:max-w-lg lg:max-w-6xl">
      {/* Quick Tips Banner */}
      {showQuickTips && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm sm:text-base font-bold text-blue-900 block mb-1">
                  Quick Tip:
                </span>
                <span className="text-sm text-blue-800">
                  Try searching for "concrete", "tools", or "safety equipment"
                  to get started
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowQuickTips(false)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 flex-shrink-0"
              aria-label="Close tip"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Search Row */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 bg-gray-100 rounded-lg">
              <Search className="h-4 w-4 text-gray-600" />
            </div>
            <label htmlFor="material-search" className="sr-only">
              Search materials, tools, or equipment
            </label>
            <input
              id="material-search"
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for materials, tools, or equipment..."
              className="w-full pl-14 pr-12 py-3 sm:py-4 min-h-[44px] border-2 border-gray-300 rounded-xl text-base font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all duration-200 hover:border-gray-400 shadow-sm focus:shadow-md"
              aria-label="Search materials"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Search Button */}
          {searchValue && (
            <button
              onClick={handleSearch}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm sm:text-base font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              Search
            </button>
          )}

          {/* Filter Toggle */}
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className={`px-5 py-4 rounded-xl text-sm sm:text-base font-bold border-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap ${
              filtersExpanded || hasActiveFilters
                ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full font-bold shadow-sm">
                {activeFiltersCount}
              </span>
            )}
            {filtersExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Filters Section */}
      {filtersExpanded && (
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="p-6 sm:p-8">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Sort By */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label
                    className="block text-sm sm:text-base font-bold text-gray-900"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    Sort By
                  </label>
                  <Tooltip content="Choose how to order your search results. Best Match uses relevance scoring and popularity.">
                    <div className="p-1 bg-gray-200 rounded-full">
                      <Info className="h-4 w-4 text-gray-600" />
                    </div>
                  </Tooltip>
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-4 pr-12 py-4 bg-white border-2 border-gray-300 rounded-xl text-sm sm:text-base transition-all duration-200 outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 appearance-none cursor-pointer font-semibold text-gray-900 shadow-sm focus:shadow-md"
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
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none p-1 bg-gray-100 rounded-lg">
                    <ChevronDown className="h-5 w-5 text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label
                    className="block text-sm sm:text-base font-bold text-gray-900"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    Price Range
                  </label>
                  <Tooltip content="Filter by price ranges to find materials within your budget. All prices are per unit and exclude shipping.">
                    <div className="p-1 bg-gray-200 rounded-full">
                      <Info className="h-4 w-4 text-gray-600" />
                    </div>
                  </Tooltip>
                </div>
                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full pl-4 pr-12 py-4 bg-white border-2 border-gray-300 rounded-xl text-sm sm:text-base transition-all duration-200 outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 appearance-none cursor-pointer font-semibold text-gray-900 shadow-sm focus:shadow-md"
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
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none p-1 bg-gray-100 rounded-lg">
                    <ChevronDown className="h-5 w-5 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-8 pt-8 border-t border-gray-300">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                  <div className="flex items-center space-x-2">
                    <h4
                      className="text-base sm:text-lg font-bold text-gray-900"
                      style={{
                        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                      }}
                    >
                      Active Filters ({activeFiltersCount})
                    </h4>
                    <Tooltip content="These filters are currently applied to your search results. Click the X on any filter to remove it individually, or use Clear All to reset.">
                      <div className="p-1 bg-gray-200 rounded-full">
                        <HelpCircle className="h-4 w-4 text-gray-600" />
                      </div>
                    </Tooltip>
                  </div>

                  {/* Clear All Button */}
                  <Tooltip content="Remove all active filters and reset to default view">
                    <button
                      onClick={clearAllFilters}
                      disabled={isClearing}
                      className={`
                    inline-flex items-center px-5 py-3 rounded-xl text-sm sm:text-base font-bold 
                    transition-all duration-200 outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]
                    ${
                      isClearing
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-100 to-red-200 text-red-900 hover:from-red-200 hover:to-red-300"
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
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {sortBy && (
                    <div className="inline-flex items-center pl-4 pr-2 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 group shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span className="mr-2">
                        {sortOptions.find((opt) => opt.value === sortBy)?.label}
                      </span>
                      <Tooltip content="Remove sort filter">
                        <button
                          onClick={() => clearIndividualFilter("sort")}
                          className="ml-1 p-1.5 rounded-full hover:bg-blue-300 transition-colors duration-150 outline-none focus:ring-1 focus:ring-blue-500"
                          aria-label="Clear sort filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </div>
                  )}

                  {priceRange && (
                    <div className="inline-flex items-center pl-4 pr-2 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-900 group shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                      <span className="mr-3">
                        {
                          priceRanges.find((opt) => opt.value === priceRange)
                            ?.label
                        }
                      </span>
                      <Tooltip content="Remove price range filter">
                        <button
                          onClick={() => clearIndividualFilter("price")}
                          className="ml-1 p-1.5 rounded-full hover:bg-purple-300 transition-colors duration-150 outline-none focus:ring-1 focus:ring-purple-500"
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
              <div className="mt-8 pt-8 border-t border-gray-300">
                <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-gray-300 shadow-sm">
                  <div className="p-3 bg-gray-100 rounded-2xl w-fit mx-auto mb-4">
                    <SlidersHorizontal className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3
                    className="text-base sm:text-lg font-bold text-gray-900 mb-3"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    No filters applied yet
                  </h3>
                  <p
                    className="text-sm sm:text-base text-gray-700 mb-6 max-w-md mx-auto"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    Use the dropdowns above to narrow down your search results
                    and find exactly what you need.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      <span>Sort by price</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📦</span>
                      <span>Filter by stock</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      <span>Set price range</span>
                    </div>
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
