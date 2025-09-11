import { Package, Plus, Trash2, HelpCircle } from "lucide-react";
import type { Material } from "../../types/materials";
import Tooltip from "./Tooltip";
import { useNavigate } from "react-router-dom";

interface QuoteItemsTableProps {
  items: Material[];
  onAddItem: () => void;
  onUpdateItem: (index: number, field: keyof Material, value: any) => void;
  onDeleteItem: (index: number) => void;
  calculateItemTotal: (price: string, quantity: string) => number;
  calculateGrandTotal: () => number;
}

const QuoteItemsTable: React.FC<QuoteItemsTableProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  calculateItemTotal,
  calculateGrandTotal,
}) => {
  const navigate = useNavigate();

  const handleAddItem = () => {
    navigate("/materials");
  };
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Package className="h-6 w-6 text-gray-500 mr-3" />
            Quote Items
          </h2>
          <Tooltip text="Add materials and products you need quotes for. Items from calculators will appear here automatically.">
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </Tooltip>
        </div>
        <button
          onClick={handleAddItem}
          className="px-6 py-3 bg-gradient-to-r from-[#033159] to-[#00598F] text-white rounded-xl hover:from-[#022244] hover:to-[#004a7a] transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Package className="h-16 w-16 mx-auto mb-6 text-gray-400" />
          <p className="text-xl font-bold mb-3 text-gray-800">
            No items added yet
          </p>
          <p className="text-base text-gray-700">
            Add items from calculators or create custom items
          </p>
        </div>
      ) : (
        <>
          <div className="table-container shadow rounded-xl">
            <table className="w-full mobile-card-table">
              <thead className="table-sticky-header">
                <tr className="border-b-2 border-gray-200 bg-white">
                  <th className="text-left py-4 px-3 font-bold text-gray-800 text-base whitespace-nowrap">
                    Item Name
                  </th>
                  <th className="text-left py-4 px-3 font-bold text-gray-800 text-base whitespace-nowrap">
                    Size/Option
                  </th>
                  <th className="text-left py-4 px-3 font-bold text-gray-800 text-base whitespace-nowrap">
                    Unit
                  </th>
                  <th className="text-left py-4 px-3 font-bold text-gray-800 text-base whitespace-nowrap">
                    Price
                  </th>
                  <th className="text-left py-4 px-3 font-bold text-gray-800 text-base whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="text-left py-4 px-3 font-bold text-gray-800 text-base whitespace-nowrap">
                    Total
                  </th>
                  <th className="text-left py-4 px-3 font-bold text-gray-800 text-base whitespace-nowrap">
                    Vendors
                  </th>
                  <th className="text-center py-4 px-3 font-bold text-gray-800 text-base whitespace-nowrap">
                    <Tooltip text="Remove item from quote">
                      <span>Actions</span>
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-4 px-3" data-label="Item Name">
                      <input
                        className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                        value={item["Item Name"]}
                        onChange={(e) =>
                          onUpdateItem(index, "Item Name", e.target.value)
                        }
                        placeholder="Enter item name"
                      />
                    </td>
                    <td className="py-4 px-3" data-label="Size/Option">
                      <input
                        className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                        value={item["Size/Option"]}
                        onChange={(e) =>
                          onUpdateItem(index, "Size/Option", e.target.value)
                        }
                        placeholder="Enter size/option"
                      />
                    </td>
                    <td className="py-4 px-3" data-label="Unit">
                      <input
                        className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                        value={item.Unit}
                        onChange={(e) =>
                          onUpdateItem(index, "Unit", e.target.value)
                        }
                        placeholder="Unit"
                      />
                    </td>
                    <td className="py-4 px-3" data-label="Price">
                      <input
                        className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                        value={item.Price}
                        onChange={(e) =>
                          onUpdateItem(index, "Price", e.target.value)
                        }
                        placeholder="Price"
                      />
                    </td>
                    <td className="py-4 px-3" data-label="Quantity">
                      <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                        value={item.Quantity || "1"}
                        onChange={(e) =>
                          onUpdateItem(index, "Quantity", e.target.value)
                        }
                        placeholder="1"
                      />
                    </td>
                    <td className="py-4 px-3" data-label="Total">
                      <div className="px-4 py-3 min-h-[44px] bg-gray-100 rounded-xl border border-gray-200 text-gray-900 font-bold text-base flex items-center">
                        $
                        {calculateItemTotal(
                          item.Price,
                          item.Quantity || "1"
                        ).toFixed(2)}
                      </div>
                    </td>
                    <td className="py-4 px-3" data-label="Vendors">
                      <input
                        className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                        value={item.Vendors}
                        onChange={(e) =>
                          onUpdateItem(index, "Vendors", e.target.value)
                        }
                        placeholder="Vendors"
                      />
                    </td>
                    <td className="py-4 px-3 text-center" data-label="Actions">
                      <Tooltip text="Delete this item">
                        <button
                          className="min-h-[44px] min-w-[44px] p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                          aria-label={`Remove ${item["Item Name"]}`}
                          onClick={() => onDeleteItem(index)}
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="mt-6 flex justify-end">
            <div className="bg-gradient-to-r from-[#033159] to-[#00598F] text-white rounded-xl p-3 shadow-lg">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold">Grand Total:</span>
                <span className="text-2xl font-bold">
                  ${calculateGrandTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuoteItemsTable;
