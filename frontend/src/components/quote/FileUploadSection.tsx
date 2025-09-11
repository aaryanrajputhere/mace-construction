import { Paperclip, Upload, FileText, Trash2, HelpCircle } from "lucide-react";
import Tooltip from "./Tooltip";

interface FileUploadSectionProps {
  files: File[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  onFileUpload,
  onRemoveFile,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center space-x-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Paperclip className="h-6 w-6 text-gray-500 mr-3" />
          Attach Files
        </h2>
        <Tooltip text="Upload drawings, specifications, or any documents to help vendors provide accurate quotes">
          <HelpCircle className="h-4 w-4 text-gray-500" />
        </Tooltip>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#033159] transition-colors duration-200">
        <input
          type="file"
          multiple
          id="file-upload"
          className="hidden"
          onChange={onFileUpload}
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className="h-10 w-10 text-gray-400 mb-3" />
          <span className="text-base font-bold text-gray-800 mb-1">
            Drop files here or click to upload
          </span>
          <span className="text-sm text-gray-600">
            Supported: PDF, DOCX, JPG, PNG (max 10MB each)
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <ul className="mt-6 space-y-3">
          {files.map((file, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <span className="text-gray-800 font-medium">{file.name}</span>
              </div>
              <button
                onClick={() => onRemoveFile(i)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUploadSection;
