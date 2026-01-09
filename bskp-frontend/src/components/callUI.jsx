import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { MdCallEnd } from "react-icons/md";
import { HiMiniSpeakerWave, HiOutlineSpeakerWave } from "react-icons/hi2";

export default function CallUI({ problem, background, onEnd }) {
  const [seconds, setSeconds] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between text-white"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Header */}
      <header className="relative mx-4 mt-4 px-6 py-4 flex justify-between items-center rounded-xl bg-white/15 backdrop-blur-md">
        <p className="text-lg font-semibold">{problem}</p>

        <div className="text-center">
          <p className="text-sm opacity-80">Outgoing Call</p>
          <p className="font-mono text-lg">{formatTime(seconds)}</p>
        </div>
      </header>

      {/* Controls */}
      <footer className="relative mb-20 flex justify-center items-center gap-10">
        <button
          className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
          onClick={() => setCameraOn(!cameraOn)}
        >
          {cameraOn ? <FaCamera size={20} /> : <CiCamera size={25} />}
        </button>

        <button
          onClick={() => {
            setSeconds(0);
            onEnd(); // 👈 complaint saved in Services.jsx
          }}
          className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
        >
          <MdCallEnd size={30} />
        </button>

        <button
          className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
          onClick={() => setSpeakerOn(!speakerOn)}
        >
          {speakerOn ? (
            <HiMiniSpeakerWave size={27} />
          ) : (
            <HiOutlineSpeakerWave size={25} />
          )}
        </button>
      </footer>
    </div>
  );
}
