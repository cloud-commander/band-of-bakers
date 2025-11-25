"use client";

import { useState, useEffect } from "react";
import { QUOTE_ROTATION_INTERVAL_MS } from "@/lib/constants/app";
import { quotes } from "@/lib/quotes";

export function QuotesDisplay() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    };

    // Change quote every 8 seconds
    const interval = setInterval(getRandomQuote, QUOTE_ROTATION_INTERVAL_MS);

    // Set initial random quote
    getRandomQuote();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 max-w-sm z-10">
      <div className="bg-white/90 backdrop-blur-sm border border-orange-100 rounded-lg p-4 shadow-lg">
        <div className="relative">
          {/* Decorative quote mark */}
          <div className="absolute -top-2 -left-1 text-4xl text-orange-300 font-serif">&ldquo;</div>

          <blockquote className="text-sm text-gray-700 italic leading-relaxed pl-6">
            {currentQuote.text}
          </blockquote>

          <div className="mt-2 pl-6">
            <cite className="text-xs text-orange-600 font-medium not-italic">
              — {currentQuote.author}
            </cite>
            <div className="text-xs text-gray-500 mt-1">{currentQuote.category}</div>
          </div>
        </div>

        {/* Subtle decorative element */}
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-br from-orange-200 to-orange-300 rounded-tl-lg"></div>
      </div>

      {/* Floating bread emoji decoration */}
      <div className="absolute -top-2 -right-2 text-lg animate-bounce">🍞</div>
    </div>
  );
}
