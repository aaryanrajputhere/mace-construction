import React from "react";
import { Send } from "lucide-react";

const VendorReplySubmitButton: React.FC<{ isSubmitting: boolean }> = ({
  isSubmitting,
}) => (
  <div className="flex justify-center">
    <button
      type="submit"
      disabled={isSubmitting}
      className={`px-8 py-4 bg-gradient-to-r from-[#033159] to-[#00598F] text-white rounded-xl hover:from-[#022244] hover:to-[#004a7a] transition-all duration-300 flex items-center justify-center space-x-3 text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 min-w-[200px] ${
        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isSubmitting ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Submitting...</span>
        </>
      ) : (
        <>
          <Send className="h-5 w-5" />
          <span>Submit Reply</span>
        </>
      )}
    </button>
  </div>
);

export default VendorReplySubmitButton;
