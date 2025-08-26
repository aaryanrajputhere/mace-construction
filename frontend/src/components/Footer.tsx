import { Mail, Phone, MapPin, Globe, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Company Info & Logo */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img
                src="/logos/logo.svg"
                alt="Mace Logo"
                className="h-10 mb-6"
              />
              <p
                className="text-sm text-gray-600 leading-relaxed font-light"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
              >
                Leading provider of comprehensive security solutions, delivering
                innovative technology and expert services to protect what
                matters most.
              </p>
            </div>
          </div>

          {/* Executive Director Info */}
          <div className="lg:col-span-1">
            <h3
              className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Leadership
            </h3>
            <div className="space-y-2">
              <h4
                className="text-lg font-bold mb-1"
                style={{
                  color: "#033159",
                  fontFamily: "Helvetica Neue, sans-serif",
                }}
              >
                Umerie Emmanuel
              </h4>
              <p
                className="text-sm font-medium text-gray-500 mb-3"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
              >
                Executive Director
              </p>
              <p
                className="text-sm text-gray-600 font-light leading-relaxed"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
              >
                Leading Mace with vision and expertise in delivering
                comprehensive security solutions across Nigeria.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3
              className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <p
                  className="text-sm text-gray-600 font-light"
                  style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                >
                  No 3 Berbera Street,
                  <br />
                  Wuse, Zone 6
                </p>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                <a
                  href="mailto:maceinfonigeria@gmail.com"
                  className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-300 font-light"
                  style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                >
                  maceinfonigeria@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                <a
                  href="tel:07033035659"
                  className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-300 font-light"
                  style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                >
                  07033035659
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                <a
                  href="https://www.maceinfo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-300 font-light"
                  style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                >
                  www.maceinfo.com
                </a>
              </div>
            </div>
          </div>

          {/* Social & CTA */}
          <div className="lg:col-span-1">
            <h3
              className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Connect
            </h3>
            <div className="space-y-6">
              <a
                href="https://instagram.com/maceinfo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-blue-700 transition-colors duration-300 font-medium"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
              >
                <Instagram className="h-5 w-5 mr-3" />
                @maceinfo
              </a>
              <button
                className="w-full px-6 py-3 text-sm font-semibold text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#033159",
                  fontFamily: "Helvetica Neue, sans-serif",
                }}
              >
                Get Quote Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ backgroundColor: "#033159" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p
              className="text-sm text-white mb-2 sm:mb-0 font-light"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              © 2024 Mace. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a
                href="#"
                className="text-sm text-white hover:text-gray-200 transition-colors duration-300 font-light"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-gray-200 transition-colors duration-300 font-light"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
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
