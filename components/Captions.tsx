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
  onEndConversation?: () => void;
}

export default function Captions({ captions, className = "", onStart, onStop, onUserUtterance, onActionClick, onEndConversation }: CaptionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [userMessages, setUserMessages] = useState<Array<{ text: string; timestamp: number }>>([]);

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
          
          // Detect action commands (but still show what user said)
          const originalText = finalTranscript.trim(); // Keep original case
          
          if (text.includes("check in") || text.includes("check-in") || text.includes("hospital")) {
            setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
            onActionClick?.("check-in");
            setInput("");
            return;
          }
          if (text.includes("family notification") || text.includes("family notifications") || text.includes("notify family")) {
            setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
            onActionClick?.("family-notifications");
            setInput("");
            return;
          }
          if (text.includes("care coordination") || text.includes("care coordination") || text.includes("caregiver")) {
            setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
            onActionClick?.("care-coordination");
            setInput("");
            return;
          }
          if (text.includes("wellness") || text.includes("wellness tracking") || text.includes("wellness check") || text.includes("analytics")) {
            setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
            onActionClick?.("wellness-tracking");
            setInput("");
            return;
          }

          // Default: send as regular message
          const finalText = finalTranscript.trim();
          setInput(finalText);
          // Add user message to captions
          setUserMessages(prev => [...prev, { text: finalText, timestamp: Date.now() }]);
          onUserUtterance?.(finalText);
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
  }, [captions, userMessages]);

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

  // Clear user messages when captions are cleared (new conversation)
  useEffect(() => {
    if (captions.length === 0 && userMessages.length > 0) {
      setUserMessages([]);
    }
  }, [captions.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    const messageText = input.trim();
    // Add user message to captions
    setUserMessages(prev => [...prev, { text: messageText, timestamp: Date.now() }]);
    onUserUtterance?.(messageText);
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
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
            <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <h3 className="font-bold text-white text-lg">Live Captions</h3>
          {isListening && (
            <div className="flex items-center gap-2 ml-auto px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-300 font-medium">Listening...</span>
            </div>
          )}
        </div>
        <div
          ref={containerRef}
          className="h-48 overflow-y-auto space-y-3 text-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          role="log"
          aria-live="polite"
          aria-label="Live conversation captions"
        >
          {captions.length === 0 && userMessages.length === 0 ? (
            <div className="text-blue-200/60 italic text-center py-4">Waiting for conversation to begin...</div>
          ) : (
            <>
              {/* Show user messages and AI captions - user messages appear immediately, AI responses follow */}
              {userMessages.map((msg, idx) => (
                <div
                  key={`user-${idx}-${msg.timestamp}`}
                  className="p-3 backdrop-blur-sm rounded-xl border shadow-lg bg-blue-500/20 border-blue-400/30 text-white ml-4 animate-fade-in"
                >
                  <span className="text-xs text-blue-300 font-medium mb-1 block">You:</span>
                  <span>{msg.text}</span>
                </div>
              ))}
              {captions.map((caption, idx) => (
                <div
                  key={`ai-${idx}`}
                  className="p-3 backdrop-blur-sm rounded-xl border shadow-lg bg-white/5 border-white/10 text-white/90 animate-fade-in"
                >
                  <span className="text-xs text-emerald-300 font-medium mb-1 block">AI:</span>
                  <span>{caption}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      
      {/* Chat Input and Start/Stop Buttons */}
      <div className="flex flex-col gap-4">
        {started && (
          <div className="flex gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl text-white placeholder:text-blue-200/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 shadow-lg"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              Send
            </button>
          </div>
        )}
        
        {/* Start/Stop Conversation Button */}
        <div className="flex items-center justify-center">
          {!started ? (
            <button
              onClick={handleStart}
              disabled={micPermission === "denied"}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/40 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              🎤 Start Conversation
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-lg"
            >
              ⏹️ Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
