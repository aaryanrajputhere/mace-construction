import React, { useState, useEffect } from "react";

interface QuoteItem {
  id: number;
  description: string;
  quantity: number;
  unit: string;
}

const QuoteBuilder: React.FC = () => {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  // Load items from localStorage (from calculators/catalog)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quote") || "[]");
    const mapped = stored.map((item: any, i: number) => ({
      id: i + 1,
      description: item.name || "Custom Item",
      quantity: item.quantity || item.studs || 0,
      unit: item.unit || (item.studs ? "pcs" : "lf"),
    }));
    setItems(mapped);

    // vendor list mock (you can fetch from API later)
    setVendors(["ABC Lumber", "XYZ Building Supply", "PQR Vendors"]);
  }, []);

  // Handle editing table
  const updateItem = (id: number, field: keyof QuoteItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Delete row (also remove from localStorage)
  const deleteItem = (id: number) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("quote", JSON.stringify(updated));
      return updated;
    });
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  // Handle vendor selection
  const toggleVendor = (vendor: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendor)
        ? prev.filter((v) => v !== vendor)
        : [...prev, vendor]
    );
  };

  // Submit RFQ
  const handleSubmit = () => {
    const rfqId = "RFQ-" + Date.now();

    const rfqData = {
      rfqId,
      projectName,
      siteAddress,
      neededBy,
      notes,
      items,
      vendors: selectedVendors,
      files: files.map((f) => f.name),
    };

    // Save log
    const logs = JSON.parse(localStorage.getItem("rfqLogs") || "[]");
    logs.push(rfqData);
    localStorage.setItem("rfqLogs", JSON.stringify(logs));

    // Stub email sending (replace with backend API)
    alert(`RFQ ${rfqId} submitted!\n\nVendors: ${selectedVendors.join(", ")}`);

    // Clear after submission
    setItems([]);
    setProjectName("");
    setSiteAddress("");
    setNeededBy("");
    setNotes("");
    setFiles([]);
    setSelectedVendors([]);
    localStorage.removeItem("quote");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-xl space-y-6 border border-gray-300">
      <h1 className="text-2xl font-bold">Quote Builder</h1>

      {/* Editable Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">
                  <input
                    className="w-full border rounded p-1"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-20 border rounded p-1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", +e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <input
                    className="w-20 border rounded p-1"
                    value={item.unit}
                    onChange={(e) =>
                      updateItem(item.id, "unit", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          Project Name
          <input
            className="border p-2 rounded"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          Site Address
          <input
            className="border p-2 rounded"
            value={siteAddress}
            onChange={(e) => setSiteAddress(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          Needed By
          <input
            type="date"
            className="border p-2 rounded"
            value={neededBy}
            onChange={(e) => setNeededBy(e.target.value)}
          />
        </label>
        <label className="flex flex-col col-span-2">
          Notes
          <textarea
            className="border p-2 rounded"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
      </div>

      {/* File Upload */}
      <div>
        <label className="flex flex-col">
          Upload Blueprints/Docs
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="border p-2 rounded"
          />
        </label>
        {files.length > 0 && (
          <ul className="list-disc ml-5 mt-2">
            {files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Vendor Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select Vendors</h2>
        <div className="flex gap-4 flex-wrap">
          {vendors.map((vendor) => (
            <label key={vendor} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor)}
                onChange={() => toggleVendor(vendor)}
              />
              <span>{vendor}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
      >
        Submit RFQ
      </button>
    </div>
  );
};

export default QuoteBuilder;
