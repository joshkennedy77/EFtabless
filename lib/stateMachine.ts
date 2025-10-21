import { DialogueState, UiEnvelope } from "./schema";

export class DialogueStateMachine {
  private currentState: DialogueState = "GREET";
  private conversationHistory: string[] = [];

  getState(): DialogueState {
    return this.currentState;
  }

  transition(userInput: string): DialogueState {
    this.conversationHistory.push(userInput);
    
    // Simple state transitions based on keywords and conversation flow
    const input = userInput.toLowerCase();
    
    switch (this.currentState) {
      case "GREET":
        if (input.includes("hello") || input.includes("hi") || input.includes("start")) {
          this.currentState = "QUALIFY";
        }
        break;
        
      case "QUALIFY":
        if (input.includes("help") || input.includes("need") || input.includes("want")) {
          this.currentState = "CLARIFY";
        } else if (input.includes("no") || input.includes("not interested")) {
          this.currentState = "WRAP";
        }
        break;
        
      case "CLARIFY":
        if (input.includes("yes") || input.includes("sure") || input.includes("ok")) {
          this.currentState = "ANSWER";
        } else if (input.includes("no") || input.includes("not")) {
          this.currentState = "QUALIFY";
        }
        break;
        
      case "ANSWER":
        if (input.includes("more") || input.includes("else") || input.includes("other")) {
          this.currentState = "OFFER";
        } else if (input.includes("thanks") || input.includes("goodbye")) {
          this.currentState = "WRAP";
        }
        break;
        
      case "OFFER":
        if (input.includes("yes") || input.includes("sure")) {
          this.currentState = "ANSWER";
        } else if (input.includes("no") || input.includes("enough")) {
          this.currentState = "WRAP";
        }
        break;
        
      case "WRAP":
        // Reset to greet for new conversation
        this.currentState = "GREET";
        this.conversationHistory = [];
        break;
    }
    
    return this.currentState;
  }

  getConversationHistory(): string[] {
    return [...this.conversationHistory];
  }

  reset(): void {
    this.currentState = "GREET";
    this.conversationHistory = [];
  }
}
