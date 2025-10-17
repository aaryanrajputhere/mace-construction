import { useVendorItemReply } from "../hooks/useVendorReplyItems";

interface AwardProps {
  rfq_id: string;
  token: string;
}

export default function Award({ rfq_id, token }: AwardProps) {
  const { vendorReplies, loading, error } = useVendorItemReply(rfq_id, token);

  if (loading) return <p>Loading vendor replies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!vendorReplies || vendorReplies.length === 0)
    return <p>No vendor replies found.</p>;

  // Map vendorReplies into the structure expected by AwardTable

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Award Vendors</h1>
    </div>
  );
}
