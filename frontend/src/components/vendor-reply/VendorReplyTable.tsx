import React from "react";
import { Package } from "lucide-react";

interface VendorReplyTableProps {
  items: any[];
  fields: any[];
  handleFieldChange: (idx: number, field: string, value: string) => void;
  handleFileChange: (idx: number, file: File | null) => void;
}

const VendorReplyTable: React.FC<VendorReplyTableProps> = ({
  items,
  fields,
  handleFieldChange,
  handleFileChange,
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
    <div className="w-full">
      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden lg:block">
        <div className="table-container shadow rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[1000px]">
              <thead className="bg-gradient-to-r from-[#033159] to-[#00598F] text-white">
                <tr>
                  <th className="text-left py-5 px-3 font-bold text-sm w-[15%] align-middle">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Item Name</span>
                    </div>
                  </th>
                  <th className="text-left py-5 px-3 font-bold text-sm w-[10%] align-middle">
                    Size/Option
                  </th>
                  <th className="text-left py-5 px-3 font-bold text-sm w-[6%] align-middle">
                    Unit
                  </th>
                  <th className="text-left py-5 px-3 font-bold text-sm w-[6%] align-middle">
                    Qty
                  </th>
                  <th className="text-left py-5 px-3 font-bold text-sm w-[10%] align-middle">
                    Your Price
                    <br />
                    (per unit)
                  </th>
                  <th className="text-left py-5 px-3 font-bold text-sm w-[10%] align-middle">
                    Lead Time
                  </th>
                  <th className="text-left py-5 px-3 font-bold text-sm w-[12%] align-middle">
                    Substitution
                  </th>
                  <th className="text-left py-5 px-3 font-bold text-sm w-[13%] align-middle">
                    File Upload
                  </th>
                  <th className="text-left py-5 px-3 font-bold text-sm w-[18%] align-middle">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } h-[140px] align-top`}
                  >
                    <td className="py-6 px-3">
                      <div
                        className="font-bold text-gray-900 text-sm break-words overflow-hidden leading-tight"
                        title={item["Item Name"]}
                      >
                        {item["Item Name"]}
                      </div>
                    </td>
                    <td className="py-6 px-3">
                      <div
                        className="text-gray-700 text-sm break-words overflow-hidden leading-tight"
                        title={item["Size/Option"] || "-"}
                      >
                        {item["Size/Option"] || "-"}
                      </div>
                    </td>
                    <td className="py-6 px-3">
                      <div
                        className="text-gray-700 text-sm font-medium break-words overflow-hidden leading-tight"
                        title={item["Unit"] || "-"}
                      >
                        {item["Unit"] || "-"}
                      </div>
                    </td>
                    <td className="py-6 px-3">
                      <div
                        className="text-gray-700 text-sm font-medium break-words overflow-hidden leading-tight"
                        title={item["Quantity"] || "-"}
                      >
                        {item["Quantity"] || "-"}
                      </div>
                    </td>
                    <td className="py-6 px-3">
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
                          className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-sm"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </td>
                    <td className="py-6 px-3">
                      <input
                        type="date"
                        value={fields[idx]?.lead_time || ""}
                        onChange={(e) =>
                          handleFieldChange(idx, "lead_time", e.target.value)
                        }
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-sm"
                        required
                      />
                    </td>
                    <td className="py-6 px-3">
                      <textarea
                        value={fields[idx]?.substitutions || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            idx,
                            "substitutions",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-sm resize-none"
                        placeholder="Alternatives..."
                        rows={2}
                      />
                    </td>
                    <td className="py-6 px-3">
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                          onChange={(e) =>
                            handleFileChange(idx, e.target.files?.[0] || null)
                          }
                          className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-[#033159] file:to-[#00598F] file:text-white hover:file:from-[#022244] hover:file:to-[#004a7a] file:cursor-pointer file:transition-all file:duration-300"
                        />
                        {fields[idx]?.file && (
                          <div
                            className="text-xs text-green-600 font-medium bg-green-50 p-1.5 rounded border border-green-200 mt-1 truncate"
                            title={fields[idx].file.name}
                          >
                            ✓ {fields[idx].file.name}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          PDF, DOC, XLS, JPG, PNG
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-3">
                      <textarea
                        value={fields[idx]?.notes || ""}
                        onChange={(e) =>
                          handleFieldChange(idx, "notes", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-sm resize-none"
                        placeholder="Notes..."
                        rows={2}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View - Shown on mobile and tablet */}
      <div className="block lg:hidden space-y-6">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center font-bold text-gray-900 text-lg mb-2">
                <Package className="h-5 w-5 mr-3 text-[#033159]" />
                {item["Item Name"]}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Size/Option:</span>
                  <div className="mt-1">{item["Size/Option"] || "-"}</div>
                </div>
                <div>
                  <span className="font-semibold">Unit:</span>
                  <div className="mt-1">{item["Unit"] || "-"}</div>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Qty Requested:</span>
                  <div className="mt-1 text-lg font-bold text-[#033159]">
                    {item["Quantity"] || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Required Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Price (per unit) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">
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
                    className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lead Time *
                </label>
                <input
                  type="date"
                  value={fields[idx]?.lead_time || ""}
                  onChange={(e) =>
                    handleFieldChange(idx, "lead_time", e.target.value)
                  }
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Substitution/Alternative Product
                </label>
                <textarea
                  value={fields[idx]?.substitutions || ""}
                  onChange={(e) =>
                    handleFieldChange(idx, "substitutions", e.target.value)
                  }
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium resize-none"
                  placeholder="Alternative products or substitutions..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  File Upload
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                    onChange={(e) =>
                      handleFileChange(idx, e.target.files?.[0] || null)
                    }
                    className="w-full text-base text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-semibold file:bg-gradient-to-r file:from-[#033159] file:to-[#00598F] file:text-white hover:file:from-[#022244] hover:file:to-[#004a7a] file:cursor-pointer file:transition-all file:duration-300"
                  />
                  {fields[idx]?.file && (
                    <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-200">
                      <div
                        className="text-sm text-green-700 font-medium truncate max-w-full"
                        title={fields[idx].file.name}
                      >
                        ✓ {fields[idx].file.name}
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Accepted formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={fields[idx]?.notes || ""}
                  onChange={(e) =>
                    handleFieldChange(idx, "notes", e.target.value)
                  }
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium resize-none"
                  placeholder="Additional notes, specifications, or comments..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorReplyTable;
