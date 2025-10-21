import { NextRequest, NextResponse } from "next/server";
import { SessionEventSchema } from "@/lib/schema";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// In-memory store for development (replace with database in production)
const sessionStore = new Map<string, any[]>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the event data
    const validatedEvent = SessionEventSchema.parse({
      timestamp: Date.now(),
      ...body
    });
    
    // Get or create session ID
    const sessionId = req.headers.get("x-session-id") || `session_${Date.now()}`;
    
    // Store in memory for now
    if (!sessionStore.has(sessionId)) {
      sessionStore.set(sessionId, []);
    }
    
    const sessionEvents = sessionStore.get(sessionId)!;
    sessionEvents.push(validatedEvent);
    
    // In development, also write to file system
    try {
      const dataDir = join(process.cwd(), "data", "sessions");
      await mkdir(dataDir, { recursive: true });
      
      const sessionFile = join(dataDir, `${sessionId}.json`);
      await writeFile(sessionFile, JSON.stringify(sessionEvents, null, 2));
    } catch (fsError) {
      console.warn("[EVENTS] Failed to write to file system:", fsError);
      // Continue without failing - in-memory storage still works
    }
    
    console.log(`[EVENTS] Recorded event for session ${sessionId}:`, validatedEvent.kind);
    
    return NextResponse.json({ 
      success: true, 
      sessionId,
      eventCount: sessionEvents.length 
    });
  } catch (error) {
    console.error("[EVENTS] Error recording event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record event" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  
  if (sessionId) {
    const events = sessionStore.get(sessionId) || [];
    return NextResponse.json({ sessionId, events });
  }
  
  // Return all sessions (for debugging)
  const sessions = Array.from(sessionStore.entries()).map(([id, events]) => ({
    sessionId: id,
    eventCount: events.length,
    lastEvent: events[events.length - 1]?.timestamp
  }));
  
  return NextResponse.json({ sessions });
}
