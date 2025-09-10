import { useState, useEffect } from "react";
import "../styles/quote-table.css";
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
  Paperclip,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  User,
  Mail,
  Phone,
} from "lucide-react";
import type { Material } from "../types/materials";

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
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
};

const QuoteBuilder: React.FC = () => {
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");

  const [items, setItems] = useState<Material[]>([]);
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load items from localStorage (from calculators/catalog)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quote") || "[]");
    // Transform localStorage objects to match table fields
    const mapped = stored.map((item: any) => ({
      Category: item.category || "",
      "Item Name": item.name || "",
      "Size/Option": item.size || item.option || "",
      Unit: item.unit || "",
      Price: item.price !== undefined ? String(item.price) : "",
      Vendors: item.vendor || item.vendors || "",
      image: item.image || "",
      Quantity: item.quantity !== undefined ? String(item.quantity) : "1",
    }));
    setItems(mapped);
  }, []);

  // Add new item
  const addNewItem = () => {
    setItems([
      ...items,
      {
        Category: "",
        "Item Name": "",
        "Size/Option": "",
        Unit: "",
        Price: "",
        Vendors: "",
        image: "",
        Quantity: "1",
      },
    ]);
  };

  // Handle editing table
  const updateItem = (index: number, field: keyof Material, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Delete row
  const deleteItem = (index: number) => {
    setItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("quote", JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate total price for an item
  const calculateItemTotal = (price: string, quantity: string): number => {
    const priceNum = parseFloat(price.replace(/[^0-9.-]/g, "")) || 0;
    const quantityNum = parseInt(quantity) || 0;
    return priceNum * quantityNum;
  };

  // Calculate grand total
  const calculateGrandTotal = (): number => {
    return items.reduce((total, item) => {
      return total + calculateItemTotal(item.Price, item.Quantity || "1");
    }, 0);
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

  // Submit RFQ
  const handleSubmit = async () => {
    if (!projectName.trim() || items.length === 0) {
      alert("Please fill in project name and add items.");
      return;
    }

    if (
      !requesterName.trim() ||
      !requesterEmail.trim() ||
      !requesterPhone.trim()
    ) {
      alert(
        "Please fill in your contact information (name, email, and phone number)."
      );
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requesterEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const projectInfo = {
      projectName,
      siteAddress,
      neededBy,
      notes,
      requesterName,
      requesterEmail,
      requesterPhone,
      createdAt: new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append("projectInfo", JSON.stringify(projectInfo));
    formData.append("items", JSON.stringify(items));
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/quotes/apply`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to submit RFQ");

      const result = await res.json();
      console.log("✅ RFQ submitted:", result);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("❌ RFQ submission error:", err);
      alert("Error submitting RFQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    projectName.trim() &&
    items.length > 0 &&
    requesterName.trim() &&
    requesterEmail.trim() &&
    requesterPhone.trim();

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
              Your quote request has been sent to the vendors.
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
    <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10 pt-2 ">
      {/* Sticky Header */}
      <div className="sticky top-[90px] z-40 px-4 lg:px-6 ">
        <div className="bg-white shadow-lg rounded-2xl border border-blue-900 p-2 lg:p-4 transition-all duration-300 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-[#033159] to-[#00598F] rounded-lg shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">Quote Builder</h1>
              <Tooltip text="Create and send requests for quotes to multiple vendors at once">
                <HelpCircle className="h-4 w-4 text-gray-500" />
              </Tooltip>
            </div>
          </div>
          <p className="text-gray-700 font-medium text-sm ml-11">
            Build and send your request for quote to multiple vendors
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-4 lg:px-6 space-y-8 lg:space-y-10">
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
                        key={index}
                        className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="py-4 px-3" data-label="Item Name">
                          <input
                            className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                            value={item["Item Name"]}
                            onChange={(e) =>
                              updateItem(index, "Item Name", e.target.value)
                            }
                            placeholder="Enter item name"
                          />
                        </td>
                        <td className="py-4 px-3" data-label="Size/Option">
                          <input
                            className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                            value={item["Size/Option"]}
                            onChange={(e) =>
                              updateItem(index, "Size/Option", e.target.value)
                            }
                            placeholder="Enter size/option"
                          />
                        </td>
                        <td className="py-4 px-3" data-label="Unit">
                          <input
                            className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                            value={item.Unit}
                            onChange={(e) =>
                              updateItem(index, "Unit", e.target.value)
                            }
                            placeholder="Unit"
                          />
                        </td>
                        <td className="py-4 px-3" data-label="Price">
                          <input
                            className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                            value={item.Price}
                            onChange={(e) =>
                              updateItem(index, "Price", e.target.value)
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
                              updateItem(index, "Quantity", e.target.value)
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
                              updateItem(index, "Vendors", e.target.value)
                            }
                            placeholder="Vendors"
                          />
                        </td>
                        <td
                          className="py-4 px-3 text-center"
                          data-label="Actions"
                        >
                          <Tooltip text="Delete this item">
                            <button
                              className="min-h-[44px] min-w-[44px] p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                              aria-label={`Remove ${item["Item Name"]}`}
                              onClick={() => deleteItem(index)}
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
              <label
                htmlFor="project-name"
                className="flex items-center text-sm font-bold text-gray-800"
              >
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

            <div className="space-y-3">
              <label
                htmlFor="requester-name"
                className="flex items-center text-sm font-bold text-gray-800"
              >
                <User className="h-4 w-4 text-gray-500 mr-2" />
                Your Name *
                <Tooltip text="Who should vendors contact about this quote?">
                  <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
                </Tooltip>
              </label>
              <input
                id="requester-name"
                className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                aria-required="true"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="requester-email"
                className="flex items-center text-sm font-bold text-gray-800"
              >
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                Email Address *
                <Tooltip text="Primary email for quote responses">
                  <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
                </Tooltip>
              </label>
              <input
                id="requester-email"
                type="email"
                className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                aria-required="true"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="requester-phone"
                className="flex items-center text-sm font-bold text-gray-800"
              >
                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                Phone Number *
                <Tooltip text="Phone number for urgent questions about your quote">
                  <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
                </Tooltip>
              </label>
              <input
                id="requester-phone"
                type="tel"
                className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
                aria-required="true"
                value={requesterPhone}
                onChange={(e) => setRequesterPhone(e.target.value)}
                placeholder="(555) 123-4567"
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
                placeholder="Enter any special requirements, delivery instructions, or quality specifications..."
              />
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Paperclip className="h-6 w-6 text-gray-500 mr-3" />
              Attach Files
            </h2>
            <Tooltip text="Upload drawings, specifications, or any documents to help vendors provide accurate quotes">
              <HelpCircle className="h-4 w-4 text-gray-500" />
            </Tooltip>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#033159] transition-colors duration-200">
            <input
              type="file"
              multiple
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-3" />
              <span className="text-base font-bold text-gray-800 mb-1">
                Drop files here or click to upload
              </span>
              <span className="text-sm text-gray-600">
                Supported: PDF, DOCX, JPG, PNG (max 10MB each)
              </span>
            </label>
          </div>

          {files.length > 0 && (
            <ul className="mt-6 space-y-3">
              {files.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-800 font-medium">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit Section */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to Submit?
              </h3>
              <p className="text-base text-gray-700 font-medium">
                Your RFQ will be sent to vendors
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`px-6 py-3 rounded-xl flex items-center justify-center space-x-2 font-bold shadow-lg transition-all duration-300 ${
                  !isFormValid || isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#033159] to-[#00598F] text-white hover:from-[#022244] hover:to-[#004a7a] hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit RFQ</span>
                  </>
                )}
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition-all duration-200 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
          {!isFormValid && (
            <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Please add at least one item and fill in the project name before
                submitting.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;
