import React, { useState } from "react";

const StudCalculator: React.FC = () => {
  const [wallLength, setWallLength] = useState<number>(0);
  const [wallHeight, setWallHeight] = useState<number>(0);
  const [studSpacing, setStudSpacing] = useState<number>(16); // default 16"
  const [openingWidth, setOpeningWidth] = useState<number>(0);
  const [waste, setWaste] = useState<number>(10);

  const [result, setResult] = useState<{
    studs: number;
    plates: number;
  } | null>(null);

  const calculate = () => {
    const spacingFt = studSpacing / 12; // convert inches to feet

    // studs along length
    let studs = Math.ceil(wallLength / spacingFt) + 1;

    // studs for openings
    studs += Math.ceil(openingWidth / spacingFt);

    // waste factor
    studs = Math.ceil(studs * (1 + waste / 100));

    // plates (top + bottom, linear feet)
    const plates = Math.ceil(2 * wallLength * (1 + waste / 100));

    setResult({ studs, plates });
  };

  const addToQuote = () => {
    if (!result) return;
    const quoteItems = JSON.parse(localStorage.getItem("quote") || "[]");
    quoteItems.push({
      name: "Wall Studs + Plates",
      studs: result.studs,
      plates: result.plates,
    });
    localStorage.setItem("quote", JSON.stringify(quoteItems));
    alert("Stud calculation added to quote!");
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded-xl space-y-4 border border-gray-300">
      <h2 className="text-xl font-bold">Stud Calculator</h2>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          Wall Length (ft)
          <input
            type="number"
            value={wallLength}
            onChange={(e) => setWallLength(+e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          Wall Height (ft)
          <input
            type="number"
            value={wallHeight}
            onChange={(e) => setWallHeight(+e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          Stud Spacing (in)
          <input
            type="number"
            value={studSpacing}
            onChange={(e) => setStudSpacing(+e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          Opening Width (ft)
          <input
            type="number"
            value={openingWidth}
            onChange={(e) => setOpeningWidth(+e.target.value)}
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

      {/* Black Calculate button */}
      <button
        onClick={calculate}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Calculate
      </button>

      {result && (
        <div className="bg-gray-50 p-4 rounded border">
          <p>
            <strong>Studs Needed:</strong> {result.studs}
          </p>
          <p>
            <strong>Plates (linear ft):</strong> {result.plates}
          </p>

          {/* Black Add to Quote button */}
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

export default StudCalculator;
