import React, { useState } from "react";

const OSBCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [waste, setWaste] = useState<number>(10);

  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const area = length * width;
    const sheetArea = 32; // 4x8
    const sheets = Math.ceil((area / sheetArea) * (1 + waste / 100));
    setResult(sheets);
  };

  const addToQuote = () => {
    if (!result) return;
    const quoteItems = JSON.parse(localStorage.getItem("quote") || "[]");
    quoteItems.push({
      name: "OSB Sheets",
      quantity: result,
    });
    localStorage.setItem("quote", JSON.stringify(quoteItems));
    alert("OSB calculation added to quote!");
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded-xl space-y-4 border border-gray-300">
      <h2 className="text-xl font-bold">OSB Calculator</h2>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          Length (ft)
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(+e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          Width (ft)
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          Waste (%)
          <input
            type="number"
            value={waste}
            onChange={(e) => setWaste(+e.target.value)}
            className="border p-2 rounded"
          />
        </label>
      </div>

      <button
        onClick={calculate}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Calculate
      </button>

      {result && (
        <div className="bg-gray-50 p-4 rounded border">
          <p>
            <strong>OSB Sheets Needed:</strong> {result}
          </p>
          <button
            onClick={addToQuote}
            className="mt-2 bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition"
          >
            Add to Quote
          </button>
        </div>
      )}
    </div>
  );
};

export default OSBCalculator;
