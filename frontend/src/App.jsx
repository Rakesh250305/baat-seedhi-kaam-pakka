import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Services from "./pages/Services";
import CallSadak from "./components/CallSadak";
import CallBijli from "./components/CallBijli";
import AdminLogin from "./pages/admin/AdminLogin";
import Status from "./pages/Status";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplaintList from "./pages/admin/ComplaintList";
import Footer from "./components/Footer";

import Splash from "./components/Splash";
import PermissionManager from "./components/PermissionManager";
import DesktopBlocked from "./components/DesktopScreen";

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [ready, setReady] = useState(false);

  // ✅ Splash logic with 5-minute cooldown
  useEffect(() => {
    const lastSplash = sessionStorage.getItem("lastSplashTime");
    const now = Date.now();
    const FIVE_MIN = 1000 * 60 * 5;

    if (!lastSplash || now - parseInt(lastSplash) > FIVE_MIN) {
      setShowSplash(true);
      sessionStorage.setItem("lastSplashTime", now.toString());
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Layout wrapper
  const LayoutWrapper = ({ children }) => {
    const pathname = useLocation();
    const hideFooter = ["/bijli", "/sadak"].includes(pathname.pathname);
    return (
      <>
        {children}
        {!hideFooter && <Footer />}
      </>
    );
  };

  return (
    <>
      {/* Desktop Block */}
      <div className="lg:block hidden">
        <DesktopBlocked />
      </div>

      {/* Mobile / Tablet */}
      <div className="lg:hidden block">
        {/* Splash */}
        {showSplash && <Splash onFinish={handleSplashFinish} />}

        {!showSplash && !ready ? (
          <PermissionManager onCompleted={() => setReady(true)} />
        ) : (
          <BrowserRouter>
            <LayoutWrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/sadak" element={<CallSadak />} />
                <Route path="/bijli" element={<CallBijli />} />
                <Route path="/status" element={<Status />} />

                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/complaintlist" element={<ComplaintList />} />
              </Routes>
            </LayoutWrapper>
          </BrowserRouter>
        )}
      </div>
    </>
  );
}

export default App;
