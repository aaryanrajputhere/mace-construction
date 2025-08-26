// src/components/QuoteDrawer.tsx
import React from "react";

interface QuoteItem {
  id: number;
  name: string;
  price: string;
  unit: string;
  vendor: string;
  quantity: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onQuantityChange: (id: number, qty: number) => void;
}

const QuoteDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onQuantityChange,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Quote</h2>
        <button className="text-gray-500 hover:text-black" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Items */}
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
        {items.length === 0 ? (
          <p className="text-gray-500">No items added yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-3 flex flex-col space-y-2"
            >
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">Unit: {item.unit}</p>
              <p className="text-sm text-gray-600">Vendor: {item.vendor}</p>
              <p className="font-semibold">Price: {item.price}</p>

              {/* Quantity Control */}
              <div className="flex items-center gap-2">
                <label className="text-sm">Qty:</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    onQuantityChange(item.id, parseInt(e.target.value) || 1)
                  }
                  className="w-16 border rounded-md p-1 text-center"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuoteDrawer;
