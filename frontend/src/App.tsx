// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Materials from "./pages/materials";
import StudCalculator from "./pages/calculators/stud";
import OSBCalculator from "./pages/calculators/osb";
import QuoteBuilder from "./pages/quote";
import LandingPage from "./pages/home";
import VendorReplyPage from "./pages/vendor-reply";
const App: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <Header />
      {/* Container with consistent padding */}
      <main className="container py-10 space-scale-lg">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/calculators/studs" element={<StudCalculator />} />
          <Route path="/calculators/osb" element={<OSBCalculator />} />
          <Route path="/quote" element={<QuoteBuilder />} />
          <Route
            path="/vendor-reply/:rfqId/:token"
            element={<VendorReplyPage />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
