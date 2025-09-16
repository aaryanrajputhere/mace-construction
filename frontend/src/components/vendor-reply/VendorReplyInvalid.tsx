import React from "react";
import { XCircle } from "lucide-react";

const VendorReplyInvalid: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-8 text-center max-w-md">
      <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
      <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Link</h1>
      <p className="text-gray-600">
        The RFQ link is invalid or missing required parameters.
      </p>
    </div>
  </div>
);

export default VendorReplyInvalid;
