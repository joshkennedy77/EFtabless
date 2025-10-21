'use client';

import { useEffect, useRef, useState } from 'react';

interface TavusAvatarProps {
  isConnected: boolean;
  isSpeaking: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export default function TavusAvatar({ 
  isConnected, 
  isSpeaking, 
  onConnectionChange 
}: TavusAvatarProps) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeTavus();
  }, []);

  const initializeTavus = async () => {
    try {
      // Tavus SDK integration
      // In a real implementation, you would:
      // 1. Load the Tavus SDK
      // 2. Initialize with your API key
      // 3. Create an avatar instance
      // 4. Connect to the avatar stream
      
      console.log('Initializing Tavus avatar...');
      
      // Simulate Tavus initialization
      setTimeout(() => {
        setIsInitialized(true);
        onConnectionChange(true);
      }, 2000);

      // Example Tavus integration (commented out for now):
      /*
      if (typeof window !== 'undefined' && window.Tavus) {
        const tavus = new window.Tavus({
          apiKey: process.env.NEXT_PUBLIC_TAVUS_API_KEY,
          container: avatarRef.current,
          avatarId: 'your-avatar-id',
          onReady: () => {
            setIsInitialized(true);
            onConnectionChange(true);
          },
          onError: (error) => {
            console.error('Tavus error:', error);
            onConnectionChange(false);
          }
        });
      }
      */
    } catch (error) {
      console.error('Failed to initialize Tavus:', error);
      onConnectionChange(false);
    }
  };

  const startSpeaking = () => {
    // Trigger avatar speaking animation
    if (avatarRef.current) {
      avatarRef.current.classList.add('animate-pulse');
    }
  };

  const stopSpeaking = () => {
    // Stop avatar speaking animation
    if (avatarRef.current) {
      avatarRef.current.classList.remove('animate-pulse');
    }
  };

  useEffect(() => {
    if (isSpeaking) {
      startSpeaking();
    } else {
      stopSpeaking();
    }
  }, [isSpeaking]);

  return (
    <div className="relative w-96 h-96">
      {/* Avatar Container */}
      <div 
        ref={avatarRef}
        className={`w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center transition-all duration-300 ${
          isSpeaking ? 'scale-105 shadow-2xl shadow-purple-500/50' : 'scale-100'
        }`}
      >
        {isInitialized && isConnected ? (
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center relative overflow-hidden">
            {/* Tavus Avatar would be rendered here */}
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-sm font-medium">Tavus Avatar</p>
                <p className="text-gray-400 text-xs">Photoreal Concierge</p>
              </div>
            </div>
            
            {/* Speaking indicator */}
            {isSpeaking && (
              <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping"></div>
            )}
          </div>
        ) : (
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-600 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Loading Avatar...</p>
            </div>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="absolute -bottom-2 -right-2">
        <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-white' : 'bg-white'
          }`}></div>
        </div>
      </div>
    </div>
  );
}
