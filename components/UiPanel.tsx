"use client";
import { UiDirective } from "@/lib/schema";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface UiPanelProps {
  items: UiDirective[];
  onEmit: (event: string) => void;
  className?: string;
}

export default function UiPanel({ items, onEmit, className = "" }: UiPanelProps) {
  const handleFormSubmit = (formId: string, formData: FormData) => {
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    onEmit(`SUBMIT:${formId}:${JSON.stringify(data)}`);
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
        items.map((directive, index) => renderDirective(directive, index))
      )}
    </div>
  );
}
