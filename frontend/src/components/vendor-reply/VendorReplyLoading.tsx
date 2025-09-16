import React from "react";

const VendorReplyLoading: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-8 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#033159] mx-auto mb-4"></div>
      <p className="text-gray-600">Loading RFQ items...</p>
    </div>
  </div>
);

export default VendorReplyLoading;
