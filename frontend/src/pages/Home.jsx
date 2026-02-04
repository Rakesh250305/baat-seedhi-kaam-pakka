import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PWAInstallButton from "../components/PWAInstallButton";
import Splash from "../components/Splash";
import indianEmblem from "../assets/images/IndianEmblem.svg";
import indianEmblemWhite from '../assets/images/IndiaEmblemWhite.svg'
import road from "../assets/images/sadak.jpg";
import electricity from "../assets/images/village.png";
import water from "../assets/images/Road2.png";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const navigate = useNavigate();
  // const [showPreLoader, setShowPreLoader] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  const { dark, toggleTheme } = useTheme();


  const carouselImages = [
    { src: road, label: "सड़क की समस्या" },
    { src: electricity, label: "बिजली की समस्या" },
    { src: water, label: "पानी और सफाई" },
  ];

  // Splash + Session logic
  // useEffect(() => {
  //   const now = Date.now();
  //   const hasSession = sessionStorage.getItem("session-started");
  //   const lastUsed = sessionStorage.getItem("last-used");

  //   if (!hasSession || !lastUsed || now - lastUsed > 1000 * 60 * 2) {
  //     //setShowPreLoader(true);
  //     sessionStorage.setItem("session-started", "true");
  //   }

  //   sessionStorage.setItem("last-used", now);
  // }, []);

  // Auto carousel every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // if (showPreLoader) {
  //   return <Splash onFinish={() => setShowPreLoader(false)} />;
  // }

  return (
    <>
    <div className={`${dark ? "bg-gray-900 text-gray-100" : "bg-[#F7F9FC] text-teal-700"} dark:bg-gray-900 dark:text-gray-100 min-h-screen px-6 pt-2 pb-20 flex flex-col items-center transition-colors duration-500`}>
      
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-4">
        <PWAInstallButton />
    <div className="absolute top-3 right-3">
      <button
        onClick={toggleTheme}
        className="px-3 py-1 border rounded-lg text-sm font-semibold"
      >
        {dark ? "🌞 Light" : "🌙 Dark"}
      </button>
    </div>

      </div>


      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-6">
        <img src={dark ? indianEmblemWhite : indianEmblem} alt="Emblem" className="w-[15%] mb-4" />
        <h1 className={`${dark ? "text-teal-300" : "text-teal-900"} dark:text-teal-300 text-[1.5rem] font-bold mb-2`}>
          बात सीधी, काम पक्का
        </h1>
        <p className={`${dark ? "text-gray-300" : "text-slate-500"} dark:text-gray-300 text-[.8rem] max-w-md`}>
          अब नागरिक समस्याओं का डिजिटल समाधान आसान और तेज़
        </p>
      </div>

      {/* Carousel */}
      <div className="relative max-w-md w-full mb-8">
        <img
          src={carouselImages[carouselIndex].src}
          alt={carouselImages[carouselIndex].label}
          className="rounded-xl object-cover w-full h-[10rem] shadow-lg"
        />
        <p className="mt-2 text-center font-medium">
          {carouselImages[carouselIndex].label}
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 mb-10">
        <Stat number="2,300+" label="शिकायतें दर्ज" darkMode={dark} />
        <Stat number="28" label="शहर कवर" darkMode={dark} />
        <Stat number="450+" label="सक्रिय अधिकारी" darkMode={dark} />
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/services")}
        className={`${dark ? "bg-teal-600 hover:bg-teal-500 text-gray-900" : "bg-teal-700 hover:bg-teal-800 text-white"} dark:bg-teal-600 dark:hover:bg-teal-500 dark:text-gray-900 w-full max-w-sm py-4 rounded-2xl text-lg font-semibold shadow-md transition`}
      >
        शुरू करें
      </button>

      {/* Footer Info */}
      {/* <p className="text-xs text-center mt-6 text-gray-500">
        नागरिक सेवा के लिए 🇮🇳
      </p> */}
    </div>

    </>
  );
}

// Stat card
function Stat({ number, label, dark }) {
  return (
    <div className="text-center">
      <p className={`${dark ? "text-teal-300" : "text-teal-600"} dark:text-teal-300 text-xl font-bold`}>
        {number}
      </p>
      <p className={`${dark ? "text-gray-300" : "text-slate-500"} dark:text-gray-300 text-sm`}>
        {label}
      </p>
    </div>
  );
}
