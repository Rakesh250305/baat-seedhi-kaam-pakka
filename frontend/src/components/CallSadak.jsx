// import { useState, useRef, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import background from "../assets/images/sadak.jpg";
// import { FaCamera } from "react-icons/fa";
// import { CiCamera } from "react-icons/ci";
// import { MdCallEnd } from "react-icons/md";
// import { HiMiniSpeakerWave, HiOutlineSpeakerWave } from "react-icons/hi2";

// const questions_dataset = [
//   "Kripya apne gaon ka naam btaye?",
//   "Aapko sadak se ky samasya hai?",
//   "Apko yeh samasya kitne samay se hai?",
// ];

// export default function CallSadak() {
//   const [cameraOn, setCameraOn] = useState(false);
//   const [speakerOn, setSpeakerOn] = useState(false);
//   const [step, setStep] = useState(-1); // -1 = welcome
//   const [seconds, setSeconds] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [complaintId, setComplaintId] = useState("");

//   const navigate = useNavigate();
//   const location = useLocation();
//   const category = location.state?.category || "Road";

//   const asking = useRef(false);
//   const silenceCounter = useRef(0);

//   /** Speak */
//   const speak = (text, cb) => {
//     speechSynthesis.cancel();
//     const u = new SpeechSynthesisUtterance(text);
//     u.lang = "hi-IN";
//     u.rate = 1.07;
//     u.pitch = 1;
//     u.onend = cb;
//     speechSynthesis.speak(u);
//   };

//   /** Listen */
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

//   /** Ask Question */
//   const askQuestion = (i) => {
//     if (asking.current) return;
//     asking.current = true;

//     const q = questions_dataset[i];
//     speak(q, () => {
//       listen(
//         (answer) => {
//           asking.current = false;
//           silenceCounter.current = 0;
//           console.log("Question", q);
//           console.log("Answer", answer);
//           setAnswers((prev) => [...prev, answer]);
//           setStep((prev) => prev + 1);
//         },
//         () => {
//           asking.current = false;
//           silenceCounter.current++;
//           if (silenceCounter.current >= 3) {
//             speak("Hume aapki taraf se koi jawab nahi mil raha hai, call end ki ja rahi hai. Dhanyavaad", () => {
//               navigate("/services", { replace: true });
//             });
//             return;
//           } else {
//     speak("Maaf kijiye, aapki awaaz saaf nahi aayi. Kya aap dobara bol sakte hain?", () => {
//       setTimeout(() => askQuestion(i), 300);
//     });
//   }
//         }
//       );
//     });
//   };

//   /** Welcome first */
//   useEffect(() => {
//     if (step === -1) {
//       speak(
//         "Namaste! Sadak samasya se mai Aapki kaise madad kr sakti hu? Kripya apni samasya bataiye.",
//         () => setStep(0)
//       );
//       return;
//     }

//     if (step >= 0 && step < questions_dataset.length) {
//       askQuestion(step);
//       return;
//     }

//     if (step === questions_dataset.length) {
//       sendComplaint();
//     }
//   }, [step]);

// //   human readable address from coords
// const getAddressFromCoords = async (lat, lng) => {
//   try {
//     const res = await fetch(
//         `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&limit=1`
//     );
    
//     const data = await res.json();

//     if (!data.features?.length) return null;

//     const p = data.features[0].properties;

//     return [
//       p.name,
//       p.suburb,
//       p.city,
//       p.state,
//       p.country
//     ].filter(Boolean).join(", ");

//   } catch (e) {
//     console.log("Address fetch failed", e);
//     return null;
//   }
// };

//   /** Final submission */
//   const sendComplaint = () => {
//      const qaPairs = questions_dataset.map((q, idx) => ({
//     question: q,
//     answer: answers[idx] || null,
//   }));

//     const payload = {
//       category,
//       qa: qaPairs,
//       status: "Pending",
//       timestamp: new Date().toISOString(),
//     };

//     navigator.geolocation.getCurrentPosition(
//      async (pos) => {
//         const lat = pos.coords.latitude;
//         const lng = pos.coords.longitude;
//         const address = await getAddressFromCoords(lat, lng);

//         payload.location = {
//           lat,
//           lng,
//           address: address || "Unknown location"
//         };
//         submit(payload);
//       },
//       () => {
//         payload.location = null;
//         submit(payload)}
//     );
//   };

// const endCall = () => {
//   speak("Aapke samay ke liye dhanyavaad. Sadak Suraksha aapki seva mein hazir hai. Namaste.", () => {
//     setTimeout(() => navigate("/services", { replace: true }), 500);
//   });
// };


// const submit = (payload) => {
//     speak("Ji theek hai, ek minute. Aapki jaankari system mein darj ki ja rahi hai…");
//   axios
//     .post("http://localhost:5001/public/register", payload)
//     .then((res) => {
//       setComplaintId(res.data.complaintId);

//       speak(
//         `Aapki complaint register kar di gayi hai. Complaint ID ${res.data.complaintId}. Dhanyavaad.`,
//         () => setTimeout(() => navigate("/services", { replace: true }), 2000)
//       );
//     })
//     .catch((err) => console.error(err));
// };


//   useEffect(() => {
//   const interval = setInterval(() => {
//     setSeconds((s) => s + 1);
//   }, 1000);

//   return () => clearInterval(interval);
// }, []);

// const formatTime = (s) => {
//   const m = Math.floor(s / 60).toString().padStart(2, "0");
//   const sec = (s % 60).toString().padStart(2, "0");
//   return `${m}:${sec}`;
// };


//   return (
//     <div
//       className="relative min-h-screen w-full flex flex-col justify-between text-white"
//       style={{
//         backgroundImage: `url(${background})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="absolute inset-0 bg-black/60" />

//       <header className="relative mx-4 mt-4 px-6 py-4 flex justify-between items-center rounded-xl bg-white/15 backdrop-blur-md">
//         <p className="text-lg font-semibold">Sadak ki Samasya</p>
//         <div className="text-center">
//           <p className="text-sm opacity-80">Outgoing Call</p>
//           <p className="font-mono text-lg">{formatTime(seconds)}</p>
//         </div>
//       </header>

//       {complaintId && (
//         <div className="mt-4 bg-white shadow-lg rounded-xl p-5 border flex flex-col items-center gap-2">
//           <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
//             <span className="text-white text-2xl font-bold">✓</span>
//           </div>
//           <h2 className="text-lg font-semibold text-gray-800">
//             Complaint Registered Successfully!
//           </h2>
//           <p className="text-gray-600">
//             Complaint ID: <span className="font-bold">{complaintId}</span>
//           </p>
//         </div>
//       )}


//       <footer className="relative mb-10 flex justify-center items-center gap-10">
//         <button
//           className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
//           onClick={() => setCameraOn(!cameraOn)}
//         >
//           {cameraOn ? <FaCamera size={20} /> : <CiCamera size={25} />}
//         </button>

//         <button
//           className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
//           onClick={() => {endCall()}}
//         >
//           <MdCallEnd size={30} />
//         </button>

//         <button
//           className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
//           onClick={() => setSpeakerOn(!speakerOn)}
//         >
//           {speakerOn ? <HiMiniSpeakerWave size={27} /> : <HiOutlineSpeakerWave size={25} />}
//         </button>
//       </footer>
//     </div>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import background from "../assets/images/sadak.jpg";
import { FaCamera } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { MdCallEnd } from "react-icons/md";
import { HiMiniSpeakerWave, HiOutlineSpeakerWave } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { GoCheck,GoIssueReopened } from "react-icons/go";

const questions_dataset = [
  "Kripya apne gaon ka naam btaye?",
  "Aapko sadak se ky samasya hai?",
  "Apko yeh samasya kitne samay se hai?",
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

  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || "Road";

  const asking = useRef(false);
  const silenceCounter = useRef(0);
  const videoRef = useRef();

  /** Speak Function */
  const speak = (text, cb) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 1.07;
    u.pitch = 1;
    u.onend = cb;
    speechSynthesis.speak(u);
  };

  /** Listen Function */
  const listen = (onResult, onSilence) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech Recognition not supported!");

    const r = new SR();
    r.lang = "hi-IN";
    r.interimResults = false;

    r.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      if (!text) onSilence();
      else onResult(text);
    };

    r.onspeechend = () => r.stop();
    r.onerror = onSilence;
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
              "Hume aapki taraf se koi jawab nahi mil raha hai, call end ki ja rahi hai. Dhanyavaad",
              () => navigate("/services", { replace: true })
            );
            return;
          } else {
            speak(
              "Maaf kijiye, awaaz saaf nahi aayi. Kya aap dobara bol sakte hain?",
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
        "Aapne photo upload nahi ki. Call end ki ja rahi hai. Dhanyavaad.",
        () => navigate("/services", { replace: true })
      );
      return;
    }

    setPhotoRetries((p) => p + 1);
    speak("Kripya photo upload kare.", () => setCameraOn(true));
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
        const photoPath = res.data.photoPath;
        setComplaintId(res.data.complaintId);
        speak(
          `Aapki complaint register ho gayi hai. Complaint ID ${res.data.complaintId}. Dhanyavaad.`,
          endCall
        );
      })
      .catch(() => {
        speak("Photo upload mein error hua. Kripya dobara try kare.", () =>
          setCameraOn(true)
        );
      });
  };

  const sendComplaint = () => {
    speak(
      "Kripya neeche bane camera button ko dabakar photo upload kare."
    );
    setCameraOn(true);
  };

  const endCall = () => {
    speak(
      "Aapke samay ke liye dhanyavaad. Sadak Suraksha aapki seva mein hazir hai. Namaste.",
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
      speak(
        "Namaste! Sadak samasya se mai Aapki kaise madad kr sakti hu? Kripya apni samasya bataiye.",
        () => setStep(0)
      );
      return;
    }

    if (step >= 0 && step < questions_dataset.length) {
      askQuestion(step);
      return;
    }

    if (step === questions_dataset.length) sendComplaint();
  }, [step]);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between text-white"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Header */}
      <header className="relative mx-4 mt-4 px-6 py-4 flex justify-between items-center rounded-xl bg-white/15 backdrop-blur-md">
        <p className="text-lg font-semibold">Sadak ki Samasya</p>
        <div className="text-center">
          <p className="text-sm opacity-80">Outgoing Call</p>
          <p className="font-mono text-lg">{formatTime(seconds)}</p>
        </div>
      </header>

      {/* Complaint Success */}
      {complaintId && (
        <div className="mt-4 bg-white shadow-lg rounded-xl p-5 border flex flex-col items-center gap-2 text-black mx-4">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">✓</span>
          </div>
          <h2 className="text-lg font-semibold">Complaint Registered!</h2>
          <p className="text-gray-700">
            Complaint ID: <span className="font-bold">{complaintId}</span>
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="relative mb-10 flex justify-center items-center gap-10">
        <button
          className={`w-14 h-14 rounded-full bg-white/20 flex items-center justify-center ${
            step !== questions_dataset.length
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
          onClick={() => setCameraOn(true)}
        >
          {cameraOn ? <FaCamera size={20} /> : <CiCamera size={25} />}
        </button>

        <button
          className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
          onClick={endCall}
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

      {/* CAMERA VIEW */}
{cameraOn && (
  <div className="fixed inset-0 bg-black flex flex-col justify-between items-center z-[99]">
    
    {/* VIDEO FULLSCREEN */}
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-full object-cover"
    />

    {/* CONTROLS */}
    <div className=" w-full flex flex-col items-center py-5 gap-5 bg-gradient-to-t from-black/80 to-transparent">
      {!captured && (
        <button
          onClick={capture}
          className="w-20 h-20 rounded-full bg-white"
        />
      )}

      <button
        onClick={() => {
          setCameraOn(false);
          setCaptured(null);
          if (!previewModal) handleRetry();
        }}
        className="absolute left-10 my-2 px-5 py-3 rounded-full text-white text-lg"
      >
        <RxCross2 size={35}/>
      </button>
    </div>
  </div>
)}


  {/* PREVIEW FULLSCREEN */}
{previewModal && (
  <div className="fixed inset-0 bg-black flex flex-col justify-between items-center z-[9999]">
    
    <img
      src={URL.createObjectURL(captured)}
      className="w-full h-[90vh] object-contain bg-black"
      alt="preview"
    />

    <div className="w-full flex justify-center gap-6 pb-10 bg-gradient-to-t from-black/80 to-transparent">
      <button
        onClick={() => {
          setPreviewModal(false);
          setCaptured(null);
          setCameraOn(true);
        }}
        className="px-6 py-3 bg-gray-600 rounded-lg text-white text-lg"
      >
        <GoIssueReopened size={30} />
      </button>

      <button
        onClick={confirmPhoto}
        className="px-6 py-3 bg-green-600 rounded-lg text-white text-lg"
      >
        <GoCheck size={30} />

      </button>
    </div>
  </div>
)}

    </div>
  );
}

