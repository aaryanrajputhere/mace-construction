import React from "react";
import { Package } from "lucide-react";

interface VendorReplyTableProps {
  items: any[];
  fields: any[];
  handleFieldChange: (idx: number, field: string, value: string) => void;
}

const VendorReplyTable: React.FC<VendorReplyTableProps> = ({
  items,
  fields,
  handleFieldChange,
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600">
        <Package className="h-16 w-16 mx-auto mb-6 text-gray-400" />
        <p className="text-xl font-bold mb-3 text-gray-800">No items found</p>
        <p className="text-base text-gray-700">
          This RFQ appears to have no items to quote
        </p>
      </div>
    );
  }
  return (
    <div className="table-container shadow rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed min-w-[900px] sm:min-w-full">
          <thead className="bg-gradient-to-r from-[#033159] to-[#00598F] text-white">
            <tr>
              <th className="text-left py-4 px-3 font-bold text-sm w-[11%] align-middle">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>item name</span>
                </div>
              </th>
              <th className="text-left py-4 px-3 font-bold text-sm w-[8%] align-middle">
                size/option
              </th>
              <th className="text-left py-4 px-3 font-bold text-sm w-[7%] align-middle">
                unit
              </th>
              <th className="text-left py-4 px-3 font-bold text-sm w-[7%] align-middle">
                qty requested
              </th>
              <th className="text-left py-4 px-3 font-bold text-sm w-[12%] align-middle">
                your price
                <br />
                (per unit)
              </th>
              <th className="text-left py-4 px-3 font-bold text-sm w-[12%] align-middle">
                lead time
              </th>
              <th className="text-left py-4 px-3 font-bold text-sm w-[13%] align-middle">
                substitution /<br />
                alt product
              </th>
              <th className="text-left py-4 px-3 font-bold text-sm w-[10%] align-middle">
                file upload
              </th>
              <th className="text-left py-4 px-3 font-bold text-sm w-[20%] align-middle">
                notes
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } h-[110px] align-top`}
              >
                {/* item name */}
                <td className="py-6 px-3 break-words max-w-[120px]">
                  <div className="font-bold text-gray-900 text-base">
                    {item["Item Name"]}
                  </div>
                </td>
                {/* size/option */}
                <td className="py-6 px-3 break-words max-w-[80px]">
                  <div className="text-gray-700 text-base">
                    {item["Size/Option"] || "-"}
                  </div>
                </td>
                {/* unit */}
                <td className="py-6 px-3 break-words max-w-[60px]">
                  <div className="text-gray-700 text-base font-medium">
                    {item["Unit"] || "-"}
                  </div>
                </td>
                {/* qty requested */}
                <td className="py-6 px-3 break-words max-w-[60px]">
                  <div className="text-gray-700 text-base font-medium">
                    {item["Quantity"] || "-"}
                  </div>
                </td>
                {/* your price (per unit) - editable, required */}
                <td className="py-6 px-3 min-w-[120px]">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={fields[idx]?.price || ""}
                      onChange={(e) =>
                        handleFieldChange(idx, "price", e.target.value)
                      }
                      className="w-full pl-8 pr-4 py-5 min-h-[56px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </td>
                {/* lead time - editable, required */}
                <td className="py-6 px-3 min-w-[120px]">
                  <input
                    type="date"
                    value={fields[idx]?.lead_time || ""}
                    onChange={(e) =>
                      handleFieldChange(idx, "lead_time", e.target.value)
                    }
                    className="w-full px-4 py-5 min-h-[56px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                    required
                  />
                </td>
                {/* substitution / alt product - editable */}
                <td className="py-6 px-3 min-w-[140px]">
                  <textarea
                    value={fields[idx]?.substitutions || ""}
                    onChange={(e) =>
                      handleFieldChange(idx, "substitutions", e.target.value)
                    }
                    className="w-full px-4 py-5 min-h-[56px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base resize-none"
                    placeholder="Alternative products..."
                    rows={2}
                  />
                </td>
                {/* file upload - editable */}
                <td className="py-6 px-3 min-w-[100px]">
                  <input
                    type="url"
                    value={fields[idx]?.file_link || ""}
                    onChange={(e) =>
                      handleFieldChange(idx, "file_link", e.target.value)
                    }
                    className="w-full px-4 py-5 min-h-[56px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                    placeholder="https://..."
                  />
                </td>
                {/* notes - editable */}
                <td
                  className="py-6 px-3 min-w-[180px]"
                  style={{ minWidth: "180px", width: "100%" }}
                >
                  <textarea
                    value={fields[idx]?.notes || ""}
                    onChange={(e) =>
                      handleFieldChange(idx, "notes", e.target.value)
                    }
                    className="w-full px-4 py-5 min-h-[56px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base resize-none"
                    placeholder="Additional notes..."
                    rows={2}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Responsive stacked view for mobile */}
      <div className="block md:hidden mt-6">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="mb-6 bg-white rounded-xl shadow border border-gray-200 p-4"
          >
            <div className="mb-2 flex items-center font-bold text-gray-900 text-base">
              <Package className="h-4 w-4 mr-2" />
              {item["Item Name"]}
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <span className="font-bold">Size/Option:</span>{" "}
              {item["Size/Option"] || "-"}
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <span className="font-bold">Unit:</span> {item["Unit"] || "-"}
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <span className="font-bold">Qty Requested:</span>{" "}
              {item["Quantity"] || "-"}
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <span className="font-bold">Your Price (per unit):</span>{" "}
              <span className="relative">
                <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={fields[idx]?.price || ""}
                  onChange={(e) =>
                    handleFieldChange(idx, "price", e.target.value)
                  }
                  className="pl-6 pr-2 py-2 border border-gray-300 rounded-lg w-32 text-gray-900 font-medium"
                  placeholder="0.00"
                  required
                />
              </span>
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <span className="font-bold">Lead Time:</span>{" "}
              <input
                type="date"
                value={fields[idx]?.lead_time || ""}
                onChange={(e) =>
                  handleFieldChange(idx, "lead_time", e.target.value)
                }
                className="px-2 py-2 border border-gray-300 rounded-lg w-36 text-gray-900 font-medium"
                required
              />
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <span className="font-bold">Substitution/Alt Product:</span>{" "}
              <textarea
                value={fields[idx]?.substitutions || ""}
                onChange={(e) =>
                  handleFieldChange(idx, "substitutions", e.target.value)
                }
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium resize-none"
                placeholder="Alternative products..."
                rows={2}
              />
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <span className="font-bold">File Upload:</span>{" "}
              <input
                type="url"
                value={fields[idx]?.file_link || ""}
                onChange={(e) =>
                  handleFieldChange(idx, "file_link", e.target.value)
                }
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium"
                placeholder="https://..."
              />
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <span className="font-bold">Notes:</span>{" "}
              <textarea
                value={fields[idx]?.notes || ""}
                onChange={(e) =>
                  handleFieldChange(idx, "notes", e.target.value)
                }
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium resize-none"
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorReplyTable;
