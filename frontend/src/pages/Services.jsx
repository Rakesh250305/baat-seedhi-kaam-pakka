import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();

    const handleCall = (category) => () => {
        if (!category) return;
        if (category == "Electricity"){
            navigate(`/bijli`, { state: { category } });
        } else if (category == "Road"){
            navigate(`/sadak`, { state: { category } });
        }
    };

  return (

    <>
    {/* <div className="min-h-screen pb-24 bg-gray-900 flex flex-col items-center justify-center gap-10 px-4">
      <h2 className="text-3xl lg:text-5xl font-bold text-white text-center">
        Select Your Problem
      </h2>

      <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
      
        <button
          className="
            bg-blue-600 hover:bg-blue-700 
            text-white 
            rounded-xl 
            m-2 p-2
            w-full sm:w-[20rem] lg:w-[28rem]
            h-[6rem] sm:h-[8rem] lg:h-[12rem]
            flex flex-col justify-center items-center
            transition duration-300 ease-in-out
            shadow-lg hover:scale-105
          "
          onClick={handleCall("Road")}
        >
          <span className="text-lg sm:text-2xl lg:text-4xl font-bold">
            सड़क की समस्या
          </span>
          <span className="text-sm sm:text-lg lg:text-xl opacity-80">
            Sadak Ki Samasya
          </span>
        </button>

  
        <button
          className="
            bg-blue-600 hover:bg-blue-700 
            text-white 
            rounded-xl 
            m-2 p-2
            w-full sm:w-[20rem] lg:w-[28rem]
            h-[6rem] sm:h-[8rem] lg:h-[12rem]
            flex flex-col justify-center items-center
            transition duration-300 ease-in-out
            shadow-lg hover:scale-105
          "
          onClick={handleCall("Electricity")}
        >
          <span className="text-lg sm:text-2xl lg:text-4xl font-bold">
            बिजली की समस्या
          </span>
          <span className="text-sm sm:text-lg lg:text-xl opacity-80">
            Bijli Ki Samasya
          </span>
        </button>
      </div>
    </div> */}
    
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">

  {/* Header */}
  <div className="text-center mb-6">
    <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">
      अपनी समस्या चुनें
    </h2>
    <p className="text-teal-700 text-sm mt-1">
      जिससे संबंधित समस्या आप दर्ज करना चाहते हैं
    </p>
  </div>

  {/* Card Container */}
  <div className="flex flex-col gap-5 mt-4">
    {/* Road */}
    <button
      onClick={handleCall("Road")}
      className="w-full bg-teal-50 border border-teal-200 rounded-2xl p-4 flex flex-col items-center gap-4 active:scale-95 transition-transform"
    >
      <div className="w-16 h-16 bg-white  rounded-xl flex items-center justify-center shadow-sm">
        🛣️
      </div>

      <div className="flex flex-col text-center">
        <span className="text-lg sm:text-xl font-bold text-teal-800">
          सड़क से जुड़ी समस्या
        </span>
        <span className="text-gray-600 text-sm">
          गड्ढे, टूटी सड़क, पानी, मरम्मत आदि
        </span>
      </div>
    </button>

    {/* Electricity */}
    <button
      onClick={handleCall("Electricity")}
      className="w-full bg-teal-50 border border-teal-200 rounded-2xl p-4 flex flex-col items-center gap-4 active:scale-95 transition-transform"
    >
      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
        ⚡
      </div>

      <div className="flex flex-col text-center">
        <span className="text-lg sm:text-xl font-bold text-teal-800">
          बिजली से जुड़ी समस्या
        </span>
        <span className="text-gray-600 text-sm">
          बिजली कटौती, ट्रांसफॉर्मर, तार, मीटर आदि
        </span>
      </div>
    </button>
  </div>

  {/* Footer Info */}
  <p className="text-xs text-gray-500 text-center mt-10">
    नागरिक सेवा के लिए 🇮🇳
  </p>
</div>

    </>
  );
}
