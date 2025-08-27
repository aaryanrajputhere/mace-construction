import React, { useState, useEffect } from "react";
import {
  Hammer,
  Plus,
  Info,
  Ruler,
  Package,
  DollarSign,
  Home,
  Square,
} from "lucide-react";

const StudCalculator: React.FC = () => {
  const [wallLength, setWallLength] = useState<number>(0);
  const [wallHeight, setWallHeight] = useState<number>(0);
  const [studSpacing, setStudSpacing] = useState<number>(16); // default 16"
  const [openingWidth, setOpeningWidth] = useState<number>(0);
  const [waste, setWaste] = useState<number>(10);
  const [result, setResult] = useState<{
    studs: number;
    plates: number;
    totalLinearFeet: number;
    studLength: number;
  } | null>(null);
  const [quoteItems, setQuoteItems] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Auto-calculate when inputs change
    if (wallLength > 0 && wallHeight > 0) {
      calculate();
    } else {
      setResult(null);
    }
  }, [wallLength, wallHeight, studSpacing, openingWidth, waste]);

  const calculate = () => {
    if (wallLength <= 0 || wallHeight <= 0) return;

    const spacingFt = studSpacing / 12; // convert inches to feet

    // Calculate studs along length (including end studs)
    let studs = Math.floor(wallLength / spacingFt) + 1;

    // Add studs for openings (king studs, jack studs, etc.)
    if (openingWidth > 0) {
      studs += Math.ceil(openingWidth / spacingFt) * 2; // approximate framing studs for openings
    }

    // Apply waste factor
    studs = Math.ceil(studs * (1 + waste / 100));

    // Calculate plates (top + bottom plates, linear feet)
    const plates = Math.ceil(2 * wallLength * (1 + waste / 100));

    // Determine stud length based on wall height
    let studLength = 8; // default 8ft studs
    if (wallHeight > 8) {
      studLength = Math.ceil(wallHeight);
    }

    // Total linear feet of lumber
    const totalLinearFeet = studs * studLength + plates;

    setResult({
      studs,
      plates,
      totalLinearFeet,
      studLength,
    });
  };

  const addToQuote = () => {
    if (!result) return;

    const newItem = {
      id: Date.now(),
      name: "Wall Framing Package",
      studs: result.studs,
      studLength: result.studLength,
      plates: result.plates,
      wallLength: wallLength,
      wallHeight: wallHeight,
      spacing: studSpacing,
      waste: waste,
      addedAt: new Date().toLocaleString(),
    };

    const updatedQuote = [...quoteItems, newItem];
    setQuoteItems(updatedQuote);

    // Show success feedback
    const button = document.querySelector(
      "[data-stud-quote-btn]"
    ) as HTMLElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = "Added to Quote!";
      button.className = button.className.replace(
        "bg-[#033159] hover:bg-[#022244]",
        "bg-green-600 hover:bg-green-700"
      );
      setTimeout(() => {
        button.textContent = originalText;
        button.className = button.className.replace(
          "bg-green-600 hover:bg-green-700",
          "bg-[#033159] hover:bg-[#022244]"
        );
      }, 2000);
    }
  };

  const clearInputs = () => {
    setWallLength(0);
    setWallHeight(0);
    setStudSpacing(16);
    setOpeningWidth(0);
    setWaste(10);
  };

  const getStudSpacingLabel = (spacing: number) => {
    switch (spacing) {
      case 12:
        return '12" O.C. (Heavy Load)';
      case 16:
        return '16" O.C. (Standard)';
      case 24:
        return '24" O.C. (Light Load)';
      default:
        return `${spacing}" O.C.`;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <div
        className={`bg-white shadow-md rounded-xl border border-gray-100 p-6 transition-all duration-300 ${
          isHovered ? "shadow-lg -translate-y-1" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-[#033159] to-[#00598F] rounded-lg">
              <Hammer className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Stud Calculator</h2>
          </div>
          <p className="text-sm text-gray-600">
            Calculate wall framing materials needed
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Ruler className="h-4 w-4 text-gray-400 mr-2" />
                Wall Length (ft)
              </label>
              <input
                type="number"
                value={wallLength || ""}
                onChange={(e) => setWallLength(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Home className="h-4 w-4 text-gray-400 mr-2" />
                Wall Height (ft)
              </label>
              <input
                type="number"
                value={wallHeight || ""}
                onChange={(e) => setWallHeight(Number(e.target.value) || 0)}
                placeholder="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Package className="h-4 w-4 text-gray-400 mr-2" />
              Stud Spacing
            </label>
            <div className="flex space-x-2">
              {[12, 16, 24].map((spacing) => (
                <button
                  key={spacing}
                  onClick={() => setStudSpacing(spacing)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    studSpacing === spacing
                      ? "bg-[#033159] text-white border-[#033159]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {spacing}"
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {getStudSpacingLabel(studSpacing)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Square className="h-4 w-4 text-gray-400 mr-2" />
                Opening Width (ft)
              </label>
              <input
                type="number"
                value={openingWidth || ""}
                onChange={(e) => setOpeningWidth(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500">Doors, windows, etc.</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Info className="h-4 w-4 text-gray-400 mr-2" />
                Waste Factor (%)
              </label>
              <input
                type="number"
                value={waste}
                onChange={(e) => setWaste(Number(e.target.value) || 0)}
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {result !== null && wallLength > 0 && wallHeight > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Material Requirements
            </h3>

            <div className="space-y-3">
              {/* Studs */}
              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">
                    Studs Required:
                  </span>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-[#033159]" />
                    <span className="text-lg font-bold text-[#033159]">
                      {result.studs}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Length: {result.studLength}ft each</span>
                  <span className="mx-2">•</span>
                  <span>Spacing: {studSpacing}" O.C.</span>
                </div>
              </div>

              {/* Plates */}
              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">
                    Top/Bottom Plates:
                  </span>
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4 text-[#033159]" />
                    <span className="text-lg font-bold text-[#033159]">
                      {result.plates} LF
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Linear feet of plate material needed
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#033159] text-white p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Linear Feet:</span>
                  <span className="text-lg font-bold">
                    {result.totalLinearFeet} LF
                  </span>
                </div>
                <div className="text-sm text-blue-200 mt-1">
                  Total lumber needed for framing
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 bg-blue-100 rounded-lg">
              <p className="text-xs text-blue-800">
                <Info className="h-3 w-3 inline mr-1" />
                Calculations include waste factor and standard framing practices
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {result && (
            <button
              onClick={addToQuote}
              data-stud-quote-btn
              className="flex-1 px-4 py-3 text-sm font-semibold text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2 bg-[#033159] hover:bg-[#022244]"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Quote</span>
            </button>
          )}

          <button
            onClick={clearInputs}
            className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            Clear
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Standard 2x4 or 2x6 framing lumber</span>
            <DollarSign className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudCalculator;
