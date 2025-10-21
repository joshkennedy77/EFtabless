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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full bg-white shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
              🤖
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to EverFriends
            </h2>
            <p className="text-gray-600">
              Your friendly AI concierge for wellness and care coordination
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">🎤</span>
              <div>
                <strong>Voice Interaction:</strong> We'll use your microphone to enable voice conversations with your AI assistant.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">💬</span>
              <div>
                <strong>Conversation Recording:</strong> We record conversations to improve our service and provide better assistance.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-500 mt-1">🔒</span>
              <div>
                <strong>Privacy:</strong> Your data is encrypted and never shared with third parties without your explicit consent.
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You can change these settings anytime in your browser preferences or by clearing your browser data.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1"
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
