"use client";
import { useEffect, useState } from "react";

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
  const [isSpeaking, setIsSpeaking] = useState(false);

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
      {/* Avatar with olivia.png background */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300 ${
          isSpeaking ? "scale-105" : "scale-100"
        }`}
        style={{
          backgroundImage: 'url(/olivia.png)',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Status text overlay */}
      <div className="absolute bottom-20 left-0 right-0 text-center text-white/90 z-10">
        <div className="text-lg font-medium drop-shadow-lg">Photoreal Concierge</div>
        <div className="text-sm opacity-90 drop-shadow-lg">
          Ready to start conversation
        </div>
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
