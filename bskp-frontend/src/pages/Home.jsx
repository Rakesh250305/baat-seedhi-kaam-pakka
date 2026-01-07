import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col justify-center items-center px-6">
      <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-center">
        Baat Seedhi, Kaam Pakka
      </h1>

      <p className="max-w-xl text-center text-gray-300 mb-10">
        Ek digital platform jahan aap apni civic problems ko seedhe authorities
        tak pahucha sakte hain.
      </p>

      <Link
        to="/services"
        className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg transition"
      >
        Raise a Complaint
      </Link>
    </div>
  );
}
