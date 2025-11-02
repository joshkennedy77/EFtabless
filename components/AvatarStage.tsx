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
    <div className="relative w-full max-w-[720px] aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-indigo-900/50 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
      {/* Avatar with olivia.png background */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300 ${
          isSpeaking ? "scale-105" : "scale-100"
        }`}
        style={{
          backgroundImage: 'url(/olivia.png)',
        }}
      >
        {/* Modern overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>
      
      {/* Status text overlay - positioned to cover any text in the image */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-30 px-4">
        <div className="inline-block px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full">
          <div className="text-base font-bold text-white drop-shadow-lg">Hospital Concierge</div>
          <div className="text-xs text-blue-200/80 font-medium">
            Ready to start conversation
          </div>
        </div>
      </div>



      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-full z-20">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
          <span className="text-xs text-emerald-200 font-semibold">Speaking...</span>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-full z-20">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
          <span className="text-xs text-red-200 font-semibold">Recording...</span>
        </div>
      )}
    </div>
  );
}
