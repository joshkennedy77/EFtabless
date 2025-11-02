"use client";
import { useState, useEffect } from "react";
import { UiDirective } from "@/lib/schema";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface UiPanelProps {
  items: UiDirective[];
  onEmit: (event: string) => void;
  className?: string;
  triggerAction?: ActionType | DoctorActionType | DeltaActionType | null;
  mode?: "concierge" | "doctor" | "delta";
}

type ActionType = "check-in" | "family-notifications" | "care-coordination" | "wellness-tracking" | null;
type DoctorActionType = "consultation" | "prescription" | "lab-results" | "medical-history" | null;
type DeltaActionType = "book-flight" | "flight-check-in" | "flight-status" | "baggage-tracking" | null;
type CombinedActionType = ActionType | DoctorActionType | DeltaActionType;

export default function UiPanel({ items, onEmit, className = "", triggerAction, mode = "concierge" }: UiPanelProps) {
  const [activeForm, setActiveForm] = useState<CombinedActionType>(null);

  // Handle external action trigger
  useEffect(() => {
    if (triggerAction) {
      setActiveForm(triggerAction);
    }
  }, [triggerAction]);
  const handleFormSubmit = (formId: string, formData: FormData) => {
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    onEmit(`SUBMIT:${formId}:${JSON.stringify(data)}`);
    // Close form after submission
    setActiveForm(null);
  };

  const handleActionClick = (action: CombinedActionType) => {
    setActiveForm(action);
    onEmit(`ACTION:${action}`);
  };

  const getFormForAction = (action: CombinedActionType) => {
    switch (action) {
      case "check-in":
        return {
          title: "Hospital Check-In",
          fields: [
            {
              id: "patient_name",
              label: "Patient Name",
              kind: "text" as const,
              required: true,
              placeholder: "Full legal name"
            },
            {
              id: "date_of_birth",
              label: "Date of Birth",
              kind: "text" as const,
              required: true,
              placeholder: "MM/DD/YYYY"
            },
            {
              id: "phone",
              label: "Phone Number",
              kind: "text" as const,
              required: true,
              placeholder: "(555) 123-4567"
            },
            {
              id: "email",
              label: "Email Address",
              kind: "text" as const,
              placeholder: "patient@email.com"
            },
            {
              id: "appointment_date",
              label: "Appointment Date",
              kind: "text" as const,
              required: true,
              placeholder: "MM/DD/YYYY"
            },
            {
              id: "appointment_time",
              label: "Appointment Time",
              kind: "select" as const,
              required: true,
              options: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]
            },
            {
              id: "reason_for_visit",
              label: "Reason for Visit",
              kind: "select" as const,
              required: true,
              options: ["Regular check-up", "Follow-up appointment", "New symptoms", "Prescription refill", "Lab results", "Other"]
            },
            {
              id: "insurance_provider",
              label: "Insurance Provider",
              kind: "select" as const,
              required: true,
              options: ["Blue Cross Blue Shield", "Aetna", "Cigna", "UnitedHealthcare", "Medicare", "Medicaid", "Self-pay", "Other"]
            },
            {
              id: "insurance_id",
              label: "Insurance ID Number",
              kind: "text" as const,
              placeholder: "Enter insurance ID"
            },
            {
              id: "emergency_contact",
              label: "Emergency Contact Name",
              kind: "text" as const,
              placeholder: "Name and relationship"
            },
            {
              id: "emergency_phone",
              label: "Emergency Contact Phone",
              kind: "text" as const,
              placeholder: "(555) 123-4567"
            },
            {
              id: "current_medications",
              label: "Current Medications",
              kind: "text" as const,
              placeholder: "List all current medications"
            },
            {
              id: "allergies",
              label: "Known Allergies",
              kind: "text" as const,
              placeholder: "List any allergies or enter 'None'"
            },
            {
              id: "symptoms",
              label: "Current Symptoms (if applicable)",
              kind: "text" as const,
              placeholder: "Describe any current symptoms"
            }
          ],
          submit_label: "Complete Check-In"
        };
      case "family-notifications":
        return {
          title: "Family Notifications",
          fields: [
            {
              id: "recipient",
              label: "Who should be notified?",
              kind: "select" as const,
              required: true,
              options: ["All family members", "Primary caregiver", "Emergency contact", "Custom list"]
            },
            {
              id: "notification_type",
              label: "Notification Type",
              kind: "select" as const,
              required: true,
              options: ["Wellness update", "Check-in reminder", "Emergency alert", "Weekly summary"]
            },
            {
              id: "frequency",
              label: "How often?",
              kind: "select" as const,
              options: ["Daily", "Weekly", "As needed", "On events"]
            },
            {
              id: "preferences",
              label: "Preferences",
              kind: "chips" as const,
              options: ["Email", "SMS", "Push notification", "Voice call"]
            }
          ],
          submit_label: "Save Notification Settings"
        };
      case "care-coordination":
        return {
          title: "Care Coordination",
          fields: [
            {
              id: "care_type",
              label: "Type of Care Needed",
              kind: "select" as const,
              required: true,
              options: ["Medical appointment", "Medication management", "Daily assistance", "Emergency response"]
            },
            {
              id: "caregiver",
              label: "Primary Caregiver",
              kind: "text" as const,
              required: true,
              placeholder: "Name and contact"
            },
            {
              id: "schedule",
              label: "Schedule",
              kind: "select" as const,
              options: ["One-time", "Daily", "Weekly", "As needed"]
            },
            {
              id: "special_instructions",
              label: "Special Instructions",
              kind: "text" as const,
              placeholder: "Any specific requirements or notes..."
            }
          ],
          submit_label: "Save Care Plan"
        };
      case "wellness-tracking":
        return {
          title: "Wellness Tracking",
          fields: [
            {
              id: "metric",
              label: "What would you like to track?",
              kind: "select" as const,
              required: true,
              options: ["Overall wellness", "Mood trends", "Activity levels", "Medication adherence", "Sleep quality"]
            },
            {
              id: "timeframe",
              label: "View Analytics For",
              kind: "select" as const,
              options: ["Last 7 days", "Last 30 days", "Last 3 months", "All time"]
            }
          ],
          submit_label: "View Analytics",
          showAnalytics: true
        };
      // Doctor-specific actions
      case "consultation":
        return {
          title: "Schedule Consultation",
          fields: [
            {
              id: "patient_name",
              label: "Patient Name",
              kind: "text" as const,
              required: true,
              placeholder: "Full legal name"
            },
            {
              id: "date_of_birth",
              label: "Date of Birth",
              kind: "text" as const,
              required: true,
              placeholder: "MM/DD/YYYY"
            },
            {
              id: "reason",
              label: "Reason for Consultation",
              kind: "select" as const,
              required: true,
              options: ["General check-up", "Follow-up", "New symptoms", "Chronic condition management", "Second opinion", "Preventive care"]
            },
            {
              id: "urgency",
              label: "Urgency Level",
              kind: "select" as const,
              required: true,
              options: ["Routine (within 2 weeks)", "Soon (within 1 week)", "Urgent (within 3 days)", "Emergency (same day)"]
            },
            {
              id: "preferred_date",
              label: "Preferred Date",
              kind: "text" as const,
              required: true,
              placeholder: "MM/DD/YYYY"
            },
            {
              id: "preferred_time",
              label: "Preferred Time",
              kind: "select" as const,
              required: true,
              options: ["Morning (8-11 AM)", "Afternoon (12-4 PM)", "Evening (5-7 PM)"]
            },
            {
              id: "current_symptoms",
              label: "Current Symptoms",
              kind: "text" as const,
              placeholder: "Describe any current symptoms..."
            },
            {
              id: "insurance_provider",
              label: "Insurance Provider",
              kind: "select" as const,
              options: ["Blue Cross Blue Shield", "Aetna", "Cigna", "UnitedHealthcare", "Medicare", "Medicaid", "Self-pay", "Other"]
            }
          ],
          submit_label: "Schedule Consultation"
        };
      case "prescription":
        return {
          title: "Prescription Request",
          fields: [
            {
              id: "patient_name",
              label: "Patient Name",
              kind: "text" as const,
              required: true,
              placeholder: "Full legal name"
            },
            {
              id: "medication_name",
              label: "Medication Name",
              kind: "text" as const,
              required: true,
              placeholder: "Name of medication"
            },
            {
              id: "prescription_type",
              label: "Request Type",
              kind: "select" as const,
              required: true,
              options: ["New prescription", "Refill", "Dosage change", "Substitute medication"]
            },
            {
              id: "pharmacy_name",
              label: "Pharmacy Name",
              kind: "text" as const,
              required: true,
              placeholder: "Name of pharmacy"
            },
            {
              id: "pharmacy_address",
              label: "Pharmacy Address",
              kind: "text" as const,
              placeholder: "Street address, city, state, zip"
            },
            {
              id: "pharmacy_phone",
              label: "Pharmacy Phone",
              kind: "text" as const,
              placeholder: "(555) 123-4567"
            },
            {
              id: "dosage",
              label: "Dosage (if known)",
              kind: "text" as const,
              placeholder: "e.g., 10mg once daily"
            },
            {
              id: "quantity",
              label: "Quantity",
              kind: "select" as const,
              options: ["30 days", "60 days", "90 days", "As prescribed"]
            },
            {
              id: "notes",
              label: "Additional Notes",
              kind: "text" as const,
              placeholder: "Any additional information..."
            }
          ],
          submit_label: "Submit Prescription Request"
        };
      case "lab-results":
        return {
          title: "Lab Results & Test Reports",
          fields: [
            {
              id: "patient_name",
              label: "Patient Name",
              kind: "text" as const,
              required: true,
              placeholder: "Full legal name"
            },
            {
              id: "test_type",
              label: "What type of results?",
              kind: "select" as const,
              required: true,
              options: ["Blood work", "Imaging (X-ray, MRI, CT)", "Biopsy", "Urine test", "Other lab test"]
            },
            {
              id: "test_date",
              label: "Test Date",
              kind: "text" as const,
              required: true,
              placeholder: "MM/DD/YYYY"
            },
            {
              id: "ordering_physician",
              label: "Ordering Physician",
              kind: "text" as const,
              placeholder: "Name of ordering doctor"
            },
            {
              id: "view_option",
              label: "View Options",
              kind: "select" as const,
              required: true,
              options: ["View most recent results", "View all results", "View by test type", "Compare results over time"]
            },
            {
              id: "timeframe",
              label: "Time Period",
              kind: "select" as const,
              options: ["Last 30 days", "Last 3 months", "Last 6 months", "Last year", "All time"]
            }
          ],
          submit_label: "View Lab Results",
          showAnalytics: true
        };
      case "medical-history":
        return {
          title: "Medical History & Records",
          fields: [
            {
              id: "patient_name",
              label: "Patient Name",
              kind: "text" as const,
              required: true,
              placeholder: "Full legal name"
            },
            {
              id: "date_of_birth",
              label: "Date of Birth",
              kind: "text" as const,
              required: true,
              placeholder: "MM/DD/YYYY"
            },
            {
              id: "request_type",
              label: "What would you like to view?",
              kind: "select" as const,
              required: true,
              options: ["Complete medical history", "Diagnosis history", "Surgical history", "Medication history", "Allergy history", "Immunization records"]
            },
            {
              id: "timeframe",
              label: "Time Period",
              kind: "select" as const,
              options: ["Last year", "Last 5 years", "Last 10 years", "All time"]
            },
            {
              id: "format",
              label: "Format",
              kind: "select" as const,
              options: ["Digital view", "Download PDF", "Print summary"]
            }
          ],
          submit_label: "View Medical History"
        };
      // Delta Airlines-specific actions
      case "book-flight":
        return {
          title: "Book a Flight",
          fields: [
            {
              id: "departure_city",
              label: "Departure City",
              kind: "text" as const,
              required: true,
              placeholder: "City or Airport Code"
            },
            {
              id: "arrival_city",
              label: "Arrival City",
              kind: "text" as const,
              required: true,
              placeholder: "City or Airport Code"
            },
            {
              id: "departure_date",
              label: "Departure Date",
              kind: "text" as const,
              required: true,
              placeholder: "MM/DD/YYYY"
            },
            {
              id: "return_date",
              label: "Return Date (if round trip)",
              kind: "text" as const,
              placeholder: "MM/DD/YYYY or leave blank for one-way"
            },
            {
              id: "passengers",
              label: "Number of Passengers",
              kind: "select" as const,
              required: true,
              options: ["1", "2", "3", "4", "5", "6+"]
            },
            {
              id: "cabin_class",
              label: "Cabin Class",
              kind: "select" as const,
              required: true,
              options: ["Main Cabin", "Comfort+", "First Class", "Delta One"]
            },
            {
              id: "flexible_dates",
              label: "Flexible Dates?",
              kind: "select" as const,
              options: ["Yes, ±3 days", "Yes, ±7 days", "No, specific dates only"]
            },
            {
              id: "special_requests",
              label: "Special Requests",
              kind: "text" as const,
              placeholder: "Wheelchair assistance, special meals, etc."
            }
          ],
          submit_label: "Search Flights"
        };
      case "flight-check-in":
        return {
          title: "Check-In for Your Flight",
          fields: [
            {
              id: "confirmation_number",
              label: "Confirmation Number",
              kind: "text" as const,
              required: true,
              placeholder: "6-character confirmation code"
            },
            {
              id: "last_name",
              label: "Last Name",
              kind: "text" as const,
              required: true,
              placeholder: "Last name on reservation"
            },
            {
              id: "flight_date",
              label: "Flight Date",
              kind: "text" as const,
              required: true,
              placeholder: "MM/DD/YYYY"
            },
            {
              id: "seat_preference",
              label: "Seat Preference",
              kind: "select" as const,
              options: ["Window", "Aisle", "Middle", "No preference"]
            },
            {
              id: "special_assistance",
              label: "Special Assistance",
              kind: "select" as const,
              options: ["None", "Wheelchair", "Unaccompanied minor", "Pet in cabin", "Medical needs"]
            }
          ],
          submit_label: "Check In"
        };
      case "flight-status":
        return {
          title: "Check Flight Status",
          fields: [
            {
              id: "flight_number",
              label: "Flight Number",
              kind: "text" as const,
              required: true,
              placeholder: "e.g., DL1234"
            },
            {
              id: "departure_date",
              label: "Departure Date",
              kind: "text" as const,
              required: true,
              placeholder: "MM/DD/YYYY"
            },
            {
              id: "departure_city",
              label: "Departure City (optional)",
              kind: "text" as const,
              placeholder: "City or Airport Code"
            },
            {
              id: "arrival_city",
              label: "Arrival City (optional)",
              kind: "text" as const,
              placeholder: "City or Airport Code"
            }
          ],
          submit_label: "Check Status",
          showAnalytics: true
        };
      case "baggage-tracking":
        return {
          title: "Track Your Baggage",
          fields: [
            {
              id: "baggage_tag_number",
              label: "Baggage Tag Number",
              kind: "text" as const,
              required: true,
              placeholder: "10-digit tag number"
            },
            {
              id: "last_name",
              label: "Last Name",
              kind: "text" as const,
              required: true,
              placeholder: "Last name on reservation"
            },
            {
              id: "confirmation_number",
              label: "Confirmation Number (optional)",
              kind: "text" as const,
              placeholder: "6-character confirmation code"
            },
            {
              id: "flight_number",
              label: "Flight Number (optional)",
              kind: "text" as const,
              placeholder: "e.g., DL1234"
            }
          ],
          submit_label: "Track Baggage"
        };
      default:
        return null;
    }
  };

  const renderDirective = (directive: UiDirective, index: number) => {
    switch (directive.type) {
      case "notice":
        return (
          <div key={index} className="p-4 rounded-2xl bg-blue-500/10 backdrop-blur-xl border border-blue-400/30">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 text-xl">ℹ️</div>
              <p className="text-blue-200/90 font-medium">{directive.text}</p>
            </div>
          </div>
        );

      case "card":
        // Special handling for action buttons card
        if (directive.id === "action-buttons" || directive.id === "doctor-action-buttons" || directive.id === "delta-action-buttons") {
          // Delta Airlines mode buttons
          if (mode === "delta" || directive.id === "delta-action-buttons") {
            return (
              <div key={directive.id ?? index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-white text-2xl mb-2">{directive.title}</h3>
                    {directive.body && (
                      <p className="text-blue-200/70 leading-relaxed text-sm">{directive.body}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => handleActionClick("book-flight")}
                      className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">✈️</span>
                        <span>Book a Flight</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleActionClick("flight-check-in")}
                      className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🎫</span>
                        <span>Check-In</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleActionClick("flight-status")}
                      className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🔄</span>
                        <span>Flight Status</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleActionClick("baggage-tracking")}
                      className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🧳</span>
                        <span>Baggage Tracking</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          }
          
          // Doctor mode buttons
          if (mode === "doctor" || directive.id === "doctor-action-buttons") {
            return (
              <div key={directive.id ?? index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-white text-2xl mb-2">{directive.title}</h3>
                    {directive.body && (
                      <p className="text-blue-200/70 leading-relaxed text-sm">{directive.body}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => handleActionClick("consultation")}
                      className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🩺</span>
                        <span>Schedule Consultation</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleActionClick("prescription")}
                      className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💊</span>
                        <span>Prescription Request</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleActionClick("lab-results")}
                      className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🧪</span>
                        <span>Lab Results</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleActionClick("medical-history")}
                      className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📋</span>
                        <span>Medical History</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          }
          
          // Concierge mode buttons (default)
          return (
            <div key={directive.id ?? index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-white text-2xl mb-2">{directive.title}</h3>
                  {directive.body && (
                    <p className="text-blue-200/70 leading-relaxed text-sm">{directive.body}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleActionClick("check-in")}
                    className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏥</span>
                      <span>Check In</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleActionClick("family-notifications")}
                    className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👨‍👩‍👧</span>
                      <span>Family Notifications</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleActionClick("care-coordination")}
                    className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🤝</span>
                      <span>Care Coordination</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleActionClick("wellness-tracking")}
                    className="group w-full px-5 py-4 text-left text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📊</span>
                      <span>Wellness Tracking</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          );
        }
        
        // Regular card rendering
        return (
          <div key={directive.id ?? index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="space-y-4">
              <h3 className="font-bold text-white text-xl">{directive.title}</h3>
              {directive.body && (
                <p className="text-blue-200/80 leading-relaxed">{directive.body}</p>
              )}
              {directive.bullets && (
                <ul className="space-y-2">
                  {directive.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-3 text-sm text-blue-200/90">
                      <span className="text-emerald-400 mt-0.5 font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {directive.cta && (
                <div className="pt-3">
                  <button
                    onClick={() => {
                      if (directive.cta?.action.type === "emit" && directive.cta.action.event) {
                        onEmit(directive.cta.action.event);
                      }
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-lg shadow-blue-500/30 transform hover:scale-[1.02]"
                  >
                    {directive.cta.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case "image":
        return (
          <div key={index} className="p-0 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
            <img
              src={directive.url}
              alt={directive.alt}
              className="w-full h-auto rounded-2xl"
              loading="lazy"
            />
          </div>
        );

      case "form":
        return (
          <Card key={index} className="bg-gray-50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleFormSubmit(directive.form_id, formData);
              }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-gray-900 text-lg">{directive.title}</h3>
              <div className="space-y-3">
                {directive.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.kind === "text" && (
                      <Input
                        name={field.id}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full"
                      />
                    )}
                    {field.kind === "select" && (
                      <select
                        name={field.id}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    {field.kind === "chips" && (
                      <div className="flex flex-wrap gap-2">
                        {field.options?.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              name={field.id}
                              value={option}
                              className="rounded"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full">
                {directive.submit_label}
              </Button>
            </form>
          </Card>
        );

      case "carousel":
        return (
          <Card key={index} className="bg-gradient-to-r from-purple-50 to-blue-50">
            {directive.title && (
              <h3 className="font-semibold text-gray-900 text-lg mb-4">{directive.title}</h3>
            )}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {directive.items.map((item, itemIndex) => (
                <div
                  key={item.id ?? itemIndex}
                  className="min-w-[280px] p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                  {item.body && (
                    <p className="text-sm text-gray-600 mb-3">{item.body}</p>
                  )}
                  {item.cta && (
                    <Button
                      size="sm"
                      onClick={() => {
                        if (item.cta?.action.type === "emit" && item.cta.action.event) {
                          onEmit(item.cta.action.event);
                        }
                      }}
                      className="w-full"
                    >
                      {item.cta.label}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderActionForm = () => {
    if (!activeForm) return null;

    const formData = getFormForAction(activeForm);
    if (!formData) return null;

    return (
      <div
        className={`bg-white/5 backdrop-blur-2xl border-2 border-white/10 p-8 animate-swoop-in mt-4 shadow-2xl`}
        style={{ borderRadius: '24px' }}
      >
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-blue-500/30">
              {activeForm === "check-in" ? "🏥" : 
               activeForm === "wellness-tracking" ? "📊" : 
               activeForm === "family-notifications" ? "👨‍👩‍👧" : 
               activeForm === "care-coordination" ? "🤝" :
               activeForm === "consultation" ? "🩺" :
               activeForm === "prescription" ? "💊" :
               activeForm === "lab-results" ? "🧪" :
               activeForm === "medical-history" ? "📋" :
               activeForm === "book-flight" ? "✈️" :
               activeForm === "flight-check-in" ? "🎫" :
               activeForm === "flight-status" ? "🔄" :
               activeForm === "baggage-tracking" ? "🧳" : "📋"}
            </div>
            <h3 className="font-bold text-white text-2xl">{formData.title}</h3>
          </div>
          <button
            onClick={() => setActiveForm(null)}
            className="text-white/60 hover:text-white hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 text-2xl leading-none"
            aria-label="Close form"
          >
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formDataObj = new FormData(e.currentTarget);
            handleFormSubmit(`action-${activeForm}`, formDataObj);
          }}
          className="space-y-4"
        >
          <div className="space-y-5">
            {formData.fields.map((field) => (
              <div key={field.id} className="group">
                <label className="block text-sm font-bold text-white/90 mb-2 tracking-wide">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                {field.kind === "text" && (
                  <input
                    name={field.id}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-3 border-2 border-white/10 rounded-xl bg-white/5 backdrop-blur-xl text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200 hover:border-white/20 shadow-lg"
                  />
                )}
                {field.kind === "select" && (
                  <select
                    name={field.id}
                    required={field.required}
                    className="w-full px-4 py-3 border-2 border-white/10 rounded-xl bg-white/5 backdrop-blur-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200 hover:border-white/20 appearance-none cursor-pointer shadow-lg"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '2.75rem' }}
                  >
                    <option value="" className="bg-slate-900 text-gray-400">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option} className="bg-slate-900 text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.kind === "chips" && (
                  <div className="flex flex-wrap gap-3">
                    {field.options?.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 px-4 py-2.5 border-2 border-white/10 rounded-xl cursor-pointer hover:border-blue-400/50 hover:bg-blue-500/20 transition-all duration-200 bg-white/5 backdrop-blur-xl shadow-lg group/chip"
                      >
                        <input
                          type="checkbox"
                          name={field.id}
                          value={option}
                          className="w-4 h-4 text-blue-500 border-white/30 rounded focus:ring-blue-400 focus:ring-2 cursor-pointer bg-white/10"
                        />
                        <span className="text-sm font-medium text-white/90 group-hover/chip:text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {formData.showAnalytics && (
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border-2 border-blue-400/30 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h4 className="font-bold text-white text-lg">Analytics Preview</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-blue-200 font-semibold">Wellness Score:</span>
                  <span className="font-bold text-white text-base">85%</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-blue-200 font-semibold">Check-ins Completed:</span>
                  <span className="font-bold text-white text-base">28/30</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-blue-200 font-semibold">Trend:</span>
                  <span className="font-bold text-emerald-400 text-base flex items-center gap-1">
                    <span>↑</span> Improving
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 rounded-2xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-[1.02]"
          >
            {formData.submit_label}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-md space-y-4 ${className}`}>
      {items.length === 0 ? (
        <div className="text-center py-12 px-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl">
          <div className="text-blue-200/60">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-white/70 font-medium">Start a conversation to see AI responses here</p>
          </div>
        </div>
      ) : (
        <>
          {items.map((directive, index) => renderDirective(directive, index))}
          {renderActionForm()}
        </>
      )}
    </div>
  );
}
