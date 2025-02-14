"use client";

import { useState } from "react";
import content from "./texts.json"; // adjust the path as needed

export default function Home() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  // Load any previously stored email on component mount
  // useEffect(() => {
  //   const storedEmail = localStorage.getItem("email");
  //   if (storedEmail) {
  //     setEmail(storedEmail);
  //   }
  // }, []);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleButtonClick = () => {
    localStorage.setItem("email", email);
    setFeedback(content.feedbackMessage);
    setTimeout(() => {
      setFeedback("");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="relative z-10 backdrop-filter backdrop-blur-md bg-white/60 rounded-xl shadow-lg p-10 max-w-xl w-full">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 mb-4">
          {content.title}
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          {content.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder={content.inputPlaceholder}
            value={email}
            onChange={handleInputChange}
            className="flex-1 text-black px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
          <button
            onClick={handleButtonClick}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition transform hover:scale-105"
          >
            {content.buttonText}
          </button>
        </div>
        {feedback && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center transition-opacity duration-500">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
