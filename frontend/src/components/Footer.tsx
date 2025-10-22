import { Mail, Globe, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    navigate("/quote");
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 ">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Logo & About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="/logos/logo.svg"
              alt="Mace Logo"
              className="h-12 mb-6 filter drop-shadow-sm"
            />
            <p className="text-base text-gray-700 leading-relaxed font-light font-['Helvetica_Neue'] max-w-sm">
              Leading provider of comprehensive solutions, delivering
              innovative technology and expert services to protect what matters
              most.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-300 pb-2 font-['Helvetica_Neue']">
              Contact Info
            </h3>
            <div className="space-y-5">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#033159] mr-4 flex-shrink-0" />
                <a
                  href="mailto:maceinfonigeria@gmail.com"
                  className="text-sm text-gray-700 hover:text-[#033159] hover:underline hover:underline-offset-2 transition-all font-light font-['Helvetica_Neue']"
                >
                  support@maceinfo.com
                </a>
              </div>

              <div className="flex items-center">
                <Globe className="h-5 w-5 text-[#033159] mr-4 flex-shrink-0" />
                <a
                  href="https://www.maceinfo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 hover:text-[#033159] hover:underline hover:underline-offset-2 transition-all font-light font-['Helvetica_Neue']"
                >
                  www.maceinfo.com
                </a>
              </div>
            </div>
          </div>

          {/* Connect & CTA */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-300 pb-2 font-['Helvetica_Neue']">
              Connect
            </h3>
            <div className="space-y-6">
              <a
                href="https://instagram.com/maceinfo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-base text-gray-700 hover:text-[#033159] transition-all font-medium font-['Helvetica_Neue'] group"
              >
                <Instagram className="h-6 w-6 mr-3 text-current group-hover:scale-110 transition-transform duration-300" />
                @maceinfo
              </a>

              <button
                onClick={handleGetQuote}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[#033159] rounded-xl shadow-xl hover:bg-[#044568] hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 font-['Helvetica_Neue']"
              >
                Get Quote Today →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#033159]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm font-light text-[#e0f2fe] font-['Helvetica_Neue']">
            © 2024 Mace. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-2 sm:space-y-0">
            <a
              href="#"
              className="text-sm text-[#e0f2fe] hover:text-white hover:underline hover:underline-offset-2 transition-all font-light font-['Helvetica_Neue']"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-[#e0f2fe] hover:text-white hover:underline hover:underline-offset-2 transition-all font-light font-['Helvetica_Neue']"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
