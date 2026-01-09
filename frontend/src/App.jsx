import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Footer from "./components/Footer";
import CallSadak from "./components/CallSadak";
import CallBijli from "./components/CallBijli";
import AdminLogin from "./pages/AdminLogin";
import Status from "./pages/Status";
import AdminDashboard from "./pages/AdminDashboard";
// import PWAInstallButton from "./components/PWAInstallButton";

function AppRoutes() {
  const location = useLocation();

  // Hide footer on these paths:
  const hideFooter = ["/bijli", "/sadak"].includes(location.pathname);

  return (
    <>
        {/* <PWAInstallButton/> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/sadak" element={<CallSadak />} />
        <Route path="/bijli" element={<CallBijli />} />
        <Route path="/status" element={<Status/>} />

        <Route path="/admin-login" element={<AdminLogin/>} />
        <Route path="/dashboard" element={<AdminDashboard/>} />
       
        
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}


export default function App() {
  return (
    <>
    
    <Router>
      <AppRoutes />
    </Router>



    </>
  );
}
