import React from "react";
import { CheckCircle } from "lucide-react";

interface VendorReplySuccessProps {
  itemsProcessed?: number;
  filesUploaded?: number;
}

const VendorReplySuccess: React.FC<VendorReplySuccessProps> = ({
  itemsProcessed = 0,
  filesUploaded = 0,
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-12 text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-8">
        <div className="bg-green-100 rounded-full p-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
      </div>

      {/* Main Message */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Vendor Reply Submitted Successfully!
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Your response has been sent to the project team.
      </p>

      {/* Details */}
      <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-700">
              {itemsProcessed}
            </div>
            <div className="text-sm text-green-600 font-medium">
              Items Quoted
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">
              {filesUploaded}
            </div>
            <div className="text-sm text-green-600 font-medium">
              Files Uploaded
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          What happens next?
        </h3>
        <p className="text-blue-700 leading-relaxed">
          The project team will review your submission and may contact you for
          clarification or to proceed with your quote. You should hear back
          within 24-48 hours.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Thank you for your participation in this RFQ process!
        </p>
      </div>
    </div>
  </div>
);

export default VendorReplySuccess;
