import { CheckCircle } from "lucide-react";

const SuccessMessage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-xl border border-gray-100 p-12 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            RFQ Submitted Successfully!
          </h2>
          <p className="text-gray-700 font-medium">
            Your quote request has been sent to the vendors.
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-900 font-medium">
            You should receive responses within 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
