import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <div className="pb-20 h-95">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />

        {/* Always go here first */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>

      {/* Footer ALWAYS visible */}
      <Footer />
    </div>
  );
}

export default App;
