import { useState } from "react";
import Button from "../components/Button";
import CallUI from "../components/CallUI";

import sadakImg from "../assets/sadak.jpg";
import bijliImg from "../assets/bijli.jpg";

export default function Services({ setFooterVisible }) {
  const [screen, setScreen] = useState("list");
  const [callData, setCallData] = useState(null);
const saveComplaint = (data) => {
    const existing =
        JSON.parse(localStorage.getItem("complaints")) || [];

    localStorage.setItem(
        "complaints",
        JSON.stringify([...existing, data])
    );
};

  // Call Screen
  if (screen === "call" && callData) {
    return (
      <CallUI
        problem={callData.title}
        background={callData.bg}
        onEnd={() => {
            saveComplaint({
                id: Date.now(),
                problem: callData.title,
                status: "Pending",
                timestamp: new Date().toISOString(),
            });

            setCallData(null);
            setScreen("list");
            setFooterVisible(true);
        }}
      />
    );
  }

  // Services List Screen
  return (
    <div className="min-h-screen pb-24 bg-gray-900 flex flex-col items-center justify-center gap-10 px-4">
      <h2 className="text-3xl lg:text-5xl font-bold text-white text-center">
        Select Your Problem
      </h2>

      <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
        <Button
          name="सड़क की समस्या"
          subtitle="Sadak Ki Samasya"
          onClick={() => {
            setCallData({
              title: "Sadak Ki Samasya",
              bg: sadakImg,
            });
            setScreen("call");
            setFooterVisible(false);
          }}
        />

        <Button
          name="बिजली की समस्या"
          subtitle="Bijli Ki Samasya"
          onClick={() => {
            setCallData({
              title: "Bijli Ki Samasya",
              bg: bijliImg,
            });
            setScreen("call");
            setFooterVisible(false);
          }}
        />
      </div>
    </div>
  );
}