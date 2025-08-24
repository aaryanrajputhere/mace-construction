// Header.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 bg-white border border-black shadow-lg rounded-2xl px-6 py-3 flex justify-center z-50 max-w-4xl w-[90%]">
      {/* Nav */}
      <nav className="flex items-center space-x-6 relative">
        <Link
          to="/materials"
          className="text-black hover:text-gray-700 active:text-gray-500 font-medium transition"
        >
          Materials
        </Link>

        {/* Dropdown */}
        <div className="relative">
          <button
            className="flex items-center text-black hover:text-gray-700 active:text-gray-500 font-medium transition"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onMouseEnter={() => setIsDropdownOpen(true)} // desktop hover
            onMouseLeave={() => setIsDropdownOpen(false)} // desktop hover
          >
            Calculators <ChevronDown className="ml-1 w-4 h-4" />
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full w-48 bg-white border border-black rounded-xl shadow-lg py-2 z-20">
              <Link
                to="/calculators/studs"
                className="block px-4 py-2 text-black hover:bg-gray-100 active:text-gray-500 transition"
                onClick={() => setIsDropdownOpen(false)}
              >
                Stud Calculator
              </Link>
              <Link
                to="/calculators/osb"
                className="block px-4 py-2 text-black hover:bg-gray-100 active:text-gray-500 transition"
                onClick={() => setIsDropdownOpen(false)}
              >
                OSB Calculator
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/quote"
          className="text-black hover:text-gray-700 active:text-gray-500 font-medium transition"
        >
          Get a Quote
        </Link>
      </nav>
    </header>
  );
};

export default Header;
