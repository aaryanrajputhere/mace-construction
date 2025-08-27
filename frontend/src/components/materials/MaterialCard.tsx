import React, { useState } from "react";
import {
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  X,
  Info,
  HelpCircle,
} from "lucide-react";

interface Props {
  name: string;
  size?: string;
  unit: string;
  price: string;
  vendors: string[];
  image?: string;
}

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({
  content,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const MaterialCard: React.FC<Props> = ({
  name,
  size,
  unit,
  price,
  vendors,
  image,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(
    vendors.length > 0 ? vendors[0] : ""
  );

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setIsPanelOpen(true)}
        className="bg-white shadow-md rounded-xl border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="mb-4 w-full h-48 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100 relative">
          {!imgError && image ? (
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500">
              <Package className="h-12 w-12" />
            </div>
          )}
          <div
            className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full">
                Click for details
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
            {name}
          </h3>
          {size && (
            <p className="text-sm text-[#00598F] font-semibold">{size}</p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5 text-sm">
          <div className="flex items-center">
            <Package className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span className="text-gray-700 font-medium">Unit:</span>
            <span className="ml-2 font-semibold text-gray-900">{unit}</span>
            <Tooltip content="The measurement unit for this material">
              <Info className="h-3 w-3 text-gray-400 ml-1" />
            </Tooltip>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span className="text-gray-700 font-medium">Price:</span>
            <span className="ml-2 font-bold text-[#033159] text-base">
              {price}
            </span>
            <Tooltip content="Price per unit from selected vendor">
              <Info className="h-3 w-3 text-gray-400 ml-1" />
            </Tooltip>
          </div>

          <div className="flex items-start">
            <Users className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 font-medium">
              Vendors ({vendors.length}):
            </span>
            <div className="ml-2 flex items-center">
              <span className="text-gray-900 font-medium">
                {vendors.length > 0 ? (
                  vendors.length <= 2 ? (
                    vendors.join(", ")
                  ) : (
                    `${vendors.slice(0, 2).join(", ")} +${vendors.length - 2}`
                  )
                ) : (
                  <span className="text-gray-500 italic">None available</span>
                )}
              </span>
              <Tooltip content="Available suppliers for this material. Click to see all options.">
                <Info className="h-3 w-3 text-gray-400 ml-1" />
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#033159] focus:ring-opacity-50"
          style={{ backgroundColor: "#033159" }}
          onClick={(e) => {
            e.stopPropagation();
            setIsPanelOpen(true);
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Quote</span>
        </button>
      </div>

      {/* Side Panel */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsPanelOpen(false)}
          ></div>

          {/* Panel */}
          <div className="ml-auto w-96 bg-white shadow-2xl h-full flex flex-col relative animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                onClick={() => setIsPanelOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Quote Details
                </h2>
                <Tooltip content="Configure your material requirements and add to quote">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </Tooltip>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Product Image */}
              <div className="w-full h-40 mb-6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {!imgError && image ? (
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-12 w-12 text-gray-400" />
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Material:</span>
                  <span className="font-bold text-gray-900">{name}</span>
                </div>
                {size && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Size:</span>
                    <span className="font-medium text-gray-900">{size}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Unit:</span>
                  <span className="font-medium text-gray-900">{unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Price:</span>
                  <span className="font-bold text-[#033159] text-base">
                    {price}
                  </span>
                </div>
              </div>

              {/* Vendor Selector */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Select Vendor
                  </label>
                  <Tooltip content="Choose your preferred supplier. Prices may vary between vendors.">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#033159] focus:border-transparent bg-white text-gray-900 font-medium"
                >
                  {vendors.length > 0 ? (
                    vendors.map((vendor, index) => (
                      <option key={index} value={vendor}>
                        {vendor}
                      </option>
                    ))
                  ) : (
                    <option disabled>No vendors available</option>
                  )}
                </select>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Quantity
                  </label>
                  <Tooltip content="Specify the number of units you need for your project">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
                <div className="flex items-center justify-center space-x-4 bg-gray-50 rounded-lg p-3">
                  <button
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg text-lg font-bold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#033159] transition-colors text-gray-700"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    –
                  </button>
                  <span className="text-xl font-bold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg text-lg font-bold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#033159] transition-colors text-gray-700"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                className="w-full px-4 py-3 bg-[#033159] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#044670] focus:outline-none focus:ring-2 focus:ring-[#033159] focus:ring-opacity-50 flex items-center justify-center space-x-2"
                onClick={() => {
                  console.log("Added to Quote:", {
                    name,
                    unit,
                    price,
                    vendor: selectedVendor,
                    quantity,
                  });
                  setIsPanelOpen(false);
                  setShowPopup(true);
                  setTimeout(() => {
                    setShowPopup(false);
                  }, 5000);
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Confirm & Add to Quote</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success Popup */}
      {showPopup && (
        <div
          onClick={() => (window.location.href = "/quote")}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer animate-slide-up"
        >
          <div className="bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-xl flex items-center space-x-3 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#033159] text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-gray-800">
              <p className="font-semibold text-[#033159]">Added to Quote</p>
              <p className="text-sm text-gray-500">Click to view quote →</p>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-slide-up {
      animation: slide-up 0.3s ease-out forwards;
    }
  `}
      </style>
    </>
  );
};

export default MaterialCard;
