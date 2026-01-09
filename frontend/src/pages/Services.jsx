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
    <div className="min-h-screen pb-24 bg-gray-900 flex flex-col items-center justify-center gap-10 px-4">
      <h2 className="text-3xl lg:text-5xl font-bold text-white text-center">
        Select Your Problem
      </h2>

      <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
        {/* Road Problem */}
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

        {/* Electricity Problem */}
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
    </div>
    
    </>
  );
}
