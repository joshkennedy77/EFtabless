"use client";
import { useEffect, useState, useRef } from "react";

type Props = {
  avatarId?: string;
  onStart?: () => void;
  onStop?: () => void;
  onUserUtterance?: (text: string) => void;
  isRecording?: boolean;
  onConversationEnd?: () => void;
  onConversationIdChange?: (conversationId: string | null) => void;
};

const REPLICA_ID = "r62baeccd777";
const PERSONA_ID = "pb8ce5779ad5";

export default function AvatarStage({ 
  avatarId, 
  onStart, 
  onStop, 
  onUserUtterance,
  isRecording = false,
  onConversationEnd,
  onConversationIdChange
}: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tavusSessionId, setTavusSessionId] = useState<string | null>(null);
  const [tavusConversationId, setTavusConversationId] = useState<string | null>(null);
  const [tavusStreamUrl, setTavusStreamUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Function to end Tavus conversation
  const endConversation = async () => {
    if (!tavusConversationId || isEnding) return;
    
    try {
      setIsEnding(true);
      const response = await fetch(`/api/tavus?conversationId=${tavusConversationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("✅ Conversation ended");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to end conversation:", errorData);
      }
      
      // Always clear the UI regardless of API response
      setTavusStreamUrl(null);
      setTavusConversationId(null);
      setTavusSessionId(null);
      onConversationIdChange?.(null);
      onConversationEnd?.();
    } catch (err) {
      console.error("Error ending conversation:", err);
      // Still clear UI on error
      setTavusStreamUrl(null);
      setTavusConversationId(null);
      setTavusSessionId(null);
      onConversationIdChange?.(null);
      onConversationEnd?.();
    } finally {
      setIsEnding(false);
    }
  };

  // Cleanup: end conversation when component unmounts
  useEffect(() => {
    return () => {
      if (tavusConversationId && !isEnding) {
        // End conversation on unmount
        fetch(`/api/tavus?conversationId=${tavusConversationId}`, {
          method: "DELETE",
        }).catch(console.error);
      }
    };
  }, [tavusConversationId, isEnding]);

  // Initialize Tavus session
  useEffect(() => {
    const initializeTavus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/tavus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            replicaId: REPLICA_ID,
            personaId: PERSONA_ID,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Tavus API HTTP error:", response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Tavus API response:", JSON.stringify(data, null, 2));
        
        if (data.success && data.streamUrl) {
          console.log("✅ Setting stream URL:", data.streamUrl);
          setTavusSessionId(data.sessionId || data.conversationId || PERSONA_ID);
          const conversationId = data.conversationId;
          setTavusConversationId(conversationId);
          setTavusStreamUrl(data.streamUrl);
          setIsLoading(false);
          // Notify parent of conversation ID
          onConversationIdChange?.(conversationId);
        } else if (data.directEmbed && data.streamUrl) {
          // Direct embed without API key
          console.log("✅ Using direct embed URL:", data.streamUrl);
          setTavusSessionId(PERSONA_ID);
          setTavusConversationId(null);
          setTavusStreamUrl(data.streamUrl);
          setIsLoading(false);
          onConversationIdChange?.(null);
        } else if (data.streamUrl) {
          // Response has streamUrl even if success is false
          console.log("⚠️ Using stream URL (success may be false):", data.streamUrl);
          setTavusSessionId(data.sessionId || data.conversationId || PERSONA_ID);
          const conversationId = data.conversationId;
          setTavusConversationId(conversationId);
          setTavusStreamUrl(data.streamUrl);
          setIsLoading(false);
          onConversationIdChange?.(conversationId);
        } else {
          console.error("❌ Tavus API error response:", data);
          throw new Error(data.error || "Failed to initialize Tavus session - no stream URL received");
        }
      } catch (err: any) {
        console.error("Tavus initialization error:", err);
        console.error("Error details:", err);
        
        // Provide helpful error message
        let errorMessage = err.message || "Failed to load avatar";
        if (err.message?.includes("HTTP 500") || err.message?.includes("API key")) {
          errorMessage = "Tavus API key not configured. Please set TAVUS_API_KEY in your environment variables.";
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    initializeTavus();
  }, []);

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
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-indigo-900/50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-200 text-sm">Loading avatar...</p>
          </div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-indigo-900/50">
          <div className="text-center p-6 max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-red-200 text-sm mb-2 font-semibold">Failed to load avatar</p>
            <p className="text-blue-200/60 text-xs mb-4">{error}</p>
            {error.includes("API key") && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                <p className="text-yellow-200 text-xs">
                  <strong>Netlify Setup:</strong> Set <code className="bg-black/30 px-1 rounded">TAVUS_API_KEY</code> in Netlify environment variables.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : tavusStreamUrl ? (
        <div className="absolute inset-0 w-full h-full">
          {tavusStreamUrl.includes('daily.co') ? (
            // Daily.co room - use their embed format
            <iframe
              ref={iframeRef}
              src={`${tavusStreamUrl}?embed=true&hideMicButton=false&hideCamButton=false&hideJoinButton=true&hideFullScreenButton=false`}
              className="w-full h-full border-0 rounded-3xl"
              allow="microphone; camera; autoplay; encrypted-media; display-capture"
              allowFullScreen
              title="Tavus Avatar"
              style={{ minHeight: '100%' }}
            />
          ) : (
            // Other Tavus URLs
            <iframe
              ref={iframeRef}
              src={tavusStreamUrl}
              className="w-full h-full border-0 rounded-3xl"
              allow="microphone; camera; autoplay; encrypted-media; display-capture"
              allowFullScreen
              title="Tavus Avatar"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
              style={{ minHeight: '100%' }}
            />
          )}
        </div>
      ) : (
        // Fallback to placeholder if Tavus URL is not available
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300 ${
            isSpeaking ? "scale-105" : "scale-100"
          }`}
          style={{
            backgroundImage: 'url(/olivia.png)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
      )}
      
      {/* Status text overlay - positioned to cover any text */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-30 px-4">
        <div className="inline-block px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full">
          <div className="text-base font-bold text-white drop-shadow-lg">Hospital Concierge</div>
          <div className="text-xs text-blue-200/80 font-medium">
            {isLoading ? "Connecting..." : error ? "Connection Error" : "Ready to start conversation"}
          </div>
        </div>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && !tavusConversationId && (
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

      {/* End Conversation Button - positioned to not overlap with speaking indicator */}
      {tavusConversationId && !isLoading && !error && (
        <div className={`absolute top-4 z-20 ${isSpeaking ? 'right-32' : 'right-4'}`}>
          <button
            onClick={endConversation}
            disabled={isEnding}
            className="px-4 py-2 bg-red-500/80 backdrop-blur-xl border border-red-400/50 rounded-full text-white font-semibold text-sm hover:bg-red-600/80 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="End Conversation"
          >
            {isEnding ? (
              <>
                <span className="animate-spin">⟳</span>
                <span>Leaving...</span>
              </>
            ) : (
              <>
                <span>✕</span>
                <span>Leave</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
