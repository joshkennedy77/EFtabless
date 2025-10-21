"use client";
import { useEffect, useRef } from "react";

interface CaptionsProps {
  captions: string[];
  className?: string;
}

export default function Captions({ captions, className = "" }: CaptionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new captions arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [captions]);

  return (
    <div className={`p-4 rounded-xl bg-white/90 backdrop-blur shadow-lg ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="font-semibold text-gray-800">Live Captions</h3>
      </div>
      <div
        ref={containerRef}
        className="h-24 overflow-y-auto space-y-2 text-sm text-gray-700"
        role="log"
        aria-live="polite"
        aria-label="Live conversation captions"
      >
        {captions.length === 0 ? (
          <div className="text-gray-500 italic">Waiting for conversation to begin...</div>
        ) : (
          captions.map((caption, index) => (
            <div
              key={index}
              className="p-2 bg-gray-50 rounded-lg border-l-2 border-blue-500"
            >
              {caption}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
