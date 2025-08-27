import React, { useState, useEffect } from "react";
import {
  Calculator,
  Plus,
  Info,
  Ruler,
  Package,
  DollarSign,
} from "lucide-react";

const OSBCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [waste, setWaste] = useState<number>(10);
  const [result, setResult] = useState<number | null>(null);
  const [totalArea, setTotalArea] = useState<number>(0);
  const [wasteArea, setWasteArea] = useState<number>(0);
  const [quoteItems, setQuoteItems] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (length > 0 && width > 0) {
      calculate();
    } else {
      setResult(null);
      setTotalArea(0);
      setWasteArea(0);
    }
  }, [length, width, waste]);

  const calculate = () => {
    if (length <= 0 || width <= 0) return;

    const area = length * width;
    const sheetArea = 32; // 4x8 feet = 32 sq ft
    const wasteAmount = area * (waste / 100);
    const totalAreaNeeded = area + wasteAmount;
    const sheets = Math.ceil(totalAreaNeeded / sheetArea);

    setTotalArea(area);
    setWasteArea(wasteAmount);
    setResult(sheets);
  };

  const addToQuote = () => {
    if (!result) return;

    const newItem = {
      id: Date.now(),
      name: "OSB Sheets (4'×8')",
      quantity: result,
      area: totalArea,
      waste: waste,
      addedAt: new Date().toLocaleString(),
    };

    const updatedQuote = [...quoteItems, newItem];
    setQuoteItems(updatedQuote);

    const button = document.querySelector("[data-quote-btn]") as HTMLElement;
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
    setLength(0);
    setWidth(0);
    setWaste(10);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <div
        className={`bg-white rounded-xl border p-6 transition-all duration-300 ${
          isHovered
            ? "shadow-xl -translate-y-1 border-blue-200"
            : "shadow-md border-gray-100 hover:shadow-lg hover:-translate-y-1"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div
              className={`p-2 rounded-lg transition-colors ${
                isHovered
                  ? "bg-gradient-to-br from-[#00598F] to-[#033159]"
                  : "bg-gradient-to-br from-[#033159] to-[#00598F]"
              }`}
            >
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              OSB Sheet Calculator
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            {isHovered
              ? "Release mouse to reset inputs"
              : "Calculate OSB sheets needed for your project"}
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Ruler className="h-4 w-4 text-gray-400 mr-2" />
                Length (ft)
              </label>
              <input
                type="number"
                value={length || ""}
                onChange={(e) => setLength(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Ruler className="h-4 w-4 text-gray-400 mr-2" />
                Width (ft)
              </label>
              <input
                type="number"
                value={width || ""}
                onChange={(e) => setWidth(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-800">
              <Info className="h-4 w-4 text-gray-500 mr-2" />
              Waste Factor (%)
              <div className="relative group inline-block">
                <Info className="h-3.5 w-3.5 text-gray-400 ml-1.5 cursor-help" />
                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-2 bg-gray-900 text-xs text-white rounded-lg shadow-lg">
                  Accounts for cutting waste and extra materials. 10% is
                  standard, increase for complex layouts.
                  <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </label>
            <input
              type="number"
              value={waste}
              onChange={(e) => setWaste(Number(e.target.value) || 0)}
              min="0"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200"
            />
            <p className="text-xs text-gray-500">
              Recommended: 10-15% for cuts and waste
            </p>
          </div>
        </div>

        {/* Results */}
        {result !== null && totalArea > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Calculation Results
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Project Area:</span>
                <span className="font-medium text-gray-800">
                  {totalArea.toFixed(1)} sq ft
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Waste ({waste}%):</span>
                <span className="font-medium text-gray-800">
                  {wasteArea.toFixed(1)} sq ft
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Area Needed:</span>
                <span className="font-medium text-gray-800">
                  {(totalArea + wasteArea).toFixed(1)} sq ft
                </span>
              </div>

              <hr className="border-gray-300 my-2" />

              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  OSB Sheets Required:
                </span>
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-[#033159]" />
                  <span className="text-lg font-bold text-[#033159]">
                    {result}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 bg-blue-100 rounded-lg">
              <p className="text-xs text-blue-800">
                <Info className="h-3 w-3 inline mr-1" />
                Based on standard 4'×8' (32 sq ft) OSB sheets
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {result && (
            <button
              onClick={addToQuote}
              data-quote-btn
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

        {/* Sheet Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Standard OSB Sheet: 4' × 8' (32 sq ft)</span>
            <DollarSign className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OSBCalculator;
