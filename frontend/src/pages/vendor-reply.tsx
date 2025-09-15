import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const VendorReplyPage: React.FC = () => {
  const { rfqId, token } = useParams<{ rfqId: string; token: string }>();

  const [items, setItems] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!rfqId || !token) return;
    const fetchItems = async () => {
      try {
        const res = await fetch(
          `https://yourapp.com/api/vendor-items/${rfqId}/${token}`
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
    }
  };

  if (!rfqId || !token) {
    return <p className="text-center mt-10">Invalid or missing link.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Submit Your RFQ Reply</h1>
      <form onSubmit={handleSubmit}>
        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Size</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Lead Time</th>
              <th className="p-2 border">Notes</th>
              <th className="p-2 border">Substitutions</th>
              <th className="p-2 border">File Link</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.size}</td>
                <td className="p-2 border">{item.unit}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={fields[idx].price}
                    onChange={(e) =>
                      handleFieldChange(idx, "price", e.target.value)
                    }
                    className="w-24 border p-1 rounded"
                    placeholder="Price"
                    required
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={fields[idx].lead_time}
                    onChange={(e) =>
                      handleFieldChange(idx, "lead_time", e.target.value)
                    }
                    className="w-24 border p-1 rounded"
                    placeholder="Lead Time"
                    required
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={fields[idx].notes}
                    onChange={(e) =>
                      handleFieldChange(idx, "notes", e.target.value)
                    }
                    className="w-32 border p-1 rounded"
                    placeholder="Notes"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={fields[idx].substitutions}
                    onChange={(e) =>
                      handleFieldChange(idx, "substitutions", e.target.value)
                    }
                    className="w-32 border p-1 rounded"
                    placeholder="Substitutions"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={fields[idx].file_link}
                    onChange={(e) =>
                      handleFieldChange(idx, "file_link", e.target.value)
                    }
                    className="w-32 border p-1 rounded"
                    placeholder="File Link"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
