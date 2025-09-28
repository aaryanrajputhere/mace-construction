import React from "react";

interface VendorReplySummaryProps {
  fields: any[];
  deliveryCharges: string;
  discount: string;
  notes: string;
  onChange: (field: string, value: string) => void;
}

const calculateTotal = (
  fields: any[],
  deliveryCharges: string,
  discount: string
) => {
  const subtotal = fields.reduce((sum, row) => {
    const price = parseFloat(row.price || "0");
    const quantity = parseFloat(row.quantity || "1");
    const lineTotal =
      (isNaN(price) ? 0 : price) * (isNaN(quantity) ? 1 : quantity);
    return sum + lineTotal;
  }, 0);
  const delivery = parseFloat(deliveryCharges || "0");
  const disc = parseFloat(discount || "0");
  return Math.max(subtotal + delivery - disc, 0).toFixed(2);
};

const VendorReplySummary: React.FC<VendorReplySummaryProps> = ({
  fields,
  deliveryCharges,
  discount,
  notes,
  onChange,
}) => {
  const subtotal = fields.reduce((sum, row) => {
    const price = parseFloat(row.price || "0");
    const quantity = parseFloat(row.quantity || "1");

    const lineTotal = price * quantity;

    return sum + lineTotal;
  }, 0);
  const total = calculateTotal(fields, deliveryCharges, discount);

  return (
    <div className="bg-gray-50 rounded-xl p-6 shadow border border-gray-200 mt-8">
      <h3 className="text-lg font-bold mb-4 text-gray-900">Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Delivery Charges (optional)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={deliveryCharges}
            onChange={(e) => onChange("deliveryCharges", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent text-gray-900 font-medium"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Discount (optional)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={discount}
            onChange={(e) => onChange("discount", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent text-gray-900 font-medium"
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 mb-2">
        <span className="text-gray-700 font-medium">Subtotal:</span>
        <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium">Delivery Charges:</span>
        <span className="text-gray-900 font-bold">
          {deliveryCharges && !isNaN(Number(deliveryCharges))
            ? `+$${Number(deliveryCharges).toFixed(2)}`
            : "$0.00"}
        </span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium">Discount:</span>
        <span className="text-gray-900 font-bold">
          {discount && !isNaN(Number(discount))
            ? `-$${Number(discount).toFixed(2)}`
            : "$0.00"}
        </span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700 font-medium">Total Amount:</span>
        <span className="text-xl text-[#033159] font-bold">${total}</span>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 font-medium mb-1">
          Vendor Terms / Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => onChange("notes", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent text-gray-900 font-medium resize-none"
          placeholder="e.g. Payment Terms, Quote Valid Till, etc."
          rows={3}
        />
      </div>
    </div>
  );
};

export default VendorReplySummary;
