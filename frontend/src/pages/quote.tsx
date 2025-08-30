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
    <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-3">
          <div className="p-3 bg-gradient-to-br from-[#033159] to-[#00598F] rounded-xl shadow-md">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Quote Builder
            </h1>
            <Tooltip text="Create and send requests for quotes to multiple vendors at once">
              <HelpCircle className="h-5 w-5 text-gray-500 mt-1 sm:mt-0" />
            </Tooltip>
          </div>
        </div>
        <p className="text-gray-700 font-medium text-base lg:text-lg">
          Build and send your request for quote to multiple vendors
        </p>
      </div>

      {/* Items Section */}
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
            onClick={addNewItem}
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
          <div className="table-container shadow rounded-xl">
            <table className="w-full mobile-card-table">
              <thead className="table-sticky-header">
                <tr className="border-b-2 border-gray-200 bg-white">
                  <th scope="col" className="text-left py-4 px-3 font-bold text-gray-800 text-base" style={{ minWidth: "200px" }}>
                    Item Description
                  </th>
                  <th scope="col" className="text-left py-4 px-3 font-bold text-gray-800 w-32 text-base">
                    Quantity
                  </th>
                  <th scope="col" className="text-left py-4 px-3 font-bold text-gray-800 w-24 text-base">
                    Unit
                  </th>
                  <th scope="col" className="text-center py-4 px-3 font-bold text-gray-800 w-24 text-base">
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
                    <td className="py-4 px-3" data-label="Description">
                      <label className="sr-only" htmlFor={`item-desc-${item.id}`}>Description for item {index + 1}</label>
                      <input
                        id={`item-desc-${item.id}`}
                        className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Enter item description"
                      />
                    </td>
                    <td className="py-4 px-3" data-label="Quantity">
                      <label className="sr-only" htmlFor={`item-qty-${item.id}`}>Quantity for item {index + 1}</label>
                      <input
                        id={`item-qty-${item.id}`}
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            Number(e.target.value) || 0
                          )
                        }
                        min="0"
                        aria-label={`Quantity for ${item.description}`}
                      />
                    </td>
                    <td className="py-4 px-3" data-label="Unit">
                      <label className="sr-only" htmlFor={`item-unit-${item.id}`}>Unit for item {index + 1}</label>
                      <select
                        id={`item-unit-${item.id}`}
                        className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                        aria-label={`Unit for ${item.description}`}
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
                    <td className="py-4 px-3 text-center" data-label="Actions">
                      <Tooltip text="Delete this item">
                        <button
                          className="min-h-[44px] min-w-[44px] p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                          aria-label={`Remove ${item.description}`}
                          onClick={() => deleteItem(item.id)}
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
        )}
      </div>

      {/* Project Information */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Building className="h-6 w-6 text-gray-500 mr-3" />
            Project Information
          </h2>
          <Tooltip text="Provide project details to help vendors understand your requirements">
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="space-y-3">
            <label htmlFor="project-name" className="flex items-center text-sm font-bold text-gray-800">
              <Edit3 className="h-4 w-4 text-gray-500 mr-2" />
              Project Name *
              <Tooltip text="Give your project a clear, descriptive name">
                <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
              </Tooltip>
            </label>
            <input
              id="project-name"
              className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
              aria-required="true"
              aria-describedby="project-name-help"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Kitchen Renovation - Smith Residence"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center text-sm font-bold text-gray-800">
              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
              Site Address
              <Tooltip text="Job site location helps vendors calculate delivery costs">
                <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
              </Tooltip>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center text-sm font-bold text-gray-800">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              Needed By
              <Tooltip text="When do you need materials delivered? This affects pricing and availability">
                <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
              </Tooltip>
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium"
              value={neededBy}
              onChange={(e) => setNeededBy(e.target.value)}
            />
          </div>

          <div className="space-y-3 lg:col-span-2">
            <label className="flex items-center text-sm font-bold text-gray-800">
              <FileText className="h-4 w-4 text-gray-500 mr-2" />
              Additional Notes
              <Tooltip text="Include special requirements, delivery instructions, or quality specifications">
                <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
              </Tooltip>
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium resize-none"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special requirements, delivery instructions, quality specifications..."
            />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Upload className="h-6 w-6 text-gray-500 mr-3" />
            Attachments
          </h2>
          <Tooltip text="Upload blueprints, specifications, or reference images to help vendors provide accurate quotes">
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </Tooltip>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 lg:p-12 text-center hover:border-[#033159] hover:bg-gray-50 transition-all duration-300 cursor-pointer">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-base text-gray-800 font-bold mb-2">
                Click to upload blueprints, specifications, or other documents
              </p>
              <p className="text-sm text-gray-600">
                Supports PDF, DOC, images, and CAD files (Max 10MB each)
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-800">Uploaded Files:</p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <Paperclip className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-800 font-bold">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-600 font-medium">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Tooltip text="Remove file">
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 text-gray-500 mr-3" />
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
              className="flex items-center space-x-4 p-5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[#033159] cursor-pointer transition-all duration-200"
            >
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor)}
                onChange={() => toggleVendor(vendor)}
                className="w-5 h-5 text-[#033159] border-gray-300 rounded-lg focus:ring-[#033159] focus:ring-2"
              />
              <span className="text-base font-bold text-gray-800">
                {vendor}
              </span>
            </label>
          ))}
        </div>

        {selectedVendors.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-900 font-bold">
              RFQ will be sent to:{" "}
              <strong className="font-normal">
                {selectedVendors.join(", ")}
              </strong>
            </p>
          </div>
        )}
      </div>

      {/* Submit Section */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to Submit?
            </h3>
            <p className="text-base text-gray-700 font-medium">
              Your RFQ will be sent to {selectedVendors.length} selected vendor
              {selectedVendors.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {!isFormValid && (
              <div className="flex items-center text-amber-700 text-sm font-bold">
                <AlertCircle className="h-5 w-5 mr-2" />
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
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 text-base ${
                  isFormValid && !isSubmitting
                    ? "bg-gradient-to-r from-[#033159] to-[#00598F] text-white hover:from-[#022244] hover:to-[#004a7a] hover:shadow-xl hover:-translate-y-1 shadow-lg"
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
                    <Send className="h-5 w-5" />
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
