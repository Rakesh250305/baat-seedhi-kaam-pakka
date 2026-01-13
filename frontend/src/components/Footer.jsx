import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { RiCustomerServiceFill, RiAdminFill } from "react-icons/ri";
import { BiSolidReport } from "react-icons/bi";


export default function Footer() {
  const location = useLocation();
  const [showStatus, setShowStatus] = useState(false);

  const linkClass = (path) =>
    `flex flex-col items-center text-sm ${
      location.pathname === path ? "text-white" : "text-teal-400"
    }`;

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full bg-teal-900 z-40">
        <div className="flex text-center justify-around py-5">
          <Link to="/" className={linkClass("/")}>
            <FaHome /> Home
          </Link>

          <Link to="/services" className={linkClass("/services")}>
           <RiCustomerServiceFill /> Services
          </Link>

          <Link
          to={"/status"}
            className={linkClass("/status")}
          >
            <BiSolidReport /> Status
          </Link>

          <Link to="/admin-login" 
          className={linkClass("/adminLogin")}>
           <RiAdminFill /> Admin
          </Link>
            
        </div>
      </footer>

      {showStatus && (
        <StatusModal onClose={() => setShowStatus(false)} />
      )}
    </>
  );
}