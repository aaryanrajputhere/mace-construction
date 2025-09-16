import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VendorReplyHeader from "../components/vendor-reply/VendorReplyHeader";
import VendorReplyTable from "../components/vendor-reply/VendorReplyTable";
import VendorReplyMessage from "../components/vendor-reply/VendorReplyMessage";
import VendorReplyFooter from "../components/vendor-reply/VendorReplyFooter";
import VendorReplyLoading from "../components/vendor-reply/VendorReplyLoading";
import VendorReplyInvalid from "../components/vendor-reply/VendorReplyInvalid";
import VendorReplySubmitButton from "../components/vendor-reply/VendorReplySubmitButton";

const VendorReplyPage: React.FC = () => {
  const { rfqId, token } = useParams<{ rfqId: string; token: string }>();

  const [items, setItems] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!rfqId || !token) return;
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://mace-construction-production.up.railway.app/api/vendors/get-items/${rfqId}/${token}`
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data.items)) {
          setItems(data.items);
          setFields(
            data.items.map(() => ({
              price: "",
              lead_time: "",
              notes: "",
              substitutions: "",
              file_link: "",
            }))
          );
        }
      } catch (err) {
        setMessage("❌ Failed to fetch items");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [rfqId, token]);

  const handleFieldChange = (idx: number, field: string, value: string) => {
    setFields((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `https://yourapp.com/vendor-reply/${rfqId}/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: fields }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Reply submitted successfully!");
      } else {
        setMessage(`❌ Error: ${data.error || "Submission failed"}`);
      }
    } catch (err) {
      setMessage("❌ Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!rfqId || !token) {
    return <VendorReplyInvalid />;
  }

  if (isLoading) {
    return <VendorReplyLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <VendorReplyHeader rfqId={rfqId} />

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-8">
            <VendorReplyTable
              items={items}
              fields={fields}
              handleFieldChange={handleFieldChange}
            />
          </div>
          {/* Submit Button */}
          {items.length > 0 && (
            <VendorReplySubmitButton isSubmitting={isSubmitting} />
          )}
        </form>

        {/* Message Display */}
        <VendorReplyMessage message={message} />

        {/* Footer */}
        <VendorReplyFooter />
      </div>
    </div>
  );
};

export default VendorReplyPage;
