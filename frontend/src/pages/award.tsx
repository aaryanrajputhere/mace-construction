import { useVendorItemReply } from "../hooks/useVendorReplyItems";
import { useParams } from "react-router-dom";
import transformVendorReplies from "../utils/awardMap";
import AwardTable from "../components/award/AwardTable";
import { useState } from "react";

interface AwardProps {
  rfq_id?: string;
  token?: string;
}

export default function Award(props: AwardProps) {
  const params = useParams();
  const rfq_id = props.rfq_id || (params as any).rfq_id || "";
  const token = props.token || (params as any).token || "";

  if (!rfq_id || !token) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Award Vendors</h1>
        <p className="text-sm text-gray-600">Missing RFQ ID or access token.</p>
      </div>
    );
  }

  const { vendorReplies, loading, error } = useVendorItemReply(rfq_id, token);
  const [awardedMessage, setAwardedMessage] = useState<string | null>(null);

  if (loading) return <p>Loading vendor replies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!vendorReplies || vendorReplies.length === 0)
    return <p>No vendor replies found.</p>;

  const items = transformVendorReplies(vendorReplies as any);
  const onAward = async (_itemId: number | string, vendorName: string) => {
    // find the mapped item to extract the original item_name
    const item = items.find(
      (it: any) => it.id === _itemId || String(it.id) === String(_itemId)
    );
    const item_name = item?.itemName;

    if (!item_name) {
      setAwardedMessage(
        `Error awarding: could not find item for id ${_itemId}`
      );
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(
        `${backendUrl}/api/awards/awardItem/${rfq_id}/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_name, vendor_name: vendorName }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to award item");
      }

      const updatedCount = data.updated ?? data.count ?? data.updatedCount ?? 0;
      setAwardedMessage(
        `Awarded ${vendorName} for ${item_name} (updated: ${updatedCount})`
      );
    } catch (err: any) {
      setAwardedMessage(`Error awarding: ${err?.message ?? String(err)}`);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Award Vendors</h1>
      {awardedMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded">
          {awardedMessage}
        </div>
      )}
      <AwardTable items={items} onAward={onAward} />
    </div>
  );
}
