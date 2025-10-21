"use client";
import { useEffect, useState } from "react";
import AvatarStage from "@/components/AvatarStage";
import UiPanel from "@/components/UiPanel";
import Captions from "@/components/Captions";
import ConsentModal from "@/components/ConsentModal";
import { UiDirective } from "@/lib/schema";
import { mockRespond, resetMockServer } from "@/lib/mockServer";

export default function ConciergePage() {
  const [directives, setDirectives] = useState<UiDirective[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);

  // Check for existing consent on mount
  useEffect(() => {
    const consent = localStorage.getItem("everfriends-consent");
    if (consent === "accepted") {
      setHasConsented(true);
    } else if (consent === "declined") {
      setHasConsented(false);
    } else {
      setConsentModalOpen(true);
    }
  }, []);

  const handleConsentAccept = () => {
    setHasConsented(true);
    setConsentModalOpen(false);
  };

  const handleConsentDecline = () => {
    setHasConsented(false);
    setConsentModalOpen(false);
  };

  const recordEvent = async (kind: string, payload: any) => {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({ kind, payload }),
      });
    } catch (error) {
      console.error("Failed to record event:", error);
    }
  };

  const handleUserUtterance = async (text: string) => {
    if (!hasConsented) return;

    setIsRecording(true);
    recordEvent("user_text", { text });

    try {
      const response = await mockRespond(text);
      
      // Add captions with animation
      response.captions.forEach((caption, index) => {
        setTimeout(() => {
          setCaptions((prev) => [...prev, caption]);
        }, index * 1000); // Stagger captions
      });

      // Update directives
      setDirectives(response.envelope.directives);
      
      // Record AI response
      recordEvent("ai_response", {
        captions: response.captions,
        directives: response.envelope.directives,
      });
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setCaptions((prev) => [...prev, "Sorry, I encountered an error. Please try again."]);
    } finally {
      setIsRecording(false);
    }
  };

  const handleEmit = (event: string) => {
    recordEvent("emit", { event });
    console.log("Emitted event:", event);
    
    // Handle specific events
    if (event === "NEW_CONVERSATION") {
      resetMockServer();
      setDirectives([]);
      setCaptions([]);
    }
  };

  const handleStart = () => {
    recordEvent("session_start", { timestamp: Date.now() });
  };

  const handleStop = () => {
    recordEvent("session_stop", { timestamp: Date.now() });
  };

  if (hasConsented === false) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
            🚫
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Consent Required
          </h1>
          <p className="text-gray-600 mb-6">
            To use EverFriends, please accept our terms and enable microphone access.
          </p>
          <button
            onClick={() => setConsentModalOpen(true)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Review Terms & Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            E
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">EverFriends</h1>
            <p className="text-sm text-gray-600">A friendly concierge, powered by Human+</p>
          </div>
        </div>
        <nav className="text-sm text-gray-600 flex gap-6">
          <a 
            href="/" 
            className="hover:text-gray-900 transition-colors"
            aria-label="Back to home"
          >
            ← Home
          </a>
          <button 
            onClick={() => setConsentModalOpen(true)}
            className="hover:text-gray-900 transition-colors"
            aria-label="Privacy settings"
          >
            Privacy
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Avatar and Captions */}
          <div className="space-y-6">
            <div className="animate-fade-in">
              <AvatarStage
                onUserUtterance={handleUserUtterance}
                onStart={handleStart}
                onStop={handleStop}
                isRecording={isRecording}
              />
            </div>
            <div className="animate-fade-in">
              <Captions captions={captions} />
            </div>
          </div>

          {/* Right Column - UI Panel */}
          <div className="animate-fade-in">
            <UiPanel items={directives} onEmit={handleEmit} />
          </div>
        </div>
      </section>

      {/* Consent Modal */}
      <ConsentModal
        isOpen={consentModalOpen}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-sm text-gray-500 border-t border-gray-200 bg-white/50">
        <p>
          EverFriends MVP - Built with Next.js, TypeScript, and Tailwind CSS
        </p>
        <p className="mt-1">
          Session ID: {sessionId}
        </p>
      </footer>
    </main>
  );
}
