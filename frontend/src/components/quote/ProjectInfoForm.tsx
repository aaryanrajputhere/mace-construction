import {
  Building,
  Edit3,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  HelpCircle,
} from "lucide-react";
import Tooltip from "./Tooltip";
import { useEffect } from "react";

interface ProjectInfoFormProps {
  projectName: string;
  setProjectName: (value: string) => void;
  siteAddress: string;
  setSiteAddress: (value: string) => void;
  neededBy: string;
  setNeededBy: (value: string) => void;
  requesterName: string;
  setRequesterName: (value: string) => void;
  requesterEmail: string;
  setRequesterEmail: (value: string) => void;
  requesterPhone: string;
  setRequesterPhone: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const LOCAL_STORAGE_KEY = "mace_project_info";

const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({
  projectName,
  setProjectName,
  siteAddress,
  setSiteAddress,
  neededBy,
  setNeededBy,
  requesterName,
  setRequesterName,
  requesterEmail,
  setRequesterEmail,
  requesterPhone,
  setRequesterPhone,
  notes,
  setNotes,
}) => {
  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.projectName) setProjectName(data.projectName);
        if (data.siteAddress) setSiteAddress(data.siteAddress);
        if (data.neededBy) setNeededBy(data.neededBy);
        if (data.requesterName) setRequesterName(data.requesterName);
        if (data.requesterEmail) setRequesterEmail(data.requesterEmail);
        if (data.requesterPhone) setRequesterPhone(data.requesterPhone);
        if (data.notes) setNotes(data.notes);
      } catch {}
    }
    // eslint-disable-next-line
  }, []);

  // Save to localStorage whenever any field changes
  useEffect(() => {
    const data = {
      projectName,
      siteAddress,
      neededBy,
      requesterName,
      requesterEmail,
      requesterPhone,
      notes,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [
    projectName,
    siteAddress,
    neededBy,
    requesterName,
    requesterEmail,
    requesterPhone,
    notes,
  ]);

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center space-x-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Building className="h-6 w-6 text-gray-500 mr-3" />
          Project Information
        </h2>
        <Tooltip text="Provide project details to help vendors understand your requirements">
          <HelpCircle className="h-4 w-4 text-gray-500" />
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-3">
          <label
            htmlFor="project-name"
            className="flex items-center text-sm font-bold text-gray-800"
          >
            <Edit3 className="h-4 w-4 text-gray-500 mr-2" />
            Project Name *
            <Tooltip text="Give your project a clear, descriptive name">
              <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
            </Tooltip>
          </label>
          <input
            id="project-name"
            className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
            aria-required="true"
            aria-describedby="project-name-help"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g., Kitchen Renovation - Smith Residence"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center text-sm font-bold text-gray-800">
            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
            Site Address
            <Tooltip text="Job site location helps vendors calculate delivery costs">
              <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
            </Tooltip>
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium"
            value={siteAddress}
            onChange={(e) => setSiteAddress(e.target.value)}
            placeholder="123 Main St, City, State 12345"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center text-sm font-bold text-gray-800">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            Needed By
            <Tooltip text="When do you need materials delivered? This affects pricing and availability">
              <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
            </Tooltip>
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium"
            value={neededBy}
            onChange={(e) => setNeededBy(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label
            htmlFor="requester-name"
            className="flex items-center text-sm font-bold text-gray-800"
          >
            <User className="h-4 w-4 text-gray-500 mr-2" />
            Your Name *
            <Tooltip text="Who should vendors contact about this quote?">
              <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
            </Tooltip>
          </label>
          <input
            id="requester-name"
            className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
            aria-required="true"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-3">
          <label
            htmlFor="requester-email"
            className="flex items-center text-sm font-bold text-gray-800"
          >
            <Mail className="h-4 w-4 text-gray-500 mr-2" />
            Email Address *
            <Tooltip text="Primary email for quote responses">
              <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
            </Tooltip>
          </label>
          <input
            id="requester-email"
            type="email"
            className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
            aria-required="true"
            value={requesterEmail}
            onChange={(e) => setRequesterEmail(e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>

        <div className="space-y-3">
          <label
            htmlFor="requester-phone"
            className="flex items-center text-sm font-bold text-gray-800"
          >
            <Phone className="h-4 w-4 text-gray-500 mr-2" />
            Phone Number *
            <Tooltip text="Phone number for urgent questions about your quote">
              <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
            </Tooltip>
          </label>
          <input
            id="requester-phone"
            type="tel"
            className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium text-base"
            aria-required="true"
            value={requesterPhone}
            onChange={(e) => setRequesterPhone(e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="space-y-3 lg:col-span-2">
          <label className="flex items-center text-sm font-bold text-gray-800">
            <FileText className="h-4 w-4 text-gray-500 mr-2" />
            Additional Notes
            <Tooltip text="Include special requirements, delivery instructions, or quality specifications">
              <HelpCircle className="h-3 w-3 text-gray-400 ml-2" />
            </Tooltip>
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#033159] focus:border-transparent transition-all duration-200 text-gray-900 font-medium resize-none"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any special requirements, delivery instructions, or quality specifications..."
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoForm;
