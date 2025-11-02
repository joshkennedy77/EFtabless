"use client";
import { useState, useEffect } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ConsentModal({ isOpen, onAccept, onDecline }: ConsentModalProps) {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  // Check for existing consent on mount
  useEffect(() => {
    const consent = localStorage.getItem("everfriends-consent");
    if (consent === "accepted") {
      setHasConsented(true);
    } else if (consent === "declined") {
      setHasConsented(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("everfriends-consent", "accepted");
    setHasConsented(true);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem("everfriends-consent", "declined");
    setHasConsented(false);
    onDecline();
  };

  if (!isOpen || hasConsented !== null) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-3xl shadow-2xl p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl shadow-blue-500/30">
              🤖
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Welcome to EverFriends
            </h2>
            <p className="text-blue-200/80 text-sm">
              Your friendly AI concierge for wellness and care coordination
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-blue-400 text-lg mt-0.5">🎤</span>
              <div className="text-blue-200/90">
                <strong className="text-white font-semibold">Voice Interaction:</strong> We'll use your microphone to enable voice conversations with your AI assistant.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 text-lg mt-0.5">💬</span>
              <div className="text-blue-200/90">
                <strong className="text-white font-semibold">Conversation Recording:</strong> We record conversations to improve our service and provide better assistance.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-indigo-400 text-lg mt-0.5">🔒</span>
              <div className="text-blue-200/90">
                <strong className="text-white font-semibold">Privacy:</strong> Your data is encrypted and never shared with third parties without your explicit consent.
              </div>
            </div>
          </div>

          <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4">
            <p className="text-sm text-blue-200">
              <strong className="text-white">Note:</strong> You can change these settings anytime in your browser preferences or by clearing your browser data.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDecline}
              className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-lg shadow-blue-500/30 transform hover:scale-[1.02]"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
