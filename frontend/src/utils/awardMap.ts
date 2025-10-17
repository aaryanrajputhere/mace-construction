export interface BackendVendorReplyItem {
  id: number | string;
  rfq_id: string;
  reply_id?: string;
  item_name: string;
  size?: string;
  unit?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  discount?: number;
  delivery_charge?: number;
  lead_time?: string;
  substitutions?: string;
  file_link?: string | null;
  vendor_name: string;
  created_at?: string;
  status?: string;
  vendor_email?: string;
}

export interface VendorQuote {
  vendorName: string;
  leadTime?: string;
  quotedPrice?: string;
  notes?: string;
}

export interface ItemWithQuotes {
  id: number | string;
  itemName: string;
  requestedPrice?: string;
  quantity?: number | string;
  unit?: string;
  vendors: VendorQuote[];
}

export function mapVendorRepliesToAwardItems(
  maybeRows: BackendVendorReplyItem[] | null | undefined | any
): ItemWithQuotes[] {
  // Accept flexible shapes: array, { data: [...] }, { vendorReplies: [...] }, or wrapped response
  let rows: BackendVendorReplyItem[] | null | undefined = undefined;

  if (!maybeRows) return [];

  if (Array.isArray(maybeRows)) {
    rows = maybeRows as BackendVendorReplyItem[];
  } else if (Array.isArray(maybeRows.data)) {
    rows = maybeRows.data as BackendVendorReplyItem[];
  } else if (Array.isArray(maybeRows.vendorReplies)) {
    rows = maybeRows.vendorReplies as BackendVendorReplyItem[];
  } else if (Array.isArray(maybeRows.result)) {
    // some APIs use `result`
    rows = maybeRows.result as BackendVendorReplyItem[];
  } else {
    // Not an expected shape
    return [];
  }

  if (!rows || rows.length === 0) return [];

  const map = new Map<string, ItemWithQuotes>();

  const formatPrice = (p?: number) =>
    typeof p === "number"
      ? p % 1 === 0
        ? String(p)
        : p.toFixed(2)
      : undefined;

  for (const r of rows) {
    const key = `${r.item_name}||${r.size ?? ""}||${r.unit ?? ""}`;
    const label = r.size ? `${r.item_name} • ${r.size}` : r.item_name;

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        itemName: label,
        requestedPrice: undefined,
        quantity: r.quantity ?? undefined,
        unit: r.unit ?? undefined,
        vendors: [],
      });
    }

    const item = map.get(key)!;
    const notesParts: string[] = [];
    if (r.discount != null) notesParts.push(`Discount: ${r.discount}`);
    if (r.delivery_charge != null)
      notesParts.push(`Delivery: ${r.delivery_charge}`);
    if (r.substitutions) notesParts.push(`Subs: ${r.substitutions}`);

    const notes = notesParts.length ? notesParts.join(" • ") : undefined;

    const quotedPrice = formatPrice(r.unit_price);

    item.vendors.push({
      vendorName: r.vendor_name,
      leadTime: r.lead_time,
      quotedPrice: quotedPrice ?? undefined,
      notes,
    });
  }

  return Array.from(map.values());
}

export default mapVendorRepliesToAwardItems;
