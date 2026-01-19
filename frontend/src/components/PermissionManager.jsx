import { useEffect, useState } from "react";
import { MdLocationOn, MdMic, MdCameraAlt } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

export default function PermissionManager({ onCompleted }) {
  const { dark } = useTheme();

  const config = {
    location: {
      icon: <MdLocationOn size={28} />,
      title: "लोकेशन अनुमति दें",
      desc: "आपकी शिकायत को सही विभाग तक पहुँचाने के लिए ज़रूरी।",
      check: async () => {
        try {
          const res = await navigator.permissions.query({ name: "geolocation" });
          return res.state === "granted";
        } catch {
          return false;
        }
      },
      request: () =>
        new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        ),
    },
    camera: {
      icon: <MdCameraAlt size={28} />,
      title: "कैमरा अनुमति दें",
      desc: "सबूत के रूप में फ़ोटो लेने के लिए ज़रूरी।",
      check: async () => {
        try {
          const res = await navigator.permissions.query({ name: "camera" });
          return res.state === "granted";
        } catch {
          return false;
        }
      },
      request: () => navigator.mediaDevices.getUserMedia({ video: true }),
    },
    microphone: {
      icon: <MdMic size={28} />,
      title: "माइक्रोफ़ोन अनुमति दें",
      desc: "वॉइस डिक्टेशन के लिए ज़रूरी।",
      check: async () => {
        try {
          const res = await navigator.permissions.query({
            name: "microphone",
          });
          return res.state === "granted";
        } catch {
          return false;
        }
      },
      request: () => navigator.mediaDevices.getUserMedia({ audio: true }),
    },
  };

  const order = ["location", "camera", "microphone"];

  const [pending, setPending] = useState([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAll = async () => {
      const list = [];
      for (const key of order) {
        const granted = await config[key].check();
        if (!granted) list.push(key);
      }
      setPending(list);
      if (list.length === 0) onCompleted();
    };
    checkAll();
  }, []);

  if (pending.length === 0) return null;

  const current = pending[index];

  const handleAllow = async () => {
    try {
      await config[current].request();
      const next = index + 1;
      if (next < pending.length) setIndex(next);
      else onCompleted();
    } catch {
      setError("अनुमति अस्वीकार की गई। कृपया सेटिंग्स में सक्षम करें।");
    }
  };

  const handleDeny = () => {
    setError("ऐप इन अनुमतियों के बिना आगे नहीं बढ़ सकता।");
  };

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center transition ${
        dark ? "bg-black/60" : "bg-black/40"
      }`}
    >
      <div
        className={`w-full max-w-[95vw] rounded-2xl shadow-xl p-6 pb-7 transition-all ${
          dark
            ? "bg-gray-900 text-gray-200"
            : "bg-[#F7F9FC] text-teal-700"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 rounded-xl ${
              dark ? "bg-teal-800/30" : "bg-teal-200/40"
            }`}
          >
            {config[current].icon}
          </div>
          <h3 className="font-semibold text-lg">{config[current].title}</h3>
        </div>

        <p className={`text-sm mb-4 ${dark ? "text-gray-400" : "text-slate-600"}`}>
          {config[current].desc}
        </p>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleDeny}
            className={`px-4 py-2 rounded-lg border text-sm ${
              dark
                ? "border-gray-600 text-gray-300"
                : "border-gray-300 text-slate-600"
            }`}
          >
            अस्वीकार करें
          </button>

          <button
            onClick={handleAllow}
            className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition ${
              dark
                ? "bg-teal-600 hover:bg-teal-500 text-gray-900"
                : "bg-teal-700 hover:bg-teal-800 text-white"
            }`}
          >
            अनुमति दें
          </button>
        </div>

        <p
          className={`text-xs text-center mt-3 ${
            dark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {index + 1} / {pending.length}
        </p>
      </div>
    </div>
  );
}
