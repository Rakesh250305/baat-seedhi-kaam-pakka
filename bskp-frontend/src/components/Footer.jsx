import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import StatusModal from "./StatusModal";

export default function Footer() {
  const location = useLocation();
  const [showStatus, setShowStatus] = useState(false);

  const linkClass = (path) =>
    `flex flex-col items-center text-sm ${
      location.pathname === path ? "text-blue-500" : "text-gray-400"
    }`;

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 z-40">
        <div className="flex justify-around py-5">
          <Link to="/" className={linkClass("/")}>
            🏠 Home
          </Link>

          <Link to="/services" className={linkClass("/services")}>
            📞 Services
          </Link>

          <button
            onClick={() => setShowStatus(true)}
            className="flex flex-col items-center text-sm text-yellow-400"
          >
            📄 Status
          </button>
        </div>
      </footer>

      {showStatus && (
        <StatusModal onClose={() => setShowStatus(false)} />
      )}
    </>
  );
}