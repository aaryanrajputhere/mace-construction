import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      {/* Search Input */}
      <div className="p-4">
        <div
          className={`relative flex items-center transition-all duration-200 ${
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
              onClick={handleClear}
              className="absolute right-3 flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 group"
            >
              <X className="h-3 w-3 text-gray-600 group-hover:text-white" />
            </button>
          )}
        </div>

        {/* Search Stats/Info */}
        {searchValue && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span
              className="text-gray-500"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Searching in all categories
            </span>
            <span
              className="font-medium"
              style={{
                color: "#033159",
                fontFamily: "Helvetica Neue, sans-serif",
              }}
            >
              Press Enter to search
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
