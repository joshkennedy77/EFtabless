import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            E
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">EverFriends</h1>
            <p className="text-sm text-gray-600">A friendly concierge, powered by Human+</p>
          </div>
        </Link>
        <nav className="text-sm text-gray-600 flex gap-6">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Back to Concierge
          </Link>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy
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
              Back to Concierge
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-sm text-gray-500 border-t border-gray-200 bg-white/50">
        <p>
          EverFriends MVP - Built with Next.js, TypeScript, and Tailwind CSS
        </p>
      </footer>
    </main>
  );
}
