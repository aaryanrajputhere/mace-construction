import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const VendorReplyMessage: React.FC<{ message: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <div
      className={`mt-8 p-6 rounded-2xl shadow-lg border ${
        message.includes("✅")
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      <div className="flex items-center space-x-3">
        {message.includes("✅") ? (
          <CheckCircle className="h-6 w-6 text-green-600" />
        ) : (
          <XCircle className="h-6 w-6 text-red-600" />
        )}
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default VendorReplyMessage;
