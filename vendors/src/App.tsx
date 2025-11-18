import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaterialsPage from "./pages/MaterialsPage";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/materials" element={<MaterialsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
