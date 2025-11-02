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
  triggerAction?: ActionType | null;
}

type ActionType = "check-in" | "family-notifications" | "care-coordination" | "wellness-tracking" | null;

export default function UiPanel({ items, onEmit, className = "", triggerAction }: UiPanelProps) {
  const [activeForm, setActiveForm] = useState<ActionType>(null);

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

  const handleActionClick = (action: ActionType) => {
    setActiveForm(action);
    onEmit(`ACTION:${action}`);
  };

  const getFormForAction = (action: ActionType) => {
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
      default:
        return null;
    }
  };

  const renderDirective = (directive: UiDirective, index: number) => {
    switch (directive.type) {
      case "notice":
        return (
          <Card key={index} className="bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 text-lg">ℹ️</div>
              <p className="text-blue-800">{directive.text}</p>
            </div>
          </Card>
        );

      case "card":
        // Special handling for action buttons card
        if (directive.id === "action-buttons") {
          return (
            <Card key={directive.id ?? index} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">{directive.title}</h3>
                {directive.body && (
                  <p className="text-gray-700 leading-relaxed text-sm">{directive.body}</p>
                )}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleActionClick("check-in")}
                    className="w-full px-4 py-3 text-left text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#3769f6' }}
                  >
                    Check In
                  </button>
                  <button
                    onClick={() => handleActionClick("family-notifications")}
                    className="w-full px-4 py-3 text-left text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#3769f6' }}
                  >
                    Family Notifications
                  </button>
                  <button
                    onClick={() => handleActionClick("care-coordination")}
                    className="w-full px-4 py-3 text-left text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#3769f6' }}
                  >
                    Care Coordination
                  </button>
                  <button
                    onClick={() => handleActionClick("wellness-tracking")}
                    className="w-full px-4 py-3 text-left text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#3769f6' }}
                  >
                    Wellness Tracking
                  </button>
                </div>
              </div>
            </Card>
          );
        }
        
        // Regular card rendering
        return (
          <Card key={directive.id ?? index} className="hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-lg">{directive.title}</h3>
              {directive.body && (
                <p className="text-gray-700 leading-relaxed">{directive.body}</p>
              )}
              {directive.bullets && (
                <ul className="space-y-1">
                  {directive.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {directive.cta && (
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      if (directive.cta?.action.type === "emit" && directive.cta.action.event) {
                        onEmit(directive.cta.action.event);
                      }
                    }}
                    className="w-full"
                  >
                    {directive.cta.label}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );

      case "image":
        return (
          <Card key={index} className="p-0 overflow-hidden">
            <img
              src={directive.url}
              alt={directive.alt}
              className="w-full h-auto rounded-xl"
              loading="lazy"
            />
          </Card>
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
        className={`bg-white border border-gray-200 p-6 animate-swoop-in mt-4 shadow-lg`}
        style={{ borderRadius: '4px' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 text-xl">{formData.title}</h3>
          <button
            onClick={() => setActiveForm(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close form"
            style={{ width: '24px', height: '24px', lineHeight: '1' }}
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
          <div className="space-y-4">
            {formData.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.kind === "text" && (
                  <input
                    name={field.id}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    style={{ borderRadius: '2px' }}
                  />
                )}
                {field.kind === "select" && (
                  <select
                    name={field.id}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
                    style={{ borderRadius: '2px', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
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
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        <input
                          type="checkbox"
                          name={field.id}
                          value={option}
                          style={{ borderRadius: '2px' }}
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {formData.showAnalytics && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200" style={{ borderRadius: '2px' }}>
              <h4 className="font-semibold text-blue-900 mb-2">Analytics Preview</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Wellness Score:</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-ins Completed:</span>
                  <span className="font-semibold">28/30</span>
                </div>
                <div className="flex justify-between">
                  <span>Trend:</span>
                  <span className="font-semibold text-green-600">↑ Improving</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-black text-white font-medium py-3 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
            style={{ borderRadius: '2px' }}
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
        <Card className="text-center py-8">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>Start a conversation to see AI responses here</p>
          </div>
        </Card>
      ) : (
        <>
          {items.map((directive, index) => renderDirective(directive, index))}
          {renderActionForm()}
        </>
      )}
    </div>
  );
}
