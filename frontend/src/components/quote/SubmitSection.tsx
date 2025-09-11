import { Send, AlertCircle } from "lucide-react";

interface SubmitSectionProps {
  isFormValid: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ready to Submit?
          </h3>
          <p className="text-base text-gray-700 font-medium">
            Your RFQ will be sent to vendors
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`px-6 py-3 rounded-xl flex items-center justify-center space-x-2 font-bold shadow-lg transition-all duration-300 ${
              !isFormValid || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#033159] to-[#00598F] text-white hover:from-[#022244] hover:to-[#004a7a] hover:-translate-y-1 hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit RFQ</span>
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition-all duration-200 font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
      {!isFormValid && (
        <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">
            Please add at least one item and fill in the project name before
            submitting.
          </span>
        </div>
      )}
    </div>
  );
};

export default SubmitSection;
