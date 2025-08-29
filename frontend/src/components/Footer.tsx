import { Mail, Phone, MapPin, Globe, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const handleGetQuote = () => {
    navigate("/quote");
  };
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 items-start">
          {/* Company Info & Logo */}
          <div className="lg:col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="mb-8">
              <img
                src="/logos/logo.svg"
                alt="Mace Logo"
                className="h-12 mb-8 filter drop-shadow-sm"
              />
              <p className="text-base text-gray-700 leading-relaxed font-light max-w-sm font-['Helvetica_Neue']">
                Leading provider of comprehensive security solutions, delivering
                innovative technology and expert services to protect what
                matters most.
              </p>
            </div>
          </div>

          {/* Executive Director Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-300 pb-3 font-['Helvetica_Neue']">
              Leadership
            </h3>
            <div className="space-y-3">
              <h4 className="text-xl font-bold mb-2 text-[#033159] font-['Helvetica_Neue']">
                Umerie Emmanuel
              </h4>
              <p className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide font-['Helvetica_Neue']">
                Executive Director
              </p>
              <p className="text-sm text-gray-600 font-light leading-relaxed max-w-xs font-['Helvetica_Neue']">
                Leading Mace with vision and expertise in delivering
                comprehensive security solutions across Nigeria.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3
              className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-300 pb-3"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Contact Info
            </h3>
            <div className="space-y-6">
              <div className="flex items-start group">
                <MapPin
                  className="h-5 w-5 text-gray-500 mt-1 mr-4 flex-shrink-0 transition-colors duration-300"
                  style={{ color: "#033159" }}
                />
                <p
                  className="text-sm text-gray-700 font-light leading-relaxed"
                  style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                >
                  No 3 Berbera Street,
                  <br />
                  Wuse, Zone 6
                </p>
              </div>
              <div className="flex items-center group">
                <Mail className="h-5 w-5 text-[#033159] mr-4 flex-shrink-0 transition-colors duration-300" />
                <a
                  href="mailto:maceinfonigeria@gmail.com"
                  className="text-sm text-gray-700 transition-all duration-300 font-light font-['Helvetica_Neue'] hover:text-[#033159] hover:underline hover:underline-offset-2"
                >
                  maceinfonigeria@gmail.com
                </a>
              </div>
              <div className="flex items-center group">
                <Phone className="h-5 w-5 text-[#033159] mr-4 flex-shrink-0 transition-colors duration-300" />
                <a
                  href="tel:07033035659"
                  className="text-sm text-gray-700 transition-all duration-300 font-light font-['Helvetica_Neue'] hover:text-[#033159] hover:underline hover:underline-offset-2"
                >
                  07033035659
                </a>
              </div>
              <div className="flex items-center group">
                <Globe className="h-5 w-5 text-[#033159] mr-4 flex-shrink-0 transition-colors duration-300" />
                <a
                  href="https://www.maceinfo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 transition-all duration-300 font-light font-['Helvetica_Neue'] hover:text-[#033159] hover:underline hover:underline-offset-2"
                >
                  www.maceinfo.com
                </a>
              </div>
            </div>
          </div>

          {/* Social & CTA */}
          <div className="lg:col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-300 pb-3 font-['Helvetica_Neue']">
              Connect
            </h3>
            <div className="space-y-8">
              <a
                href="https://instagram.com/maceinfo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-base text-gray-700 hover:text-[#033159] transition-all duration-300 font-medium font-['Helvetica_Neue'] group"
              >
                <Instagram className="h-6 w-6 mr-4 text-current group-hover:scale-110 transition-transform duration-300" />
                @maceinfo
              </a>
              <button
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[#033159] hover:bg-[#044568] hover:border-[#7dd3fc] rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 border-2 border-transparent"
                onClick={handleGetQuote}
              >
                Get Quote Today →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#033159]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm font-light text-[#e0f2fe] font-['Helvetica_Neue']">
              © 2024 Mace. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
              <a
                href="#"
                className="text-sm transition-all duration-300 font-light text-[#e0f2fe] hover:text-white font-['Helvetica_Neue'] hover:underline hover:underline-offset-2"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm transition-all duration-300 font-light text-[#e0f2fe] hover:text-white font-['Helvetica_Neue'] hover:underline hover:underline-offset-2"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
