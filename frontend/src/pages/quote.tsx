import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Upload,
  Calendar,
  MapPin,
  Building,
  Send,
  Edit3,
  Package,
  Users,
  Paperclip,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface QuoteItem {
  id: number;
  description: string;
  quantity: number;
  unit: string;
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

const QuoteBuilder: React.FC = () => {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    setVendors([
      "ABC Lumber Co.",
      "BuildRight Supply",
      "ProConstruct Materials",
      "Elite Building Supply",
    ]);
  }, []);

  // Add new item
  const addNewItem = () => {
    const newId = Math.max(0, ...items.map((i) => i.id)) + 1;
    setItems([
      ...items,
      {
        id: newId,
        description: "",
        quantity: 1,
        unit: "pcs",
      },
    ]);
  };

  // Handle editing table
  const updateItem = (id: number, field: keyof QuoteItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Delete row
  const deleteItem = (id: number) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      // Update localStorage
      const storageItems = updated.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        unit: item.unit,
      }));
      localStorage.setItem("quote", JSON.stringify(storageItems));
      return updated;
    });
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
  const handleSubmit = async () => {
    if (
      !projectName.trim() ||
      items.length === 0 ||
      selectedVendors.length === 0
    ) {
      alert(
        "Please fill in project name, add items, and select at least one vendor."
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const rfqId = "RFQ-" + Date.now().toString().slice(-6);

    const rfqData = {
      rfqId,
      projectName,
      siteAddress,
      neededBy,
      notes,
      items,
      vendors: selectedVendors,
      files: files.map((f) => f.name),
      createdAt: new Date().toISOString(),
    };

    // Save log
    const logs = JSON.parse(localStorage.getItem("rfqLogs") || "[]");
    logs.push(rfqData);
    localStorage.setItem("rfqLogs", JSON.stringify(logs));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after delay
    setTimeout(() => {
      setItems([]);
      setProjectName("");
      setSiteAddress("");
      setNeededBy("");
      setNotes("");
      setFiles([]);
      setSelectedVendors([]);
      setSubmitSuccess(false);
      localStorage.removeItem("quote");
    }, 3000);
  };

  const isFormValid =
    projectName.trim() && items.length > 0 && selectedVendors.length > 0;

  if (submitSuccess) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-xl border border-gray-100 p-12 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              RFQ Submitted Successfully!
            </h2>
            <p className="text-gray-700 font-medium">
              Your quote request has been sent to {selectedVendors.length}{" "}
              vendor{selectedVendors.length > 1 ? "s" : ""}.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-900 font-medium">
              You should receive responses within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-2 space-y-8">
      {/* Header */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-[#033159] to-[#00598F] rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Quote Builder</h1>
            <Tooltip text="Create and send requests for quotes to multiple vendors at once">
              <HelpCircle className="h-5 w-5 text-gray-500" />
            </Tooltip>
          </div>
        </div>
        <p className="text-gray-700 font-medium">
          Build and send your request for quote to multiple vendors
        </p>
      </div>

      {/* Items Section */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 text-gray-500 mr-2" />
              Quote Items
            </h2>
            <Tooltip text="Add materials and products you need quotes for. Items from calculators will appear here automatically.">
              <HelpCircle className="h-4 w-4 text-gray-500" />
            </Tooltip>
          </div>
          <button
            onClick={addNewItem}
            className="px-4 py-2 bg-[#033159] text-white rounded-lg hover:bg-[#022244] transition-all duration-200 flex items-center space-x-2 text-sm font-semibold shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold mb-2 text-gray-800">
              No items added yet
            </p>
            <p className="text-sm text-gray-700">
              Add items from calculators or create custom items
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-800">
                    Item Description
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-800 w-24">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-800 w-20">
                    Unit
                  </th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-800 w-20">
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
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-2">
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Enter item description"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            Number(e.target.value) || 0
                          )
                        }
                        min="0"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900"
                        value={item.unit}
                        onChange={(e) =>
                          updateItem(item.id, "unit", e.target.value)
                        }
                      >
                        <option value="pcs">pcs</option>
                        <option value="lf">lf</option>
                        <option value="sf">sf</option>
                        <option value="cf">cf</option>
                        <option value="ea">ea</option>
                        <option value="lot">lot</option>
                      </select>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Tooltip text="Delete this item">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Information */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building className="h-5 w-5 text-gray-500 mr-2" />
            Project Information
          </h2>
          <Tooltip text="Provide project details to help vendors understand your requirements">
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Edit3 className="h-4 w-4 text-gray-500 mr-2" />
              Project Name *
              <Tooltip text="Give your project a clear, descriptive name">
                <HelpCircle className="h-3 w-3 text-gray-400 ml-1" />
              </Tooltip>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Kitchen Renovation - Smith Residence"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
              Site Address
              <Tooltip text="Job site location helps vendors calculate delivery costs">
                <HelpCircle className="h-3 w-3 text-gray-400 ml-1" />
              </Tooltip>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              Needed By
              <Tooltip text="When do you need materials delivered? This affects pricing and availability">
                <HelpCircle className="h-3 w-3 text-gray-400 ml-1" />
              </Tooltip>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900"
              value={neededBy}
              onChange={(e) => setNeededBy(e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <FileText className="h-4 w-4 text-gray-500 mr-2" />
              Additional Notes
              <Tooltip text="Include special requirements, delivery instructions, or quality specifications">
                <HelpCircle className="h-3 w-3 text-gray-400 ml-1" />
              </Tooltip>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special requirements, delivery instructions, quality specifications..."
            />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Upload className="h-5 w-5 text-gray-500 mr-2" />
            Attachments
          </h2>
          <Tooltip text="Upload blueprints, specifications, or reference images to help vendors provide accurate quotes">
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </Tooltip>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#033159] transition-colors duration-200">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-800 font-medium">
                Click to upload blueprints, specifications, or other documents
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Supports PDF, DOC, images, and CAD files (Max 10MB each)
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">
                Uploaded Files:
              </p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-800 font-medium">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Tooltip text="Remove file">
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vendor Selection */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 text-gray-500 mr-2" />
            Select Vendors *
          </h2>
          <Tooltip text="Choose which vendors to send your RFQ to. Selecting multiple vendors helps ensure competitive pricing">
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((vendor) => (
            <label
              key={vendor}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor)}
                onChange={() => toggleVendor(vendor)}
                className="w-4 h-4 text-[#033159] border-gray-300 rounded focus:ring-[#033159]"
              />
              <span className="text-sm font-semibold text-gray-800">
                {vendor}
              </span>
            </label>
          ))}
        </div>

        {selectedVendors.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 font-medium">
              RFQ will be sent to: <strong>{selectedVendors.join(", ")}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Submit Section */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Ready to Submit?
            </h3>
            <p className="text-sm text-gray-700 font-medium mt-1">
              Your RFQ will be sent to {selectedVendors.length} selected vendor
              {selectedVendors.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {!isFormValid && (
              <div className="flex items-center text-amber-700 text-sm font-medium">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>Complete required fields</span>
              </div>
            )}

            <Tooltip
              text={
                isFormValid
                  ? "Send your RFQ to selected vendors"
                  : "Please complete all required fields first"
              }
            >
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 ${
                  isFormValid && !isSubmitting
                    ? "bg-[#033159] text-white hover:bg-[#022244] hover:shadow-lg hover:-translate-y-0.5 shadow-md"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit RFQ</span>
                  </>
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;
