"use client";
import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface CaptionsProps {
  captions: string[];
  className?: string;
  onStart?: () => void;
  onStop?: () => void;
  onUserUtterance?: (text: string) => void;
  onActionClick?: (action: "check-in" | "family-notifications" | "care-coordination" | "wellness-tracking") => void;
}

export default function Captions({ captions, className = "", onStart, onStop, onUserUtterance, onActionClick }: CaptionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");

  // Request microphone permission on component mount
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission("granted");
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.log("Microphone permission denied:", error);
        setMicPermission("denied");
      }
    };
    requestMicPermission();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // Update input field with interim results
        if (interimTranscript) {
          setInput(interimTranscript);
        }

        // Process final transcript
        if (finalTranscript) {
          const text = finalTranscript.trim().toLowerCase();
          
          // Detect action commands
          if (text.includes("check in") || text.includes("check-in") || text.includes("hospital")) {
            onActionClick?.("check-in");
            setInput("");
            return;
          }
          if (text.includes("family notification") || text.includes("family notifications") || text.includes("notify family")) {
            onActionClick?.("family-notifications");
            setInput("");
            return;
          }
          if (text.includes("care coordination") || text.includes("care coordination") || text.includes("caregiver")) {
            onActionClick?.("care-coordination");
            setInput("");
            return;
          }
          if (text.includes("wellness") || text.includes("wellness tracking") || text.includes("wellness check") || text.includes("analytics")) {
            onActionClick?.("wellness-tracking");
            setInput("");
            return;
          }

          // Default: send as regular message
          setInput(finalTranscript.trim());
          onUserUtterance?.(finalTranscript.trim());
          setInput("");
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setMicPermission("denied");
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Restart if still started
        if (started) {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            // Recognition already started or error
          }
        }
      };
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [started, onUserUtterance, onActionClick]);

  // Auto-scroll to bottom when new captions arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [captions]);

  const handleStart = async () => {
    if (micPermission === "denied") {
      alert("Microphone permission is required for voice interaction. Please enable it in your browser settings.");
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setStarted(true);
      onStart?.();
      
      // Start speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.log("Speech recognition already started or not available");
        }
      }
    } catch (error) {
      console.error("Failed to start voice interaction:", error);
      alert("Failed to start voice interaction. Please check your microphone permissions.");
    }
  };

  const handleStop = () => {
    setStarted(false);
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onStop?.();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onUserUtterance?.(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="p-4 rounded-xl bg-white/90 backdrop-blur shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-gray-800">Live Captions</h3>
          {isListening && (
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-600">Listening...</span>
            </div>
          )}
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
      
      {/* Chat Input and Start/Stop Buttons */}
      <div className="flex flex-col gap-3">
        {started && (
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              size="md"
              className="px-4"
            >
              Send
            </Button>
          </div>
        )}
        
        {/* Start/Stop Conversation Button */}
        <div className="flex items-center justify-center">
          {!started ? (
            <button
              onClick={handleStart}
              disabled={micPermission === "denied"}
              className="px-6 py-3 text-white font-medium rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#3769f6' }}
            >
              🎤 Start Conversation
            </button>
          ) : (
            <Button
              onClick={handleStop}
              variant="secondary"
              className="px-6 py-3"
            >
              ⏹️ Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
