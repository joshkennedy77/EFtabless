import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="p-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <Link href="/" className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
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
            <h1 className="font-bold text-gray-900 text-xl tracking-tight">EverFriends Concierge</h1>
            <p className="text-sm text-gray-600">Powered by Human+ Lab</p>
          </div>
        </Link>
        <nav className="text-sm text-gray-600 flex gap-4 flex-wrap items-center">
          <Link 
            href="/concierge" 
            className="hover:text-gray-900 transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-gray-100"
            aria-label="MyChart"
          >
            MyChart
          </Link>
          <Link 
            href="/doctor" 
            className="hover:text-gray-900 transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-gray-100"
            aria-label="Doctor's Assistant"
          >
            Doctor's Assistant
          </Link>
          <Link 
            href="/delta" 
            className="hover:text-gray-900 transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-gray-100"
            aria-label="Delta Airlines Assistant"
          >
            Delta Assistant
          </Link>
          <Link 
            href="/bank" 
            className="hover:text-gray-900 transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-gray-100"
            aria-label="Bank Concierge"
          >
            Bank Concierge
          </Link>
          <Link 
            href="/info" 
            className="hover:text-gray-900 transition-colors duration-200 font-medium px-2 py-1 rounded hover:bg-gray-100"
            aria-label="Learn about EverFriends"
          >
            Learn More
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learn About EverFriends
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered wellness and care coordination assistant, designed to keep you and your family connected and safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                🤖
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                AI-Powered Assistant
              </h2>
              <p className="text-gray-600">
                Our photoreal digital human provides natural, conversational interactions 
                that feel personal and engaging.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                💬
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Smart Conversations
              </h2>
              <p className="text-gray-600">
                Advanced state machine ensures meaningful dialogue flow, 
                understanding context and providing relevant responses.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl">
                🎯
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Dynamic UI Cards
              </h2>
              <p className="text-gray-600">
                JSON-driven interface adapts to conversation context, 
                showing forms, cards, and interactive elements as needed.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl">
                🔒
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Privacy First
              </h2>
              <p className="text-gray-600">
                Your conversations are encrypted and never shared without 
                explicit consent. Full control over your data.
              </p>
            </div>
          </Card>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start a Conversation</h3>
                <p className="text-gray-600">
                  Click "Start Conversation" to begin interacting with your AI concierge. 
                  Grant microphone permission for voice interaction.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Dialogue</h3>
                <p className="text-gray-600">
                  Speak or type naturally. The AI understands context and responds 
                  with relevant information and interactive UI elements.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Cards</h3>
                <p className="text-gray-600">
                  Fill out forms, explore options, and take actions through 
                  dynamic UI cards that appear based on your conversation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Coordination</h3>
                <p className="text-gray-600">
                  Set up wellness check-ins, emergency alerts, and family 
                  notifications to keep everyone connected and safe.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button size="lg" className="px-8 py-4">
              Back to MyChart
            </Button>
          </Link>
        </div>
      </div>

    </main>
  );
}
