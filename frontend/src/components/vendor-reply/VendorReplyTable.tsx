import React from "react";
import { Package, DollarSign, Clock, MessageSquare, Link } from "lucide-react";

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
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#033159] to-[#00598F] text-white">
            <tr>
              <th className="text-left py-4 px-3 font-bold text-base whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Item Name</span>
                </div>
              </th>
              <th className="text-left py-4 px-3 font-bold text-base whitespace-nowrap">
                Size/Option
              </th>
              <th className="text-left py-4 px-3 font-bold text-base whitespace-nowrap">
                Unit
              </th>
              <th className="text-left py-4 px-3 font-bold text-base whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Your Price</span>
                </div>
              </th>
              <th className="text-left py-4 px-3 font-bold text-base whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Lead Time</span>
                </div>
              </th>
              <th className="text-left py-4 px-3 font-bold text-base whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Notes</span>
                </div>
              </th>
              <th className="text-left py-4 px-3 font-bold text-base whitespace-nowrap">
                Substitutions
              </th>
              <th className="text-left py-4 px-3 font-bold text-base whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Link className="h-4 w-4" />
                  <span>File Link</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-3">
                  <div className="font-bold text-gray-900 text-base">
                    {item.name}
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="text-gray-700 text-base">
                    {item.size || "-"}
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="text-gray-700 text-base font-medium">
                    {item.unit || "-"}
                  </div>
                </td>
                <td className="py-4 px-3">
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
                      className="w-full pl-8 pr-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </td>
                <td className="py-4 px-3">
                  <input
                    type="text"
                    value={fields[idx]?.lead_time || ""}
                    onChange={(e) =>
                      handleFieldChange(idx, "lead_time", e.target.value)
                    }
                    className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                    placeholder="e.g. 2-3 weeks"
                    required
                  />
                </td>
                <td className="py-4 px-3">
                  <textarea
                    value={fields[idx]?.notes || ""}
                    onChange={(e) =>
                      handleFieldChange(idx, "notes", e.target.value)
                    }
                    className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base resize-none"
                    placeholder="Additional notes..."
                    rows={1}
                  />
                </td>
                <td className="py-4 px-3">
                  <textarea
                    value={fields[idx]?.substitutions || ""}
                    onChange={(e) =>
                      handleFieldChange(idx, "substitutions", e.target.value)
                    }
                    className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base resize-none"
                    placeholder="Alternative products..."
                    rows={1}
                  />
                </td>
                <td className="py-4 px-3">
                  <input
                    type="url"
                    value={fields[idx]?.file_link || ""}
                    onChange={(e) =>
                      handleFieldChange(idx, "file_link", e.target.value)
                    }
                    className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                    placeholder="https://..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorReplyTable;
