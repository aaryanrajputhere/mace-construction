interface VendorReply {
  id: number;
  rfq_id: string;
  reply_id: string;
  item_name: string;
  size?: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount?: number;
  delivery_charge?: number;
  lead_time?: string;
  substitutions?: string;
  file_link?: string | null;
  vendor_name: string;
  created_at: string;
  status: string;
  vendor_email: string;
}

interface BackendResponse {
  success: boolean;
  data: VendorReply[];
}

interface VendorQuote {
  vendorName: string;
  leadTime?: string;
  quotedPrice?: string;
  notes?: string;
}

interface ItemWithQuotes {
  id: string | number;
  itemName: string;
  requestedPrice?: string;
  quantity?: number;
  unit?: string;
  vendors: VendorQuote[];
}

/**
 * Converts backend vendor reply data into grouped item structure.
 */
export function transformVendorReplies(
  response: BackendResponse
): ItemWithQuotes[] {
  if (!response.success || !Array.isArray(response.data)) return [];

  // Group items by `item_name`
  const grouped = response.data.reduce((acc, reply) => {
    const key = reply.item_name;
    if (!acc[key]) {
      acc[key] = {
        id: reply.id,
        itemName: reply.item_name,
        requestedPrice: reply.unit_price?.toFixed(2),
        quantity: reply.quantity,
        unit: reply.unit,
        vendors: [],
      };
    }

    acc[key].vendors.push({
      vendorName: reply.vendor_name,
      leadTime: reply.lead_time
        ? new Date(reply.lead_time).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : undefined,
      quotedPrice: reply.unit_price?.toFixed(2),
      notes: reply.substitutions || "",
    });
    console.log("Processing reply for item:", reply.item_name, "from vendor:", reply.vendor_name);
    return acc;
  }, {} as Record<string, ItemWithQuotes>);

  // Convert to array
  return Object.values(grouped);
}

export default transformVendorReplies;
