import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

type DropdownType = "Calculators" | null;

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (dropdown: DropdownType) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null); // close dropdowns when menu toggles
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 font-['Helvetica Neue']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center">
              <img
                src="/logos/logo.svg"
                alt="MACE Logo"
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-8"
            ref={dropdownRef}
          >
            {/* Materias */}
            <a
              href="/materials"
              className="text-sm font-medium text-gray-700 hover:text-[#00598F] transition"
            >
              Materials
            </a>
            <div className="relative">
              <button
                onClick={() => toggleDropdown("Calculators")}
                aria-expanded={activeDropdown === "Calculators"}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-[#00598F] transition"
              >
                Calculators <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === "Calculators" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <a
                    href="/calculators/studs"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#033159]"
                  >
                    Studs{" "}
                  </a>
                  <a
                    href="/calculators/osb"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#033159]"
                  >
                    OSB
                  </a>
                </div>
              )}
            </div>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }}
              className="text-sm font-medium text-gray-700 hover:text-[#00598F] transition"
            >
              Contact Us
            </a>
          </nav>

          {/* CTA + Mobile Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/quote")}
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition"
              style={{ backgroundColor: "#033159" }}
            >
              Get Quote
            </button>
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#00598F] hover:bg-gray-50 transition"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/materials"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#00598F] hover:bg-gray-50 rounded-md"
              >
                Materials
              </a>
              <a
                href="/calculators/osb"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#00598F] hover:bg-gray-50 rounded-md"
              >
                OSB Calculator
              </a>
              <a
                href="/calculators/studs"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#00598F] hover:bg-gray-50 rounded-md"
              >
                Studs Calculator
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false); // Close mobile menu after clicking
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#00598F] hover:bg-gray-50 rounded-md"
              >
                Contact Us
              </a>
              <div className="pt-4 pb-2">
                <button
                  onClick={() => navigate("/quote")}
                  className="w-full flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition"
                  style={{ backgroundColor: "#033159" }}
                >
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
