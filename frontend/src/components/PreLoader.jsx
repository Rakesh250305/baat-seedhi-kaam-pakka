import { useEffect } from "react";
import Lottie from "lottie-react";
import animation from "../assets/images/loader.json";


export default function Preloader({ onFinish }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    // <div className="flex flex-col items-center justify-center h-screen bg-black text-white space-y-4">
    //   {/* <img src={logo} alt="logo" className="w-28 h-28 object-contain" /> */}

    //   <Lottie animationData={animation} style={{ width: 120, height: 120 }} />

    //   <p className="text-lg tracking-wide opacity-80 animate-pulse">
    //     Loading...
    //   </p>
    // </div>
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff"
    }}>
      <Lottie animationData={animation} loop />
    </div>
  );
}
