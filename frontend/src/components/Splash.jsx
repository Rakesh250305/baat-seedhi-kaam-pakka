import { useEffect, useState } from "react";
import indinaemblem from '../assets/images/IndianEmblem.svg';
import road1 from '../assets/images/Road1.png';
import road2 from '../assets/images/Road2.png';
import village from '../assets/images/village.png';

export default function Splash({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onFinish();
      }, 500); // match fade-out duration
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`relative h-screen bg-gradient-to-b from-[#D8EBFF] to-white flex flex-col items-center py-[1%] px-6 z-50 text-[#0b2541] transition-opacity duration-500 
        ${ fadeOut ? "opacity-0" : "opacity-100"}
      `}
    >
      <img src={road1} className="w-[70%] mt-[3em] mb-[1em]" />

      <h1 className="text-2xl font-extrabold text-center leading-tight">
        BAAT SEEDHI<br />KAAM PAKKA
      </h1>

      <p className="text-center font-bold mt-1">आवाज का system है</p>

<div className="mt-[2em]">
  {/* replaced spinner with circular loader */}
  <div className="relative w-28 h-28 flex items-center justify-center">
    <img src={indinaemblem} className="w-20 h-20 z-10" />
    <svg className="absolute w-28 h-28 -rotate-90">
      <circle
        cx="56"
        cy="56"
        r="52"
        stroke="#3b82f6"
        strokeWidth="4"
        fill="none"
        className="animate-progress"
        style={{
          strokeDasharray: 330,
          strokeDashoffset: 330,
          animation: "dash 3s linear forwards"
        }}
      />
    </svg>
    <style>
      {`
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `}
    </style>
  </div>
</div>



       <div className="flex gap-5 mt-[4em]">
         <span>
             <img src={road2} alt="" className="h-full" />
         </span>
         <span>
             <img src={village} alt="" className="h-full" />
         </span>
       </div>

     
    </div>
  );
}
