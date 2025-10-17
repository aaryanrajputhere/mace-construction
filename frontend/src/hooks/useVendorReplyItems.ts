import { useState, useEffect } from "react";

export interface VendorReplyItem {
  id: string;
  rfq_id: string;
  vendor_email: string;
  item_name: string;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

interface UseVendorItemReplyResult {
  vendorReplies: VendorReplyItem[] | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch vendor reply items for a given RFQ.
 * @param rfq_id - The RFQ ID
 * @param token - The JWT token from the vendor email link
 */
export function useVendorItemReply(
  rfq_id: string,
  token: string
): UseVendorItemReplyResult {
  const [vendorReplies, setVendorReplies] = useState<VendorReplyItem[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rfq_id || !token) return;

    const fetchVendorReplies = async () => {
      setLoading(true);
      setError(null);

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(
          `${backendUrl}/api/awards/getVendorReplyItems/${rfq_id}/${token}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch vendor replies");
        }

        setVendorReplies(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorReplies();
  }, [rfq_id, token]);

  return { vendorReplies, loading, error };
}
