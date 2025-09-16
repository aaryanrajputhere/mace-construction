import React from "react";
import { Package, HelpCircle } from "lucide-react";

const VendorReplyHeader: React.FC<{ rfqId: string }> = ({ rfqId }) => (
  <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 mb-8 hover:shadow-xl transition-all duration-300">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Package className="h-8 w-8 text-[#033159] mr-3" />
          Submit Your RFQ Reply
        </h1>
        <div className="group relative inline-block">
          <HelpCircle className="h-5 w-5 text-gray-500" />
          <div className="invisible group-hover:visible absolute z-10 px-2 py-1 text-sm text-white bg-gray-800 rounded-md -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            Fill in your pricing and details for each requested item
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
        RFQ ID: <span className="font-mono font-bold">{rfqId}</span>
      </div>
    </div>
  </div>
);

export default VendorReplyHeader;
