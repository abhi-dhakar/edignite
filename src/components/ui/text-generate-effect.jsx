// components/ui/text-generate-effect.jsx
"use client";
import { useEffect, useState } from "react";

export const TextGenerateEffect = ({ words, className }) => {
  const [wordArray, setWordArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const wordsArray = words.split(" ");
    setWordArray(wordsArray);
  }, [words]);

  useEffect(() => {
    if (currentIndex < wordArray.length) {
      const timeout = setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 80);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, wordArray]);

  return (
    <div className={className}>
      {wordArray.map((word, index) => (
        <span
          key={index}
          className={`inline-block ${
            index <= currentIndex
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          } transition-all duration-300`}
          style={{
            transitionDelay: `${index * 80}ms`,
          }}
        >
          {word}{" "}
        </span>
      ))}
    </div>
  );
};