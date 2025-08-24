// src/components/materials/MaterialsGrid.tsx
import React from "react";
import MaterialCard from "./MaterialCard";

const sampleMaterials = [
  {
    id: 1,
    name: "2x4 Stud",
    size: "8 ft length",
    unit: "piece",
    price: "$3.50",
    vendors: ["Home Depot", "Lowe’s"],
  },
  {
    id: 2,
    name: "OSB Board",
    size: "4x8 ft sheet",
    unit: "sheet",
    price: "$12.00",
    vendors: ["Menards", "ABC Supply"],
  },
  {
    id: 3,
    name: "Drywall Sheet",
    size: "1/2 in x 4x8 ft",
    unit: "sheet",
    price: "$10.50",
    vendors: ["Local Supplier", "Home Depot"],
  },
  {
    id: 4,
    name: "PT Wood",
    size: "2x6 in, 10 ft",
    unit: "piece",
    price: "$15.00",
    vendors: ["Lowe’s"],
  },
  {
    id: 5,
    name: "Housewrap",
    size: "9 ft x 150 ft roll",
    unit: "roll",
    price: "$120.00",
    vendors: ["ABC Supply", "Menards"],
  },
];

const MaterialsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleMaterials.map((mat) => (
        <MaterialCard
          key={mat.id}
          name={mat.name}
          size={mat.size}
          unit={mat.unit}
          price={mat.price}
          vendors={mat.vendors}
        />
      ))}
    </div>
  );
};

export default MaterialsGrid;
