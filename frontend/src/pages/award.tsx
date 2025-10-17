import AwardTable from "../components/award/AwardTable";

const sampleItems = [
  {
    id: 1,
    itemName: "2x4 Lumber",
    requestedPrice: "12.00",
    quantity: 100,
    unit: "ea",
    vendors: [
      {
        vendorName: "Vendor A",
        leadTime: "3 days",
        quotedPrice: "11.50",
        notes: "In stock",
      },
      {
        vendorName: "Vendor B",
        leadTime: "5 days",
        quotedPrice: "10.75",
        notes: "Limited stock",
      },
    ],
  },
  {
    id: 2,
    itemName: "OSB Panel 4x8",
    requestedPrice: "28.00",
    quantity: 50,
    unit: "sheet",
    vendors: [
      {
        vendorName: "Vendor C",
        leadTime: "2 days",
        quotedPrice: "27.25",
        notes: "Next-day pickup",
      },
      {
        vendorName: "Vendor D",
        leadTime: "7 days",
        quotedPrice: "26.50",
        notes: "Requires ordering",
      },
    ],
  },
];

export default function Award() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Award Vendors</h1>
      <AwardTable items={sampleItems} />
    </div>
  );
}
