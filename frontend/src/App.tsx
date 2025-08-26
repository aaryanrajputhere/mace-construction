// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Materials from "./pages/materials";
import StudCalculator from "./pages/calculators/stud";
import OSBCalculator from "./pages/calculators/osb";
import QuoteBuilder from "./pages/quote";
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Added pt-24 to push content below floating header */}
      <main className="py-10 px-6">
        <Routes>
          <Route path="/materials" element={<Materials />} />
          <Route path="/calculators/studs" element={<StudCalculator />} />
          <Route path="/calculators/osb" element={<OSBCalculator />} />
          <Route path="/quote" element={<QuoteBuilder />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
