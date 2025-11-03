"use client";
import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface CaptionsProps {
  captions: string[];
  className?: string;
  mode?: "concierge" | "doctor" | "delta" | "bank";
  onStart?: () => void;
  onStop?: () => void;
  onUserUtterance?: (text: string) => void;
  onActionClick?: (action: "check-in" | "family-notifications" | "care-coordination" | "wellness-tracking" | "consultation" | "prescription" | "lab-results" | "medical-history" | "book-flight" | "flight-check-in" | "flight-status" | "baggage-tracking" | "account-balance" | "transfer-funds" | "bill-pay" | "transaction-history" | "loan-inquiry" | "deposit-check") => void;
  onEndConversation?: () => void;
  onConsentAccepted?: () => void; // Called when consent is accepted to request mic permission
}

export default function Captions({ captions, className = "", mode = "concierge", onStart, onStop, onUserUtterance, onActionClick, onEndConversation, onConsentAccepted }: CaptionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const startedRef = useRef(false);
  const autoStartAttemptedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [userMessages, setUserMessages] = useState<Array<{ text: string; timestamp: number }>>([]);

  // Check microphone permission status (but don't request yet - browsers require user interaction)
  useEffect(() => {
    const checkPermission = () => {
      // Check if we already have permission by querying the permission API
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
          if (result.state === 'granted') {
            setMicPermission("granted");
          } else if (result.state === 'denied') {
            setMicPermission("denied");
          } else {
            setMicPermission("prompt");
          }
          
          // Listen for permission changes
          result.onchange = () => {
            if (result.state === 'granted') {
              setMicPermission("granted");
            } else if (result.state === 'denied') {
              setMicPermission("denied");
            }
          };
        }).catch(() => {
          // Permission API not supported, keep as "prompt"
          setMicPermission("prompt");
        });
      } else {
        // Permission API not available, keep as "prompt"
        setMicPermission("prompt");
      }
    };
    
    checkPermission();
    
    // Also check when consent changes (triggered by localStorage event)
    const handleStorageChange = () => {
      const consent = localStorage.getItem("everfriends-consent");
      if (consent === "accepted") {
        // Small delay to let permission request complete
        setTimeout(checkPermission, 500);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events when permission is granted/denied
    const handlePermissionGranted = () => {
      console.log("📢 Received microphone-permission-granted event");
      setMicPermission("granted");
      // Force a permission check update
      setTimeout(() => {
        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
            console.log("🔍 Permission state after event:", result.state);
            if (result.state === 'granted') {
              setMicPermission("granted");
            }
          });
        }
      }, 100);
    };
    const handlePermissionDenied = () => {
      console.log("📢 Received microphone-permission-denied event");
      setMicPermission("denied");
    };
    
    window.addEventListener('microphone-permission-granted', handlePermissionGranted);
    window.addEventListener('microphone-permission-denied', handlePermissionDenied);
    
    // Also check periodically if localStorage changed (for same-tab updates)
    const interval = setInterval(() => {
      const consent = localStorage.getItem("everfriends-consent");
      if (consent === "accepted" && micPermission === "prompt") {
        checkPermission();
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('microphone-permission-granted', handlePermissionGranted);
      window.removeEventListener('microphone-permission-denied', handlePermissionDenied);
      clearInterval(interval);
    };
  }, [micPermission]);

  // Request microphone permission when consent is accepted (user interaction context)
  // This is exposed so parent component can call it when consent modal is accepted
  const requestMicPermission = async () => {
    try {
      console.log("🎤 Requesting microphone permission (user interaction)...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
      console.log("✅ Microphone permission granted");
      return true;
    } catch (error: any) {
      console.log("❌ Microphone permission denied:", error);
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setMicPermission("denied");
      }
      return false;
    }
  };

  // Expose permission request function to parent via callback
  useEffect(() => {
    if (onConsentAccepted) {
      // Create a function that can be called from parent
      (window as any).__requestMicPermission = requestMicPermission;
      return () => {
        delete (window as any).__requestMicPermission;
      };
    }
  }, [onConsentAccepted]);

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
          
          // Delta Airlines mode voice commands
          if (mode === "delta") {
            if (text.includes("book flight") || text.includes("book a flight") || text.includes("reserve flight") || text.includes("search flight") || text.includes("find flight") || text.includes("flight booking")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("book-flight");
              setInput("");
              return;
            }
            if (text.includes("check in") || text.includes("check-in") || text.includes("flight check in") || text.includes("check in for flight") || text.includes("check in for my flight")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("flight-check-in");
              setInput("");
              return;
            }
            if (text.includes("flight status") || text.includes("check flight status") || text.includes("where is my flight") || text.includes("flight info") || text.includes("flight information") || text.includes("status of flight")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("flight-status");
              setInput("");
              return;
            }
            if (text.includes("baggage") || text.includes("baggage tracking") || text.includes("track baggage") || text.includes("where is my bag") || text.includes("lost luggage") || text.includes("track my bag") || text.includes("luggage")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("baggage-tracking");
              setInput("");
              return;
            }
          }
          
          // Doctor's Assistant mode voice commands
          if (mode === "doctor") {
            if (text.includes("consultation") || text.includes("schedule consultation") || text.includes("appointment") || text.includes("see doctor") || text.includes("book appointment")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("consultation");
              setInput("");
              return;
            }
            if (text.includes("prescription") || text.includes("refill") || text.includes("medication") || text.includes("prescription request") || text.includes("need prescription")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("prescription");
              setInput("");
              return;
            }
            if (text.includes("lab results") || text.includes("lab test") || text.includes("test results") || text.includes("blood work") || text.includes("lab report")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("lab-results");
              setInput("");
              return;
            }
            if (text.includes("medical history") || text.includes("medical records") || text.includes("patient records") || text.includes("health records") || text.includes("medical file")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("medical-history");
              setInput("");
              return;
            }
          }

          if (mode === "bank") {
            if (text.includes("account balance") || text.includes("balance") || text.includes("check balance") || text.includes("account balance inquiry") || text.includes("show balance")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("account-balance");
              setInput("");
              return;
            }
            if (text.includes("transfer funds") || text.includes("transfer money") || text.includes("send money") || text.includes("make a transfer") || text.includes("wire transfer")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("transfer-funds");
              setInput("");
              return;
            }
            if (text.includes("bill pay") || text.includes("pay bill") || text.includes("pay bills") || text.includes("pay a bill") || text.includes("schedule payment")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("bill-pay");
              setInput("");
              return;
            }
            if (text.includes("transaction history") || text.includes("transactions") || text.includes("history") || text.includes("recent transactions") || text.includes("statement")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("transaction-history");
              setInput("");
              return;
            }
            if (text.includes("loan") || text.includes("loan inquiry") || text.includes("apply for loan") || text.includes("loan application") || text.includes("loan status")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("loan-inquiry");
              setInput("");
              return;
            }
            if (text.includes("deposit check") || text.includes("deposit a check") || text.includes("mobile deposit") || text.includes("check deposit")) {
              setUserMessages(prev => [...prev, { text: originalText, timestamp: Date.now() }]);
              onActionClick?.("deposit-check");
              setInput("");
              return;
            }
          }

          // Concierge mode voice commands (default)
          if (mode === "concierge") {
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
        // Restart if still started - use ref to get current value
        if (startedRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsListening(true);
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
  }, [started, onUserUtterance, onActionClick, mode]);

  // Sync startedRef with started state
  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  // Auto-start speech recognition when permission is granted and consent is accepted
  // This effect watches for when micPermission becomes "granted"
  useEffect(() => {
    console.log("🔍 Auto-start effect triggered", { 
      micPermission, 
      autoStartAttempted: autoStartAttemptedRef.current,
      started,
      startedRef: startedRef.current,
      hasRecognition: !!recognitionRef.current
    });

    // Reset autoStartAttemptedRef when permission changes back to prompt (new session)
    if (micPermission === "prompt") {
      autoStartAttemptedRef.current = false;
      return;
    }

    // Only attempt if permission is granted and we haven't tried yet
    if (micPermission !== "granted") {
      console.log("⏸️ Auto-start skipped: micPermission is", micPermission);
      return;
    }
    
    if (autoStartAttemptedRef.current) {
      console.log("⏸️ Auto-start skipped: already attempted");
      return;
    }
    
    if (startedRef.current || started) {
      console.log("⏸️ Auto-start skipped: already started");
      return;
    }
    
    if (!recognitionRef.current) {
      console.log("⏸️ Auto-start skipped: recognition not initialized");
      return;
    }

    const consent = localStorage.getItem("everfriends-consent");
    if (consent !== "accepted") {
      console.log("⏸️ Auto-start skipped: consent not accepted, consent is:", consent);
      return;
    }

    // Check if speech recognition is available
    const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const hasSpeechRecognition = typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
    
    console.log("🔍 Speech recognition check", { isSecureContext, hasSpeechRecognition });
    
    if (!hasSpeechRecognition || !isSecureContext) {
      console.log("⏸️ Auto-start skipped: speech recognition not available");
      autoStartAttemptedRef.current = true;
      return;
    }

    const autoStart = async () => {
      console.log("⏳ Auto-start: waiting 500ms before starting...");
      // Small delay to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (startedRef.current || started || !recognitionRef.current) {
        console.log("⏸️ Auto-start aborted: state changed during delay");
        return;
      }

      console.log("🚀 Auto-starting speech recognition NOW...");
      autoStartAttemptedRef.current = true;
      
      try {
        // Verify we have permission
        console.log("🔍 Verifying microphone permission...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log("✅ Microphone permission verified");
        
        // Start recognition
        startedRef.current = true;
        setStarted(true);
        onStart?.();

        if (recognitionRef.current) {
          try {
            console.log("🎤 Starting speech recognition object...");
            recognitionRef.current.start();
            console.log("✅ Auto-started speech recognition successfully!");
            setIsListening(true);
          } catch (e: any) {
            console.error("❌ Failed to start recognition object:", e);
            startedRef.current = false;
            setStarted(false);
            autoStartAttemptedRef.current = false; // Allow retry via button
          }
        }
      } catch (error: any) {
        console.error("❌ Auto-start microphone access failed:", error);
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setMicPermission("denied");
        }
        startedRef.current = false;
        setStarted(false);
        autoStartAttemptedRef.current = false; // Allow retry via button
      }
    };

    autoStart();
  }, [micPermission, started, onStart]);


  // Auto-scroll to bottom when new captions arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [captions, userMessages]);

  const handleStart = async () => {
    console.log("🎯 handleStart called", { 
      hasRecognition: !!recognitionRef.current, 
      started, 
      micPermission,
      startedRef: startedRef.current 
    });
    
    if (!recognitionRef.current) {
      alert("Speech recognition is not available in your browser. Please use Chrome or Edge.");
      return;
    }
    
    if (started || startedRef.current) {
      console.log("⏸️ Already started, skipping");
      return;
    }
    
    try {
      // ALWAYS request microphone permission when user clicks start
      console.log("🎤 Requesting microphone permission (user clicked Start)...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log("✅ Microphone permission granted via getUserMedia");
      setMicPermission("granted");
      
      // Dispatch event to update other components
      window.dispatchEvent(new CustomEvent('microphone-permission-granted'));
      
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      startedRef.current = true;
      setStarted(true);
      onStart?.();
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          console.log("✅ Speech recognition started successfully!");
        } catch (e: any) {
          console.error("❌ Failed to start recognition object:", e);
          alert(`Failed to start speech recognition: ${e.message || e.name || 'Unknown error'}`);
          startedRef.current = false;
          setStarted(false);
        }
      }
    } catch (error: any) {
      console.error("❌ Failed to get microphone access:", error);
      setMicPermission("denied");
      window.dispatchEvent(new CustomEvent('microphone-permission-denied'));
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        alert("Microphone access was denied. Please allow microphone access in your browser settings and try again.");
      } else if (error.name === "NotFoundError") {
        alert("No microphone found. Please connect a microphone and try again.");
      } else {
        alert(`Failed to access microphone: ${error.message || error.name || 'Unknown error'}`);
      }
    }
  };

  const handleStop = () => {
    startedRef.current = false;
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

