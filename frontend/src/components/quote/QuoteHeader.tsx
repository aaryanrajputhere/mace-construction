import { FileText, HelpCircle } from "lucide-react";
import Tooltip from "./Tooltip";

const QuoteHeader: React.FC = () => {
  return (
    <div className="sticky top-[90px] z-40 px-4 lg:px-6">
      <div className="bg-white shadow-lg rounded-2xl border border-blue-900 p-2 lg:p-4 transition-all duration-300 backdrop-blur-sm bg-opacity-95">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-[#033159] to-[#00598F] rounded-lg shadow-md">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">Quote Builder</h1>
            <Tooltip text="Create and send requests for quotes to multiple vendors at once">
              <HelpCircle className="h-4 w-4 text-gray-500" />
            </Tooltip>
          </div>
        </div>
        <p className="text-gray-700 font-medium text-sm ml-11">
          Build and send your request for quote to multiple vendors
        </p>
      </div>
    </div>
  );
};

export default QuoteHeader;
