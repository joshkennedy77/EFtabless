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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your AI-Powered Wellness
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assistant
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            EverFriends Concierge keeps you and your family connected and safe with intelligent care coordination and wellness tracking.
          </p>
          <div className="flex justify-center items-center">
            <Link href="/concierge">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
                Get Started with MyChart
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                🤖
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered
              </h2>
              <p className="text-gray-600 text-sm">
                Photoreal digital human provides natural, conversational interactions
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                💬
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Conversations
              </h2>
              <p className="text-gray-600 text-sm">
                Advanced state machine ensures meaningful dialogue flow
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                🎯
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Dynamic UI
              </h2>
              <p className="text-gray-600 text-sm">
                JSON-driven interface adapts to conversation context
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                🔒
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Privacy First
              </h2>
              <p className="text-gray-600 text-sm">
                Encrypted conversations with full control over your data
              </p>
            </div>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-3xl p-10 md:p-12 shadow-xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start a Conversation</h3>
                <p className="text-gray-600">
                  Begin interacting with your AI concierge. Grant microphone permission for voice interaction or type your messages.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Dialogue</h3>
                <p className="text-gray-600">
                  Speak or type naturally. The AI understands context and responds with relevant information and interactive elements.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Cards</h3>
                <p className="text-gray-600">
                  Fill out forms, explore options, and take actions through dynamic UI cards that appear based on your conversation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Coordination</h3>
                <p className="text-gray-600">
                  Set up wellness check-ins, emergency alerts, and family notifications to keep everyone connected and safe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience the future of AI-powered wellness and care coordination
          </p>
          <Link href="/concierge">
            <Button size="lg" className="px-10 py-5 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all">
              Try MyChart Now
            </Button>
          </Link>
        </div>
      </section>

    </main>
  );
}
