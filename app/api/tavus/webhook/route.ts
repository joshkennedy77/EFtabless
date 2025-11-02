import { NextRequest, NextResponse } from "next/server";

// Tavus webhook endpoint to receive callbacks
// Documentation: https://docs.tavus.io/sections/webhooks-and-callbacks
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const eventType = data.event_type;
    const conversationId = data.conversation_id;
    const messageType = data.message_type;

    console.log(`[TAVUS WEBHOOK] Received ${eventType} for conversation ${conversationId}`);

    // Handle system callbacks
    if (messageType === "system") {
      if (eventType === "system.replica_joined") {
        console.log("✅ Replica has joined the conversation");
        // Replica is ready for conversation
      } else if (eventType === "system.shutdown") {
        const shutdownReason = data.properties?.shutdown_reason;
        console.log(`🔚 Conversation ended: ${shutdownReason}`);
        // Handle conversation shutdown
      }
    }

    // Handle application callbacks
    if (messageType === "application") {
      if (eventType === "application.transcription_ready") {
        console.log("📝 Transcript is ready!");
        const transcript = data.properties?.transcript;
        if (transcript) {
          // Process transcript here
          console.log(`Transcript has ${transcript.length} messages`);
          // You can store this transcript, analyze it, etc.
        }
      } else if (eventType === "application.recording_ready") {
        const s3Key = data.properties?.s3_key;
        console.log(`🎥 Recording ready at S3 key: ${s3Key}`);
        // Handle recording availability
      } else if (eventType === "application.perception_analysis") {
        const analysis = data.properties?.analysis;
        console.log(`👁️ Perception analysis:`, analysis);
        // Handle visual perception analysis
      }
    }

    // Return success response to Tavus
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("[TAVUS WEBHOOK] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

