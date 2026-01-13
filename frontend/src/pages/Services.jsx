import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Services() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const handleCall = (category) => () => {
    if (category === "Electricity") navigate("/bijli", { state: { category } });
    if (category === "Road") navigate("/sadak", { state: { category } });
  };

  return (
    <div className={`${dark ? "dark:bg-gray-900 dark:text-teal-500" : "bg-white text-teal-900" } min-h-screen px-6 py-10 pb-20 transition-colors`}>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">अपनी समस्या चुनें</h2>
        <p className={`${dark ? "dark:text-gray-300" : "text-teal-700" } text-sm mt-1`}>
          जिससे संबंधित समस्या आप दर्ज करना चाहते हैं
        </p>
      </div>

      <div className="flex flex-col gap-5 mt-4">
        
        <button
          onClick={handleCall("Road")}
          className={`${dark ? "dark:bg-gray-800 dark:border-gray-700" : "bg-teal-50 border-teal-200"}w-full rounded-2xl p-4 border 
            active:scale-95 transition flex flex-col items-center gap-4`}
        >
          <div className={`${dark ? "dark:bg-gray-700" : "bg-white"} w-16 h-16 rounded-xl  flex items-center justify-center shadow-sm`}>
            🛣️
          </div>
          <div className="text-center">
            <span className="text-lg font-bold">सड़क से जुड़ी समस्या</span>
            <span className={`${dark ? "dark:text-gray-300" : "text-gray-600"} text-sm block`}>
              गड्ढे, टूटी सड़क, पानी, मरम्मत आदि
            </span>
          </div>
        </button>

        <button
          onClick={handleCall("Electricity")}
          className={`${dark ? "dark:bg-gray-800 dark:border-gray-700" : "bg-teal-50 border-teal-200"} w-full rounded-2xl p-4 border 
            active:scale-95 transition flex flex-col items-center gap-4`}
        >
          <div className={`${dark ? "dark:bg-gray-700" : "bg-white"} w-16 h-16 rounded-xl  flex items-center justify-center shadow-sm`}>
            ⚡
          </div>
          <div className="text-center">
            <span className="text-lg font-bold">बिजली से जुड़ी समस्या</span>
            <span className={`${dark ? "dark:text-gray-300" : "text-gray-600"} text-sm block`}>
              बिजली कटौती, ट्रांसफॉर्मर, तार, मीटर आदि
            </span>
          </div>
        </button>

      </div>

      <p className={`${dark ? "dark:text-gray-400" : "text-gray-500"} text-xs text-center mt-10`}>
        नागरिक सेवा के लिए 🇮🇳
      </p>
    </div>
  );
}
