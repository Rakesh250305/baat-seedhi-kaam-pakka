import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";

function App() {
  const [showFooter, setShowFooter] = useState(true);

  return (
    <div className="pb-20 h-96">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/services"
          element={<Services setFooterVisible={setShowFooter} />}
        />

        <Route path="/admin" element={<Admin />} />
      </Routes>

      {showFooter && <Footer />}
    </div>
  );
}

export default App;
