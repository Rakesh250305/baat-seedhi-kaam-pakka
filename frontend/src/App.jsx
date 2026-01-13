import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Footer from "./components/Footer";
import CallSadak from "./components/CallSadak";
import CallBijli from "./components/CallBijli";
import AdminLogin from "./pages/admin/AdminLogin";
import Status from "./pages/Status";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplaintList from "./pages/admin/ComplaintList";

function App() {
  const LayoutWrapper = ({children})=> {
    const pathname = useLocation();

    const hideFooter = ["/bijli", "/sadak"].includes(pathname.pathname);
    return(
      <>
        {children}
        {!hideFooter && <Footer />}
      </>
    );
  };
  return(
    <>
      <BrowserRouter>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/sadak" element={<CallSadak />} />
            <Route path="/bijli" element={<CallBijli />} />
            <Route path="/status" element={<Status/>} />

            <Route path="/admin-login" element={<AdminLogin/>} />
            <Route path="/dashboard" element={<AdminDashboard/>} />
            <Route path="/complaintlist" element={<ComplaintList/>}/>
          </Routes>
        </LayoutWrapper>
      </BrowserRouter> 
    </>
  )
};

export default App;