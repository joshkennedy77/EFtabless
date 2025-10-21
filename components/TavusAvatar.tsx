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
    <div className="relative w-full h-full">
      {/* Clickable Olivia Avatar */}
      <div 
        ref={avatarRef}
        className={`w-full h-full cursor-pointer transition-all duration-300 ${
          isSpeaking ? 'scale-105' : 'scale-100'
        }`}
        style={{
          backgroundImage: 'url(/olivia.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Speaking indicator overlay */}
        {isSpeaking && (
          <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>
        )}
        
        {/* Connection status overlay */}
        <div className="absolute top-4 right-4">
          <div className={`w-4 h-4 rounded-full border-2 border-white ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <div className="w-1 h-1 rounded-full bg-white mx-auto mt-0.5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
