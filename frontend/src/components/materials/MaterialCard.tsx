// src/components/materials/MaterialCard.tsx
import React from "react";

interface Props {
  name: string;
  size?: string;
  unit: string;
  price: string;
  vendors: string[];
}

const MaterialCard: React.FC<Props> = ({
  name,
  size,
  unit,
  price,
  vendors,
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        {size && <p className="text-gray-500 text-sm">{size}</p>}
      </div>

      {/* Details */}
      <div className="mt-3 space-y-1">
        <p className="text-gray-700 text-sm">
          <span className="font-medium">Unit:</span> {unit}
        </p>
        <p className="text-gray-700 text-sm">
          <span className="font-medium">Price:</span> {price}
        </p>
        <p className="text-gray-700 text-sm">
          <span className="font-medium">Vendors:</span>{" "}
          {vendors.length > 0 ? vendors.join(", ") : "N/A"}
        </p>
      </div>

      {/* CTA */}
      <button className="mt-4 w-full bg-black text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-800 transition">
        Add to Quote
      </button>
    </div>
  );
};

export default MaterialCard;
