import { UiEnvelope, DialogueState } from "./schema";
import { DialogueStateMachine } from "./stateMachine";

const stateMachine = new DialogueStateMachine();

export function mockRespond(userText: string): Promise<{ captions: string[]; envelope: UiEnvelope }> {
  return new Promise((resolve) => {
    const newState = stateMachine.transition(userText);
    const currentState = stateMachine.getState();
    
    // Simulate processing delay
    setTimeout(() => {
      const { captions, envelope } = generateResponseForState(currentState, userText);
      resolve({ captions, envelope });
    }, 500 + Math.random() * 1000); // 500-1500ms delay
  });
}

function generateResponseForState(state: DialogueState, userInput: string): { captions: string[]; envelope: UiEnvelope } {
  switch (state) {
    case "GREET":
      return {
        captions: [
          "Hello! I'm your EverFriends concierge.",
          "I'm here to help you with daily wellness and care coordination."
        ],
        envelope: {
          directives: [
            {
              type: "notice",
              text: "Welcome! I can help you set up wellness check-ins, coordinate care, and keep your family connected."
            },
            {
              type: "card",
              id: "welcome-1",
              title: "Get Started",
              body: "Let me know what you'd like help with today. I can assist with wellness tracking, family updates, or care coordination.",
              bullets: ["Daily check-ins", "Family notifications", "Care coordination", "Wellness tracking"],
              cta: {
                label: "Tell me more",
                action: { type: "emit", event: "LEARN_MORE" }
              }
            }
          ]
        }
      };

    case "QUALIFY":
      return {
        captions: [
          "I'd love to help you with that.",
          "Let me understand your specific needs better."
        ],
        envelope: {
          directives: [
            {
              type: "card",
              id: "qualify-1",
              title: "What can I help you with?",
              body: "I specialize in several areas that might be useful for you or your family.",
              bullets: ["Daily wellness check-ins", "Medication reminders", "Family communication", "Emergency alerts"],
              cta: {
                label: "Wellness check-ins",
                action: { type: "emit", event: "WELLNESS_CHECKINS" }
              }
            },
            {
              type: "form",
              form_id: "needs-assessment",
              title: "Quick needs assessment",
              fields: [
                {
                  id: "primary_need",
                  label: "What's your primary need?",
                  kind: "select",
                  required: true,
                  options: ["Daily check-ins", "Medication reminders", "Family updates", "Emergency alerts", "Other"]
                },
                {
                  id: "frequency",
                  label: "How often?",
                  kind: "select",
                  options: ["Daily", "Weekly", "As needed"]
                }
              ],
              submit_label: "Continue"
            }
          ]
        }
      };

    case "CLARIFY":
      return {
        captions: [
          "Let me make sure I understand correctly.",
          "I want to provide exactly what you need."
        ],
        envelope: {
          directives: [
            {
              type: "notice",
              text: "I want to make sure I understand your needs correctly. Can you tell me more about your specific situation?"
            },
            {
              type: "card",
              id: "clarify-1",
              title: "Let me clarify",
              body: "Based on what you've shared, I think you might benefit from:",
              bullets: ["Personalized check-in schedule", "Family notification system", "Emergency contact setup"],
              cta: {
                label: "That sounds right",
                action: { type: "emit", event: "CONFIRM_NEEDS" }
              }
            }
          ]
        }
      };

    case "ANSWER":
      return {
        captions: [
          "Perfect! Let me set that up for you.",
          "I'll create a personalized plan based on your needs."
        ],
        envelope: {
          directives: [
            {
              type: "card",
              id: "answer-1",
              title: "Your personalized plan",
              body: "I've created a customized wellness plan for you. Here's what I'll do:",
              bullets: ["Daily check-ins at your preferred time", "Family notifications when needed", "Emergency escalation if required"],
              cta: {
                label: "Start now",
                action: { type: "emit", event: "START_PLAN" }
              }
            },
            {
              type: "form",
              form_id: "setup-details",
              title: "Final setup details",
              fields: [
                {
                  id: "name",
                  label: "Your name",
                  kind: "text",
                  required: true,
                  placeholder: "Enter your name"
                },
                {
                  id: "phone",
                  label: "Phone number",
                  kind: "text",
                  required: true,
                  placeholder: "Enter your phone number"
                },
                {
                  id: "emergency_contact",
                  label: "Emergency contact",
                  kind: "text",
                  placeholder: "Name and phone number"
                }
              ],
              submit_label: "Complete setup"
            }
          ]
        }
      };

    case "OFFER":
      return {
        captions: [
          "I have a few more suggestions that might be helpful.",
          "Let me show you some additional options."
        ],
        envelope: {
          directives: [
            {
              type: "carousel",
              title: "Additional services",
              items: [
                {
                  type: "card",
                  id: "medication-reminders",
                  title: "Medication Reminders",
                  body: "Never miss a dose with gentle reminders and family notifications.",
                  cta: {
                    label: "Add reminders",
                    action: { type: "emit", event: "ADD_MEDICATION_REMINDERS" }
                  }
                },
                {
                  type: "card",
                  id: "family-updates",
                  title: "Family Updates",
                  body: "Keep your family informed with regular wellness reports.",
                  cta: {
                    label: "Enable updates",
                    action: { type: "emit", event: "ENABLE_FAMILY_UPDATES" }
                  }
                },
                {
                  type: "card",
                  id: "emergency-alerts",
                  title: "Emergency Alerts",
                  body: "Automatic emergency detection and immediate family notification.",
                  cta: {
                    label: "Set up alerts",
                    action: { type: "emit", event: "SETUP_EMERGENCY_ALERTS" }
                  }
                }
              ]
            }
          ]
        }
      };

    case "WRAP":
      return {
        captions: [
          "Thank you for your time today.",
          "I'm here whenever you need assistance."
        ],
        envelope: {
          directives: [
            {
              type: "notice",
              text: "Thank you for using EverFriends! I'm here 24/7 whenever you need assistance. Take care!"
            },
            {
              type: "card",
              id: "wrap-1",
              title: "Need help later?",
              body: "I'm always available to help. Just say 'Hello' to start a new conversation.",
              bullets: ["24/7 availability", "Voice or text", "Family coordination"],
              cta: {
                label: "Start new conversation",
                action: { type: "emit", event: "NEW_CONVERSATION" }
              }
            }
          ]
        }
      };

    default:
      return {
        captions: ["I'm here to help. What would you like to know?"],
        envelope: {
          directives: [
            {
              type: "notice",
              text: "I'm here to help. What would you like to know?"
            }
          ]
        }
      };
  }
}

export function resetMockServer(): void {
  stateMachine.reset();
}
