import { NextRequest, NextResponse } from "next/server";

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const TAVUS_BASE_URL = "https://tavusapi.com/v2";

// Generate a Tavus stream URL for the persona
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const replicaId = body.replicaId || "r62baeccd777";
    const personaId = body.personaId || "pb8ce5779ad5";

    // API key is required - Tavus requires authenticated API calls to create conversations
    if (!TAVUS_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Tavus API key is required. Please set TAVUS_API_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    // First, get persona details to understand how to create a session
    const personaResponse = await fetch(`${TAVUS_BASE_URL}/personas/${personaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TAVUS_API_KEY,
      },
    });

    if (!personaResponse.ok) {
      const errorText = await personaResponse.text();
      console.error("[TAVUS] Persona Error:", errorText);
      throw new Error(`Tavus API error: ${personaResponse.status}`);
    }

    const personaData = await personaResponse.json();

    // Create a conversation session with Tavus using the conversations endpoint
    let sessionData = null;
    let streamUrl = null;

    // Create a conversation session with Tavus
    // Following Tavus API documentation: https://docs.tavus.io/sections/webhooks-and-callbacks
    const requestBody: any = {
      replica_id: replicaId,
      persona_id: personaId,
    };

    // Add callback_url if configured (for webhook callbacks)
    if (process.env.TAVUS_CALLBACK_URL) {
      requestBody.callback_url = process.env.TAVUS_CALLBACK_URL;
    }

    const conversationResponse = await fetch(`${TAVUS_BASE_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TAVUS_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (conversationResponse.ok) {
      sessionData = await conversationResponse.json();
      console.log("[TAVUS] Conversation response:", sessionData);
      
      // Use conversation_url (Daily.co room) as the primary embed URL
      streamUrl = sessionData.conversation_url || 
                  sessionData.stream_url || 
                  sessionData.player_url || 
                  sessionData.iframe_url || 
                  sessionData.url || 
                  sessionData.hosted_url;
    } else {
      const errorText = await conversationResponse.text();
      console.error("[TAVUS] Conversation creation failed:", conversationResponse.status, errorText);
    }

    // If conversation creation failed, check if persona has a direct URL
    if (!streamUrl && (personaData.stream_url || personaData.player_url || personaData.iframe_url)) {
      streamUrl = personaData.stream_url || personaData.player_url || personaData.iframe_url;
    }

    // If we still don't have a stream URL, we cannot proceed
    if (!streamUrl) {
      console.error("[TAVUS] No valid stream URL found in API response");
      throw new Error("Tavus API did not return a valid stream URL. Please check your API key and persona configuration.");
    }

    console.log("[TAVUS] Final stream URL:", streamUrl);

    return NextResponse.json({
      success: true,
      sessionId: sessionData?.session_id || sessionData?.id || personaData.session_id,
      conversationId: sessionData?.conversation_id || sessionData?.id,
      streamUrl: streamUrl,
      personaData,
      sessionData,
    });
  } catch (error: any) {
    console.error("[TAVUS] Error creating session:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create Tavus session",
      },
      { status: 500 }
    );
  }
}

// Get session status
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    if (!TAVUS_API_KEY) {
      return NextResponse.json(
        { error: "Tavus API key not configured" },
        { status: 500 }
      );
    }

    // Try conversations endpoint first, then realtime sessions as fallback
    let response = await fetch(`${TAVUS_BASE_URL}/conversations/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TAVUS_API_KEY,
      },
    });

    // If conversations endpoint doesn't work, try realtime sessions
    if (!response.ok) {
      response = await fetch(`${TAVUS_BASE_URL}/realtime/sessions/${sessionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": TAVUS_API_KEY,
        },
      });
    }

    if (!response.ok) {
      throw new Error(`Tavus API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[TAVUS] Error getting session:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get session" },
      { status: 500 }
    );
  }
}

// End/delete a conversation
export async function DELETE(req: NextRequest) {
  try {
    const conversationId = req.nextUrl.searchParams.get("conversationId");
    if (!conversationId) {
      return NextResponse.json({ error: "conversationId required" }, { status: 400 });
    }

    if (!TAVUS_API_KEY) {
      return NextResponse.json(
        { error: "Tavus API key not configured" },
        { status: 500 }
      );
    }

    // End the conversation using Tavus API
    const response = await fetch(`${TAVUS_BASE_URL}/conversations/${conversationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TAVUS_API_KEY,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      console.error("[TAVUS] Error ending conversation:", response.status, errorText);
      throw new Error(`Tavus API error: ${response.status}`);
    }

    console.log(`[TAVUS] Conversation ${conversationId} ended successfully`);

    return NextResponse.json({
      success: true,
      message: "Conversation ended",
      conversationId,
    });
  } catch (error: any) {
    console.error("[TAVUS] Error ending conversation:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to end conversation" },
      { status: 500 }
    );
  }
}

