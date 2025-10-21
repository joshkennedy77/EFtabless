'use client';

import { useState, useEffect, useRef } from 'react';
import ConsentModal from '@/components/ConsentModal';

export default function ConciergePage() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if consent was already given
    const hasConsent = localStorage.getItem('everfriends-consent') === 'accepted';
    setConsentGiven(hasConsent);

    // Initialize Tavus connection
    setTimeout(() => {
      setTavusConnected(true);
    }, 1000);
  }, []);

  const handleConsentAccept = () => {
    localStorage.setItem('everfriends-consent', 'accepted');
    setConsentGiven(true);
  };

  const handleConsentDecline = () => {
    localStorage.setItem('everfriends-consent', 'declined');
    setConsentGiven(false);
  };

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;

    const messageId = Date.now().toString();
    const userMessage = {
      id: messageId,
      type: 'user' as const,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: `I received your message: "${input}". How can I help you today?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Trigger avatar speaking
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 1000);

    setUserInput('');
  };

  const handleMicToggle = () => {
    setIsListening(!isListening);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      handleUserInput(userInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!consentGiven) {
    return <ConsentModal isOpen={true} onAccept={handleConsentAccept} onDecline={handleConsentDecline} />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Full-screen background with Olivia image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/olivia.png)',
        }}
      ></div>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      

      {/* Start Conversation Button */}
      {messages.length === 0 && (
        <button
          onClick={() => handleUserInput("Hello!")}
          className="absolute bottom-4 left-4 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
        >
          Start a Conversation
        </button>
      )}

      {/* Overlaid Chat Interface */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Chat Messages */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 max-h-96 overflow-y-auto">
            {messages.length > 0 && (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Controls */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 bg-black/80 backdrop-blur-sm rounded-2xl p-4">
            <button
              onClick={handleMicToggle}
              className={`p-3 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or use voice..."
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {isListening && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors duration-200"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Live Captions */}
      <div className="absolute top-6 left-6 right-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 max-w-2xl">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Live Captions</span>
          </div>
          <p className="text-gray-300 text-sm">
            {isListening ? 'Listening...' : 'Waiting for conversation to begin...'}
          </p>
        </div>
      </div>
    </div>
  );
}