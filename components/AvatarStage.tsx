"use client";
import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

type Props = {
  avatarId?: string;
  onStart?: () => void;
  onStop?: () => void;
  onUserUtterance?: (text: string) => void;
  isRecording?: boolean;
};

export default function AvatarStage({ 
  avatarId, 
  onStart, 
  onStop, 
  onUserUtterance,
  isRecording = false 
}: Props) {
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Request microphone permission on component mount
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission("granted");
        // Stop the stream immediately as we just needed permission
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.log("Microphone permission denied:", error);
        setMicPermission("denied");
      }
    };

    requestMicPermission();
  }, []);

  const handleStart = async () => {
    if (micPermission === "denied") {
      alert("Microphone permission is required for voice interaction. Please enable it in your browser settings.");
      return;
    }

    try {
      // Request mic permission again to ensure it's available
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setStarted(true);
      onStart?.();
    } catch (error) {
      console.error("Failed to start voice interaction:", error);
      alert("Failed to start voice interaction. Please check your microphone permissions.");
    }
  };

  const handleStop = () => {
    setStarted(false);
    setIsSpeaking(false);
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

  // Simulate speaking animation
  useEffect(() => {
    if (isRecording) {
      setIsSpeaking(true);
      const timer = setTimeout(() => setIsSpeaking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isRecording]);

  return (
    <div className="relative w-full max-w-[720px] aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur">
      {/* Avatar placeholder - replace with HeyGen iframe when ready */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white/90">
          <div className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl transition-all duration-300 ${
            isSpeaking ? "scale-110 shadow-2xl shadow-blue-500/50" : "scale-100"
          }`}>
            👤
          </div>
          <div className="text-lg font-medium">Photoreal Concierge</div>
          <div className="text-sm opacity-70">
            {started ? "Listening..." : "Avatar will appear here"}
          </div>
          {micPermission === "denied" && (
            <div className="text-xs text-red-400 mt-2">
              Microphone permission required
            </div>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="absolute left-4 bottom-4 flex items-center gap-3">
        {!started ? (
          <Button
            onClick={handleStart}
            disabled={micPermission === "denied"}
            className="px-6 py-3 bg-white text-black hover:bg-gray-100"
          >
            🎤 Start Conversation
          </Button>
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

      {/* Text input for MVP - voice input will be added later */}
      <div className="absolute right-4 bottom-4 flex gap-2 w-80">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1"
          disabled={!started}
        />
        <Button
          onClick={handleSend}
          disabled={!started || !input.trim()}
          size="md"
          className="px-4"
        >
          Send
        </Button>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-white/80">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Speaking...</span>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-4 left-4 flex items-center gap-2 text-white/80">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Recording...</span>
        </div>
      )}
    </div>
  );
}
