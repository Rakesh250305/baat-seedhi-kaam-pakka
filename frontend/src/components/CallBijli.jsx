// import { useState, useRef, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import background from "../assets/images/bijli.jpg";
// import { FaCamera } from "react-icons/fa";
// import { CiCamera } from "react-icons/ci";
// import { MdCallEnd } from "react-icons/md";
// import { HiMiniSpeakerWave, HiOutlineSpeakerWave } from "react-icons/hi2";
// import { RxCross2 } from "react-icons/rx";
// import { GoCheck,GoIssueReopened } from "react-icons/go";

// const questions_dataset = [
//   "Bijli ki ky samasya hai?",
//   "Yeh samasya kab se aa rahi hai?",
//   "Isse pehle aapne koi upay ya shikayat ki thi?",
// ];

// export default function CallBijli() {
//   const [cameraOn, setCameraOn] = useState(false);
//   const [previewModal, setPreviewModal] = useState(false);
//   const [speakerOn, setSpeakerOn] = useState(false);
//   const [step, setStep] = useState(-1);
//   const [seconds, setSeconds] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [complaintId, setComplaintId] = useState("");
//   const [captured, setCaptured] = useState(null);
//   const [photoRetries, setPhotoRetries] = useState(0);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const category = location.state?.category || "Electricity";

//   const asking = useRef(false);
//   const silenceCounter = useRef(0);
//   const videoRef = useRef();

//   /** Speak Function */
//   const speak = (text, cb) => {
//     speechSynthesis.cancel();
//     const u = new SpeechSynthesisUtterance(text);
//     u.lang = "hi-IN";
//     u.rate = 1.07;
//     u.pitch = 1;
//     u.onend = cb;
//     speechSynthesis.speak(u);
//   };

//   /** Listen Function */
//   const listen = (onResult, onSilence) => {
//     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SR) return alert("Speech Recognition not supported!");

//     const r = new SR();
//     r.lang = "hi-IN";
//     r.interimResults = false;

//     r.onresult = (e) => {
//       const text = e.results[0][0].transcript.trim();
//       if (!text) onSilence();
//       else onResult(text);
//     };

//     r.onspeechend = () => r.stop();
//     r.onerror = onSilence;
//     r.start();
//   };

//   /** Ask Questions */
//   const askQuestion = (i) => {
//     if (asking.current) return;
//     asking.current = true;

//     speak(questions_dataset[i], () => {
//       listen(
//         (answer) => {
//           asking.current = false;
//           silenceCounter.current = 0;
//           setAnswers((prev) => [...prev, answer]);
//           setStep((prev) => prev + 1);
//         },
//         () => {
//           asking.current = false;
//           silenceCounter.current++;
//           if (silenceCounter.current >= 3) {
//             speak(
//               "Hume aapki taraf se koi jawab nahi mil raha hai, call end ki ja rahi hai. Dhanyavaad",
//               () => navigate("/services", { replace: true })
//             );
//             return;
//           } else {
//             speak(
//               "Maaf kijiye, awaaz saaf nahi aayi. Kya aap dobara bol sakte hain?",
//               () => setTimeout(() => askQuestion(i), 300)
//             );
//           }
//         }
//       );
//     });
//   };

//   /** Camera */
//   const startCamera = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: { facingMode: "environment" },
//     });
//     videoRef.current.srcObject = stream;
//   };

//   useEffect(() => {
//     if (cameraOn) startCamera();
//   }, [cameraOn]);

//   const capture = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

//     canvas.toBlob((blob) => {
//       setCaptured(blob);
//       setPreviewModal(true);
//     }, "image/jpeg", 0.9);
//   };

//   /** Retry Logic */
//   const handleRetry = () => {
//     if (photoRetries >= 2) {
//       speak(
//         "Aapne photo upload nahi ki. Call end ki ja rahi hai. Dhanyavaad.",
//         () => navigate("/services", { replace: true })
//       );
//       return;
//     }

//     setPhotoRetries((p) => p + 1);
//     speak("Kripya photo upload kare.", () => setCameraOn(true));
//   };

//   /** Use Photo */
//   const confirmPhoto = () => {
//     setPreviewModal(false);
//     setCameraOn(false);
//     submitWithPhoto(captured);
//   };

//   /** Submit Complaint w/ Photo */
//   const submitWithPhoto = async (fileBlob) => {
//     if (!fileBlob) {
//       if (!cameraOn) handleRetry();
//       return;
//     }

//     let locationObj = null;
//     try {
//       const pos = await new Promise((resolve, reject) =>
//         navigator.geolocation.getCurrentPosition(resolve, reject)
//       );

//       const lat = pos.coords.latitude;
//       const lng = pos.coords.longitude;

//       const res = await fetch(
//         `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&limit=1`
//       );

//       const data = await res.json();
//       const p = data.features?.[0]?.properties || {};
//       const address = [p.name, p.suburb, p.city, p.state, p.country]
//         .filter(Boolean)
//         .join(", ");
//       locationObj = { lat, lng, address: address || "Unknown location" };
//     } catch {
//       locationObj = null;
//     }

//     const form = new FormData();
//     form.append("photo", fileBlob, "complaint.jpg");
//     form.append(
//       "data",
//       JSON.stringify({
//         category,
//         qa: questions_dataset.map((q, i) => ({
//           question: q,
//           answer: answers[i] || null,
//         })),
//         timestamp: new Date().toISOString(),
//         location: locationObj,
//       })
//     );

//     axios
//       .post(`${import.meta.env.VITE_API_URL}/public/register-with-photo`, form, {
//         withCredentials: true,
//       })
//       .then((res) => {
//         const photoPath = res.data.photoPath;
//         setComplaintId(res.data.complaintId);
//         speak(
//           `Aapki complaint register ho gayi hai. Complaint ID ${res.data.complaintId}. Dhanyavaad.`,
//           endCall
//         );
//       })
//       .catch(() => {
//         speak("Photo upload mein error hua. Kripya dobara try kare.", () =>
//           setCameraOn(true)
//         );
//       });
//   };

//   const sendComplaint = () => {
//     speak(
//       "Kripya neeche bane camera button ko dabakar photo upload kare."
//     );
//     setCameraOn(true);
//   };

//   const endCall = () => {
//     speak(
//       "Aapke samay ke liye dhanyavaad. Bijli vibhag aapki seva mein hazir hai. Namaste.",
//       () => navigate("/services", { replace: true })
//     );
//   };

//   /** Timer */
//   useEffect(() => {
//     const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const formatTime = (s) => {
//     const m = Math.floor(s / 60).toString().padStart(2, "0");
//     const sec = (s % 60).toString().padStart(2, "0");
//     return `${m}:${sec}`;
//   };

//   /** Main Ask Flow */
//   useEffect(() => {
//     if (step === -1) {
//       speak(
//         "Namaste! Bijli vibhag se baat ho rahi hai. Aap apni samasya bataye.",
//         () => setStep(0)
//       );
//       return;
//     }

//     if (step >= 0 && step < questions_dataset.length) {
//       askQuestion(step);
//       return;
//     }

//     if (step === questions_dataset.length) sendComplaint();
//   }, [step]);

//   return (
//     <div
//       className="relative min-h-screen w-full flex flex-col justify-between text-white"
//       style={{
//         backgroundImage: `url(${background})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* overlay */}
//       <div className="absolute inset-0 bg-black/60" />

//       {/* Header */}
//       <header className="relative mx-4 mt-4 px-6 py-4 flex justify-between items-center rounded-xl bg-white/15 backdrop-blur-md">
//         <p className="text-lg font-semibold">Bijli ki Samasya</p>
//         <div className="text-center">
//           <p className="text-sm opacity-80">Outgoing Call</p>
//           <p className="font-mono text-lg">{formatTime(seconds)}</p>
//         </div>
//       </header>

//       {/* Complaint Success */}
//       {complaintId && (
//         <div className="mt-4 bg-white shadow-lg rounded-xl p-5 border flex flex-col items-center gap-2 text-black mx-4">
//           <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
//             <span className="text-white text-2xl font-bold">✓</span>
//           </div>
//           <h2 className="text-lg font-semibold">Complaint Registered!</h2>
//           <p className="text-gray-700">
//             Complaint ID: <span className="font-bold">{complaintId}</span>
//           </p>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="relative mb-10 flex justify-center items-center gap-10">
//         <button
//           className={`w-14 h-14 rounded-full bg-white/20 flex items-center justify-center ${
//             step !== questions_dataset.length
//               ? "opacity-50 pointer-events-none"
//               : ""
//           }`}
//           onClick={() => setCameraOn(true)}
//         >
//           {cameraOn ? <FaCamera size={20} /> : <CiCamera size={25} />}
//         </button>

//         <button
//           className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
//           onClick={endCall}
//         >
//           <MdCallEnd size={30} />
//         </button>

//         <button
//           className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
//           onClick={() => setSpeakerOn(!speakerOn)}
//         >
//           {speakerOn ? (
//             <HiMiniSpeakerWave size={27} />
//           ) : (
//             <HiOutlineSpeakerWave size={25} />
//           )}
//         </button>
//       </footer>

//       {/* CAMERA VIEW */}
// {cameraOn && (
//   <div className="fixed inset-0 bg-black flex flex-col justify-between items-center z-[99]">
    
//     {/* VIDEO FULLSCREEN */}
//     <video
//       ref={videoRef}
//       autoPlay
//       playsInline
//       className="w-full h-full object-cover"
//     />

//     {/* CONTROLS */}
//     <div className=" w-full flex flex-col items-center py-5 gap-5 bg-gradient-to-t from-black/80 to-transparent">
//       {!captured && (
//         <button
//           onClick={capture}
//           className="w-20 h-20 rounded-full bg-white"
//         />
//       )}

//       <button
//         onClick={() => {
//           setCameraOn(false);
//           setCaptured(null);
//           if (!previewModal) handleRetry();
//         }}
//         className="absolute left-10 my-2 px-5 py-3 rounded-full text-white text-lg"
//       >
//         <RxCross2 size={35}/>
//       </button>
//     </div>
//   </div>
// )}


//   {/* PREVIEW FULLSCREEN */}
// {previewModal && (
//   <div className="fixed inset-0 bg-black flex flex-col justify-between items-center z-[9999]">
    
//     <img
//       src={URL.createObjectURL(captured)}
//       className="w-full h-[90vh] object-contain bg-black"
//       alt="preview"
//     />

//     <div className="w-full flex justify-center gap-6 pb-10 bg-gradient-to-t from-black/80 to-transparent">
//       <button
//         onClick={() => {
//           setPreviewModal(false);
//           setCaptured(null);
//           setCameraOn(true);
//         }}
//         className="px-6 py-3 bg-gray-600 rounded-lg text-white text-lg"
//       >
//         <GoIssueReopened size={30} />
//       </button>

//       <button
//         onClick={confirmPhoto}
//         className="px-6 py-3 bg-green-600 rounded-lg text-white text-lg"
//       >
//         <GoCheck size={30} />

//       </button>
//     </div>
//   </div>
// )}

//     </div>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import background from "../assets/images/bijli.jpg";
import {
  FaCamera,
  FaPhone,
  FaVolumeUp,
  FaVolumeMute,
  FaMicrophone,
  FaCheckCircle,
  FaRedoAlt,
  FaVolumeDown,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BsFillMicFill } from "react-icons/bs";

const questions_dataset = [
  "कृपया अपनी बिजली की समस्या बताये",
  "आपको यह समस्या कब से आ रही है ",
  "आपने इससे पहले कोई उपाय या शिकायत की थी",
];

export default function CallBijli() {
  const [cameraOn, setCameraOn] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [step, setStep] = useState(-1);
  const [seconds, setSeconds] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [complaintId, setComplaintId] = useState("");
  const [captured, setCaptured] = useState(null);
  const [photoRetries, setPhotoRetries] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || "Electricity";

  const asking = useRef(false);
  const silenceCounter = useRef(0);
  const videoRef = useRef();

  /** Speak Function */
  const speak = (text, cb) => {
    setIsSpeaking(true);
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 1.07;
    u.pitch = 1;
    u.onend = () => {
      setIsSpeaking(false);
      cb && cb();
    };
    speechSynthesis.speak(u);
  };

  /** Listen Function */
  const listen = (onResult, onSilence) => {
    setIsListening(true);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech Recognition not supported!");

    const r = new SR();
    r.lang = "hi-IN";
    r.interimResults = false;

    r.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      setIsListening(false);
      if (!text) onSilence();
      else onResult(text);
    };

    r.onspeechend = () => r.stop();
    r.onerror = () => {
      setIsListening(false);
      onSilence();
    };
    r.start();
  };

  /** Ask Questions */
  const askQuestion = (i) => {
    if (asking.current) return;
    asking.current = true;

    speak(questions_dataset[i], () => {
      listen(
        (answer) => {
          asking.current = false;
          silenceCounter.current = 0;
          setAnswers((prev) => [...prev, answer]);
          setStep((prev) => prev + 1);
        },
        () => {
          asking.current = false;
          silenceCounter.current++;
          if (silenceCounter.current >= 3) {
            speak(
              "हमे आपकी तरफ से कोई जवाब नहीं मिल रहा है, कॉल समाप्त की जा रही है, धन्यवाद ",
              () => navigate("/services", { replace: true })
            );
            return;
          } else {
            speak(
              "माफ़ कीजियेगा, आवाज़ साफ़ नहीं आई, कृपया दोबारा बोलने का प्रयास करें ",
              () => setTimeout(() => askQuestion(i), 300)
            );
          }
        }
      );
    });
  };

  /** Camera */
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    videoRef.current.srcObject = stream;
  };

  useEffect(() => {
    if (cameraOn) startCamera();
  }, [cameraOn]);

  const capture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      setCaptured(blob);
      setPreviewModal(true);
    }, "image/jpeg", 0.9);
  };

  /** Retry Logic */
  const handleRetry = () => {
    if (photoRetries >= 2) {
      speak(
        "आपने फोटो अपलोड नहीं की है, कॉल समाप्त की जा रही है.",
        () => navigate("/services", { replace: true })
      );
      return;
    }

    setPhotoRetries((p) => p + 1);
    speak("कृपया फोटो अपलोड करें", () => setCameraOn(true));
  };

  /** Use Photo */
  const confirmPhoto = () => {
    setPreviewModal(false);
    setCameraOn(false);
    submitWithPhoto(captured);
  };

  /** Submit Complaint w/ Photo */
  const submitWithPhoto = async (fileBlob) => {
    if (!fileBlob) {
      if (!cameraOn) handleRetry();
      return;
    }

    let locationObj = null;
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const res = await fetch(
        `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&limit=1`
      );

      const data = await res.json();
      const p = data.features?.[0]?.properties || {};
      const address = [p.name, p.suburb, p.city, p.state, p.country]
        .filter(Boolean)
        .join(", ");
      locationObj = { lat, lng, address: address || "Unknown location" };
    } catch {
      locationObj = null;
    }

    const form = new FormData();
    form.append("photo", fileBlob, "complaint.jpg");
    form.append(
      "data",
      JSON.stringify({
        category,
        qa: questions_dataset.map((q, i) => ({
          question: q,
          answer: answers[i] || null,
        })),
        timestamp: new Date().toISOString(),
        location: locationObj,
      })
    );

    axios
      .post(`${import.meta.env.VITE_API_URL}/public/register-with-photo`, form, {
        withCredentials: true,
      })
      .then((res) => {
        setComplaintId(res.data.complaintId);
        speak(
          `आपकी शिकायत रजिस्टर हो गयी है, शिकायत ID ${res.data.complaintId} धन्यवाद `,
          endCall
        );
      })
      .catch(() => {
        speak(
          "फोटो अपलोड में एरर हुआ है, कृपया दोबारा प्रयास करें.",
           () =>
          setCameraOn(true)
        );
      });
  };

  const sendComplaint = () => {
    speak(
      "कृपया नीचे बने कैमरा बटन को दबा कर फोटो अपलोड करें"
    );
    setCameraOn(true);
  };

  const endCall = () => {
    speak(
      "आपके समय के लिए धन्यवाद , बिजली विभाग आपकी सेवा में हाज़िर है. नमस्ते .",
      () => navigate("/services", { replace: true })
    );
  };

  /** Timer */
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  /** Main Ask Flow */
  useEffect(() => {
    if (step === -1) {
      speak("नमस्ते बिजली विभाग से मै आपकी कैसे मदद कर सकती हूँ ? कृपया अपनी समस्या बताएं.", () => setStep(0));
      return;
    }

    if (step >= 0 && step < questions_dataset.length) {
      askQuestion(step);
      return;
    }

    if (step === questions_dataset.length) sendComplaint();
  }, [step]);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-zinc-900">
      {/* Subtle Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Header - Minimal */}
      <header className="relative z-10 px-6 py-4">
        <div className="relative mt-4 px-6 py-4 flex justify-between items-center rounded-xl bg-white/15 backdrop-blur-md">
          <div>
            <p className="text-white text-lg font-medium">बिजली की समस्या </p>
            <p className="text-sm text-gray-400">Calling...</p>

          </div>
          <div className="text-right">
            <p className="text-sm text-white">Duration</p>
            <p className="text-white font-mono text-lg tabular-nums">{formatTime(seconds)}</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {/* Avatar/Status Circle */}
        <div className="mb-8">
          <div className="relative">
            {/* Outer ring for active state */}
            {(isSpeaking || isListening) && (
              <div className="absolute -inset-4 rounded-full border-2 border-gray-600 animate-ping opacity-75" />
            )}

            {/* Main Avatar */}
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-xl border-4 border-zinc-900">
              {isSpeaking ? (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gray-300 rounded-full animate-bounce"
                      style={{
                        height: `${20 + i * 2}px`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              ) : isListening ? (
                <BsFillMicFill className="text-gray-300 text-5xl animate-pulse" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-white text-3xl font-bold">
                  SS
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-6">
          <p className="text-white text-xl font-medium mb-1">
            {isSpeaking
              ? "Speaking..."
              : isListening
              ? "Listening..."
              : "Connected"}
          </p>
         
        </div>

        {/* Complaint Success */}
        {complaintId && (
          <div className="bg-zinc-800 fixed inset-0 flex items-center justify-center h-[25vh] border border-zinc-700 rounded-xl p-6 py-20 max-w-sm w-full">
            <div className="flex flex-col items-center gap-3 text-center mt-20">
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
                <FaCheckCircle className="text-white text-3xl" />
              </div>
              <div>
                <p className="text-white text-lg font-medium mb-1">
                  Complaint Registered
                </p>
                <p className="text-gray-400 text-sm mb-2">Complaint ID</p>
                <p className="text-white text-2xl font-bold">{complaintId}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Control Panel - iPhone Style */}
      <footer className="relative z-10 pb-12 px-6">
        <div className="flex items-center justify-center gap-8">
          {/* Camera Button */}
          <button
            className={`w-16 h-16 rounded-full bg-gray-500 border-2 border-gray-500 flex items-center justify-center transition-all ${
              step !== questions_dataset.length
                ? "bg-zinc-800 opacity-40 cursor-not-allowed"
                : "bg-zinc-700 hover:bg-zinc-600 active:scale-95"
            }`}
            onClick={() => step === questions_dataset.length && setCameraOn(true)}
            disabled={step !== questions_dataset.length}
          >
            <FaCamera className="text-white text-xl" />
          </button>

          {/* End Call Button */}
          <button
            className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 flex items-center justify-center transition-all shadow-lg"
            onClick={endCall}
          >
            <FaPhone className="text-white text-2xl rotate-[-135deg]" />
          </button>

          {/* Speaker Button */}
          <button
            className="w-16 h-16 rounded-full bg-zinc-700 border-2 border-gray-500 hover:bg-zinc-600 active:scale-95 flex items-center justify-center transition-all"
            onClick={() => setSpeakerOn(!speakerOn)}
          >
            {speakerOn ? (
              <FaVolumeUp className="text-white text-xl" />
            ) : (
              <FaVolumeDown className="text-white text-xl" />
            )}
          </button>
        </div>
      </footer>

      {/* CAMERA VIEW */}
      {cameraOn && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Video */}
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Simple Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-20">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white" />
                ))}
              </div>
            </div>

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
              <p className="text-white text-sm"></p>
              <button
                onClick={() => {
                  setCameraOn(false);
                  setCaptured(null);
                  if (!previewModal) handleRetry();
                }}
                className="w-10 h-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center"
              >
                <IoMdClose className="text-white text-xl" />
              </button>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="bg-black p-8">
            <div className="flex items-center justify-center">
              {!captured && (
                <button
                  onClick={capture}
                  className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:scale-105 active:scale-95 transition-transform"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {previewModal && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
          {/* Image */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={URL.createObjectURL(captured)}
              className="max-w-full max-h-full object-contain"
              alt="preview"
            />
          </div>

          {/* Controls */}
          <div className="bg-black p-6">
            <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
              {/* Retake */}
              <button
                onClick={() => {
                  setPreviewModal(false);
                  setCaptured(null);
                  setCameraOn(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-700 hover:bg-zinc-600 active:scale-95 transition-all"
              >
                <FaRedoAlt className="text-white text-lg" />
                <span className="text-white font-medium">Retake</span>
              </button>

              {/* Confirm */}
              <button
                onClick={confirmPhoto}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 active:scale-95 transition-all"
              >
                <FaCheckCircle className="text-white text-lg" />
                <span className="text-white font-medium">Use Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}