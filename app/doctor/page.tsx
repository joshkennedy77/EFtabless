"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import AvatarStage from "@/components/AvatarStage";
import UiPanel from "@/components/UiPanel";
import Captions from "@/components/Captions";
import ConsentModal from "@/components/ConsentModal";
import { UiDirective } from "@/lib/schema";
import { mockRespond, resetMockServer } from "@/lib/mockServer";

// Default action buttons directive for doctor
const DEFAULT_DOCTOR_ACTION_BUTTONS: UiDirective = {
  type: "card",
  id: "doctor-action-buttons",
  title: "How can I help you today?",
  body: "Select an option to get started:"
};

export default function DoctorPage() {
  const [directives, setDirectives] = useState<UiDirective[]>([DEFAULT_DOCTOR_ACTION_BUTTONS]);
  const [captions, setCaptions] = useState<string[]>([
    "Hello, I'm your Doctor's Assistant. How can I assist you today?",
    "You can interact with me using voice or by clicking the buttons below."
  ]);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [triggeredAction, setTriggeredAction] = useState<"consultation" | "prescription" | "lab-results" | "medical-history" | null>(null);
  const [tavusConversationId, setTavusConversationId] = useState<string | null>(null);

  // Generate session ID only on client side to avoid hydration mismatch
  useEffect(() => {
    setSessionId(`session_${Date.now()}`);
  }, []);

  // Check for existing consent on mount
  useEffect(() => {
    const consent = localStorage.getItem("everfriends-consent");
    if (consent === "accepted") {
      setHasConsented(true);
      // Ensure action buttons are shown (they're already in initial state)
      setDirectives([DEFAULT_DOCTOR_ACTION_BUTTONS]);
      setCaptions([
        "Hello, I'm your Doctor's Assistant. How can I assist you today?",
        "You can interact with me using voice or by clicking the buttons below."
      ]);
    } else if (consent === "declined") {
      setHasConsented(false);
    } else {
      setConsentModalOpen(true);
      // Even without consent, show buttons for accessibility preview
      // They'll be fully functional once consent is accepted
      setDirectives([DEFAULT_DOCTOR_ACTION_BUTTONS]);
      setCaptions([
        "Hello, I'm your Doctor's Assistant. How can I assist you today?",
        "Please accept the terms to interact with me using voice or buttons."
      ]);
    }
  }, []);

  const handleConsentAccept = async () => {
    setHasConsented(true);
    setConsentModalOpen(false);
    // Ensure action buttons are shown
    setDirectives([DEFAULT_DOCTOR_ACTION_BUTTONS]);
    setCaptions([
      "Hello, I'm your Doctor's Assistant. How can I assist you today?",
      "You can interact with me using voice or by clicking the buttons below."
    ]);
    
    // Request microphone permission now (within user interaction context from button click)
    try {
      console.log("🎤 Requesting microphone permission (user clicked Accept)...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log("✅ Microphone permission granted after consent");
      window.dispatchEvent(new CustomEvent('microphone-permission-granted'));
    } catch (error: any) {
      console.log("⚠️ Microphone permission not granted:", error);
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        window.dispatchEvent(new CustomEvent('microphone-permission-denied'));
      }
    }
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
    // Only block if consent was explicitly declined, not if it's null (pending)
    if (hasConsented === false) return;

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

      // Update directives - ensure action buttons always remain if not explicitly replaced
      const newDirectives = response.envelope.directives;
      // If response doesn't include action buttons and no form is open, keep them visible
      const hasActionButtons = newDirectives.some(d => d.type === "card" && (d.id === "doctor-action-buttons" || d.id === "action-buttons"));
      if (!hasActionButtons && !triggeredAction) {
        setDirectives([DEFAULT_DOCTOR_ACTION_BUTTONS, ...newDirectives]);
      } else {
        setDirectives(newDirectives);
      }
      
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
      // Keep action buttons for accessibility - always show them
      setDirectives([DEFAULT_DOCTOR_ACTION_BUTTONS]);
      setCaptions([
        "Hello, I'm your Doctor's Assistant. How can I assist you today?",
        "You can interact with me using voice or by clicking the buttons below."
      ]);
      // Note: User messages are cleared in Captions component when captions are cleared
    }
  };

  const handleActionClick = (action: "check-in" | "family-notifications" | "care-coordination" | "wellness-tracking" | "consultation" | "prescription" | "lab-results" | "medical-history" | "book-flight" | "flight-check-in" | "flight-status" | "baggage-tracking" | "account-balance" | "transfer-funds" | "bill-pay" | "transaction-history" | "loan-inquiry" | "deposit-check") => {
    // Only handle doctor-specific actions, ignore others
    if (action === "consultation" || action === "prescription" || action === "lab-results" || action === "medical-history") {
      // Trigger the action to open the form
      setTriggeredAction(action);
      
      // Emit event for logging
      const actionEvent = `ACTION:${action}`;
      handleEmit(actionEvent);
      
      // Also send as user utterance to get AI response
      handleUserUtterance(`I need to ${action.replace("-", " ")}`);
      
      // Clear trigger after a brief moment to allow re-triggering
      setTimeout(() => setTriggeredAction(null), 100);
    }
  };

  const handleStart = () => {
    recordEvent("session_start", { timestamp: Date.now() });
  };

  const handleStop = async () => {
    recordEvent("session_stop", { timestamp: Date.now() });
    // End Tavus conversation if active
    if (tavusConversationId) {
      try {
        await fetch(`/api/tavus?conversationId=${tavusConversationId}`, {
          method: "DELETE",
        });
        setTavusConversationId(null);
        setCaptions([]);
        setDirectives([DEFAULT_DOCTOR_ACTION_BUTTONS]);
      } catch (error) {
        console.error("Error ending Tavus conversation:", error);
      }
    }
  };

  if (hasConsented === false) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl flex items-center justify-center text-5xl shadow-xl">
            🚫
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Consent Required
          </h1>
          <p className="text-blue-200/80 mb-8 text-lg">
            To use Doctor's Assistant, please accept our terms and enable microphone access.
          </p>
          <button
            onClick={() => setConsentModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-xl shadow-blue-500/40 transform hover:scale-105"
          >
            Review Terms & Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <Image 
            src="/logo.png" 
            alt="EverFriends Logo" 
            width={48}
            height={48}
            className="rounded-2xl"
            priority
            unoptimized
          />
          <div>
            <h1 className="font-bold text-white text-xl tracking-tight">EverFriends</h1>
            <p className="text-sm text-blue-200/80">Doctor's Assistant • Powered by Human+</p>
          </div>
        </div>
        <nav className="text-sm text-blue-200 flex gap-4 flex-wrap items-center">
          <a 
            href="/" 
            className="hover:text-white transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-white/10"
            aria-label="Trinity Health"
          >
            Trinity Health
          </a>
          <a 
            href="/doctor" 
            className="hover:text-white transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-white/10"
            aria-label="Doctor's Assistant"
          >
            Doctor's Assistant
          </a>
          <a 
            href="/delta" 
            className="hover:text-white transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-white/10"
            aria-label="Delta Airlines Assistant"
          >
            Delta Assistant
          </a>
          <a 
            href="/bank" 
            className="hover:text-white transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-white/10"
            aria-label="Bank Concierge"
          >
            Bank Concierge
          </a>
          <a 
            href="/info" 
            className="hover:text-white transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-white/10"
            aria-label="Learn about EverFriends"
          >
            Learn More
          </a>
          <button 
            onClick={() => setConsentModalOpen(true)}
            className="hover:text-white transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-white/10"
            aria-label="Privacy settings"
          >
            Privacy
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <section className="relative z-10 container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Avatar and Captions */}
          <div className="space-y-6">
            <div className="animate-fade-in">
              <AvatarStage
                avatarId="doctor"
                mode="doctor"
                onUserUtterance={handleUserUtterance}
                onStart={handleStart}
                onStop={handleStop}
                isRecording={isRecording}
                onConversationIdChange={(id) => setTavusConversationId(id)}
                onConversationEnd={() => {
                  // Reset conversation state when Tavus conversation ends
                  handleStop();
                  setTavusConversationId(null);
                  setCaptions([]);
                  setDirectives([DEFAULT_DOCTOR_ACTION_BUTTONS]);
                }}
              />
            </div>
            <div className="animate-fade-in">
              <Captions 
                captions={captions}
                mode="doctor"
                onStart={handleStart}
                onStop={handleStop}
                onUserUtterance={handleUserUtterance}
                onActionClick={handleActionClick}
                onEndConversation={() => {
                  handleStop();
                  setCaptions([]);
                  setDirectives([DEFAULT_DOCTOR_ACTION_BUTTONS]);
                }}
              />
            </div>
          </div>

          {/* Right Column - UI Panel */}
          <div className="animate-fade-in">
            <UiPanel 
              items={directives} 
              onEmit={handleEmit} 
              triggerAction={triggeredAction}
              mode="doctor"
            />
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
      <footer className="relative z-10 mt-16 py-8 text-center text-sm text-blue-200/60 border-t border-white/5">
        <p>
          EverFriends MVP - Doctor's Assistant • Built with Next.js, TypeScript, and Tailwind CSS
        </p>
        {sessionId && (
          <p className="mt-1 text-blue-300/50">
            Session ID: {sessionId}
          </p>
        )}
      </footer>
    </main>
  );
}

