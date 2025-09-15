import React, { useState } from "react";
import { useParams } from "react-router-dom";

const VendorReplyPage: React.FC = () => {
  const { rfqId, token } = useParams<{ rfqId: string; token: string }>();

  const [pricing, setPricing] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `https://yourapp.com/vendor-reply/${rfqId}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pricing, leadTime, notes }),
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
    }
  };

  if (!rfqId || !token) {
    return <p className="text-center mt-10">Invalid or missing link.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Submit Your RFQ Reply</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Pricing</label>
          <input
            type="text"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter your price"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Lead Time</label>
          <input
            type="text"
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g., 10 days"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Additional details"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Reply
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default VendorReplyPage;
