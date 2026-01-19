import PWAInstallButton from "./PWAInstallButton";

export default function DesktopBlocked() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-3 text-teal-500">बात सीधी काम पक्का </h1>

      <p className="text-gray-300 max-w-md">
        यह ऐप केवल <span className="font-semibold">मोबाइल और टैबलेट</span> के लिए है।
        कृपया मोबाइल डिवाइस पर ओपन करें।
      </p>

        <p className="text-gray-500 mt-4 text-sm">
          आपके डिवाइस पर इंस्टॉल उपलब्ध नहीं है
        </p>
    </div>
  );
}
