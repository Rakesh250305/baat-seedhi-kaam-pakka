import { useState } from "react";

export default function PermissionGate({ onGranted }) {
  const [error, setError] = useState("");

  async function requestPermissions() {
    setError("");

    const status = {
      location: false,
      mic: false,
      camera: false,
    };

    // Location
    try {
      await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      status.location = true;
    } catch (error) {
        if (error.code === error.PERMISSION_DENIED) {
    alert("कृपया ब्राउज़र सेटिंग्स में जाकर लोकेशन अनुमति सक्षम करें।");
  }
        console.log(error);
    }

    // Mic + Camera
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      status.camera = true;
      status.mic = true;
    } catch (error) {
        if (error.name === "NotAllowedError") {
            alert("कृपया ब्राउज़र सेटिंग्स में जाकर अनुमतियाँ सक्षम करें।");
        }
        console.log(error);
    }

    if (status.location && status.mic && status.camera) {
      onGranted();
    } else {
      setError("कृपया सभी अनुमतियाँ प्रदान करें ताकि ऐप कार्य कर सके।");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gray-100 dark:bg-gray-900 transition">
      <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
        अनुमतियाँ आवश्यक
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        बात सीधी काम पक्का ऐप को चलाने के लिए नीचे दी गई अनुमतियाँ जरूरी हैं:
      </p>

      <div className="text-left mb-8 space-y-2">
        <p className="text-gray-700 dark:text-gray-300">📍 स्थान (Location)</p>
        <p className="text-gray-700 dark:text-gray-300">🎙 माइक्रोफोन (Microphone)</p>
        <p className="text-gray-700 dark:text-gray-300">📸 कैमरा (Camera)</p>
      </div>

      <button
        className="px-6 py-3 rounded-xl font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition w-full max-w-xs"
        onClick={requestPermissions}
      >
        अनुमति दें और जारी रखें
      </button>

      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
    </div>
  );
}
