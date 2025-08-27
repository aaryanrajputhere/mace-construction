import React, { useState } from "react";
import { ShoppingCart, Package, DollarSign, Users, X } from "lucide-react";

interface Props {
  name: string;
  size?: string;
  unit: string;
  price: string;
  vendors: string[];
  image?: string;
}

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

  const [quantity, setQuantity] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(
    vendors.length > 0 ? vendors[0] : ""
  );
  return (
    <>
      {/* Card */}
      <div
        onClick={() => setIsPanelOpen(true)}
        className="bg-white shadow-md rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="mb-4 w-full h-48 flex items-center justify-center rounded-lg overflow-hidden bg-gray-50 relative">
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
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
              <Package className="h-12 w-12" />
            </div>
          )}
          <div
            className={`absolute inset-0 bg-black bg-opacity-15 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {name}
          </h3>
          {size && <p className="text-sm text-[#00598F] font-medium">{size}</p>}
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5 text-sm">
          <div className="flex items-center">
            <Package className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">Unit:</span>
            <span className="ml-1 font-medium text-gray-800">{unit}</span>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">Price:</span>
            <span className="ml-1 font-semibold text-[#033159]">{price}</span>
          </div>

          <div className="flex items-start">
            <Users className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <span className="text-gray-600">Vendors ({vendors.length}):</span>
            <span className="ml-1 text-gray-700">
              {vendors.length > 0 ? (
                vendors.length <= 2 ? (
                  vendors.join(", ")
                ) : (
                  `${vendors.slice(0, 2).join(", ")} +${vendors.length - 2}`
                )
              ) : (
                <span className="text-gray-400 italic">None</span>
              )}
            </span>
          </div>
        </div>

        {/* Button */}
        <button
          className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          style={{ backgroundColor: "#033159" }}
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
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px]"
            onClick={() => setIsPanelOpen(false)}
          ></div>
          {/* Panel */}
          <div className="ml-auto w-96 bg-white shadow-xl h-full p-6 flex flex-col relative animate-slide-in">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsPanelOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quote Details
            </h2>

            {/* Product Image */}
            <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
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
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Material:</span> {name}
              </p>
              {size && (
                <p>
                  <span className="font-medium">Size:</span> {size}
                </p>
              )}
              <p>
                <span className="font-medium">Unit:</span> {unit}
              </p>
              <p>
                <span className="font-medium">Price:</span> {price}
              </p>
            </div>

            {/* Vendor Selector */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Vendor
              </label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#033159]"
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
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  className="px-3 py-1 border rounded-lg text-lg font-bold"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  –
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  className="px-3 py-1 border rounded-lg text-lg font-bold"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto">
              <button
                className="w-full mt-6 px-4 py-3 bg-[#033159] text-white rounded-lg shadow hover:shadow-lg transition"
                onClick={() => {
                  console.log("Added to Quote:", {
                    name,
                    unit,
                    price,
                    vendor: selectedVendor,
                    quantity,
                  });
                  setIsPanelOpen(false);
                }}
              >
                Confirm & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MaterialCard;
