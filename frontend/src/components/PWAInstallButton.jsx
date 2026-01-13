import { useEffect, useState } from "react";

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (!deferredPrompt) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-teal-600 text-white text-center py-3 z-[9999] shadow-lg">
     
      <button
        onClick={() => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
        }}
        className="font-semibold"
      >
        📲 Install App
      </button>
    </div>
  );
}
