import { useState } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

export default function Status() {
  const [complaintId, setComplaintId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dark } = useTheme();

  const statusSteps = ["pending", "in progress", "resolved"];

  const fetchStatus = async () => {
    if (!complaintId.trim()) return;

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/public/${complaintId}`);
      setData(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      setError("शिकायत नहीं मिली");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchStatus();
    }
  };

  let activeIndex = -1;
  if (data?.status) {
    const normalized = data.status.trim().toLowerCase();
    activeIndex = statusSteps.indexOf(normalized);
  }

  const getCategoryIcon = (category) => {
    if (category === "Electricity") {
      return "⚡";
    }
    return "🛣️";
  };

  const getCategoryText = (category) => {
    if (category === "Electricity") {
      return "बिजली से जुड़ी समस्या";
    }
    return "सड़क से जुड़ी समस्या";
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      dark 
        ? "bg-gray-900" 
        : "bg-gray-100"
    } p-6 pt-10 pb-24`}>
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 animate-fadeIn">
        <h1 className={`text-3xl font-bold mb-2 ${
          dark 
            ? "text-teal-500" 
            : "text-teal-800"
        }`}>
          अपनी शिकायत जानें
        </h1>
        <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
          अपनी शिकायत की स्थिति ट्रैक करें
        </p>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto mb-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          dark 
            ? "bg-gray-800 border border-gray-700" 
            : "bg-white border border-gray-200"
        }`}>
          <div className="flex gap-3 p-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ELEC-000015"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 outline-none font-mono text-sm tracking-wider ${
                  dark
                    ? "bg-gray-900 text-teal-500 border-2 border-gray-700 focus:border-teal-700 placeholder-gray-600"
                    : "bg-gray-50 text-teal-800 border-2 border-gray-200 focus:border-teal-700 placeholder-gray-400"
                }`}
              />
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                complaintId ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-200`}>
                <span className="text-teal-500">✓</span>
              </div>
            </div>
            <button
              onClick={fetchStatus}
              disabled={loading || !complaintId.trim()}
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                dark
                  ? "bg-teal-700 hover:bg-teal-600"
                  : "bg-teal-700 hover:bg-teal-600"
              }`}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </span>
              ) : (
                "चेक करें"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className={`inline-block p-4 rounded-full ${
            dark ? "bg-gray-800" : "bg-white"
          } mb-4`}>
            <svg className="animate-spin h-8 w-8 text-teal-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className={`text-lg font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
            चेक कर रहे हैं...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-2xl mx-auto animate-shake">
          <div className={`rounded-2xl p-6 border ${
            dark
              ? "bg-gray-800 border-gray-700 text-red-400"
              : "bg-white border-gray-200 text-red-600"
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Display */}
      {data && (
        <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">
          
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-1 w-12 rounded-full ${
              dark ? "bg-teal-500" : "bg-teal-700"
            }`} />
            <h2 className={`text-xl font-bold ${
              dark ? "text-gray-100" : "text-gray-800"
            }`}>
              शिकायत की स्थिति
            </h2>
          </div>

          {/* Main Info Card */}
          <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group relative overflow-hidden ${
            dark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-100"
          }`}>
            
            <div className="relative space-y-4">
              <div>
                <p className={`text-sm font-medium mb-2 ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}>
                  टिकट आईडी
                </p>
                <p className={`text-2xl font-bold ${
                  dark ? "text-teal-500" : "text-teal-800"
                } font-mono tracking-wide border-b-2 pb-1 w-fit ${
                  dark ? "border-teal-500" : "border-teal-800"
                }`}>
                  #{data.complaintId}
                </p>
              </div>

              <div className={`flex items-center gap-3 py-3 px-4 rounded-xl ${
                dark ? "bg-gray-900" : "bg-gray-50"
              }`}>
                <span className="text-3xl">{getCategoryIcon(data.category)}</span>
                <span className={`font-medium ${
                  dark ? "text-gray-200" : "text-gray-700"
                }`}>
                  {getCategoryText(data.category)}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    dark ? "text-teal-500" : "text-teal-700"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className={`text-sm font-medium ${
                      dark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      तारीख
                    </p>
                    <p className={`font-medium ${
                      dark ? "text-gray-200" : "text-gray-800"
                    }`}>
                      {new Date(data.timestamp).toLocaleDateString("hi-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                {data.location && (
                  <div className="flex items-start gap-3">
                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      dark ? "text-teal-500" : "text-teal-700"
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className={`text-sm font-medium ${
                        dark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        पता
                      </p>
                      <p className={`font-medium ${
                        dark ? "text-gray-200" : "text-gray-800"
                      }`}>
                        {data.location.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Progress Card */}
          <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
            dark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-100"
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                dark ? "bg-teal-700" : "bg-teal-700"
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-lg font-bold ${
                dark ? "text-teal-500" : "text-teal-800"
              }`}>
                स्थिति प्रगति
              </h3>
            </div>

            <div className="space-y-4">
              {statusSteps.map((step, idx) => {
                const active = activeIndex >= idx;
                const isLast = idx === statusSteps.length - 1;
                
                return (
                  <div key={idx} className="relative">
                    <div className="flex items-center gap-4">
                      {/* Status Indicator */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                          active
                            ? dark 
                              ? "bg-teal-600 border-2 border-teal-500" 
                              : "bg-teal-600 border-2 border-teal-700"
                            : dark
                            ? "bg-gray-700 border-2 border-gray-600"
                            : "bg-white border-2 border-gray-300"
                        }`}>
                          {active ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className={`w-2 h-2 rounded-full ${
                              dark ? "bg-gray-500" : "bg-gray-400"
                            }`} />
                          )}
                        </div>
                        
                        {/* Connecting Line */}
                        {!isLast && (
                          <div className={`absolute left-1/2 top-9.2 w-0.5 h-9 -translate-x-1/2 transition-all duration-500 ${
                            active && activeIndex > idx
                              ? dark ? "bg-teal-600" : "bg-teal-700"
                              : dark
                              ? "bg-gray-700"
                              : "bg-gray-300"
                          }`} />
                        )}
                      </div>

                      {/* Status Text */}
                      <div className="flex-1 py-2">
                        <p className={`font-semibold capitalize transition-all duration-300 ${
                          active
                            ? dark
                              ? "text-teal-500 text-lg"
                              : "text-teal-800 text-lg"
                            : dark
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}>
                          {step}
                        </p>
                        {active && activeIndex === idx && (
                          <p className={`text-sm mt-1 animate-fadeIn ${
                            dark ? "text-gray-400" : "text-gray-600"
                          }`}>
                            वर्तमान स्थिति
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Officer Notes */}
          {data.officerNote && (
            <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
              dark
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            } animate-slideUp`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  dark ? "bg-teal-700" : "bg-teal-700"
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-bold pt-2 ${
                  dark ? "text-teal-500" : "text-teal-800"
                }`}>
                  अधिकारी टिप्पणी
                </h3>
              </div>
              <p className={`pl-13 leading-relaxed ${
                dark ? "text-gray-300" : "text-gray-700"
              }`}>
                {data.officerNote}
              </p>
            </div>
          )}

          {/* QA Responses */}
          {data.qa?.length > 0 && (
            <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
              dark
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            } animate-slideUp`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  dark ? "bg-teal-700" : "bg-teal-700"
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-bold ${
                  dark ? "text-teal-500" : "text-teal-800"
                }`}>
                  यूजर जानकारी
                </h3>
              </div>
              <div className="space-y-3 pl-2">
                {data.qa.map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                      dark ? "bg-gray-900" : "bg-gray-50"
                    }`}>
                    <p className={`text-sm font-medium mb-1 ${
                      dark ? "text-teal-500" : "text-teal-800"
                    }`}>
                      {item.question}
                    </p>
                    <p className={`${
                      dark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-8 pb-4">
            <p className={`text-sm flex items-center justify-center gap-2 ${
              dark ? "text-gray-500" : "text-gray-600"
            }`}>
              <span>नागरिक सेवा के लिए</span>
              <span className="text-lg">🇮🇳</span>
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}