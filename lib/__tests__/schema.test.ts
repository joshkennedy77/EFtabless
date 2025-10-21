import { UiDirectiveSchema, UiEnvelopeSchema } from "../schema";

describe("Schema Validation", () => {
  test("validates notice directive", () => {
    const notice = {
      type: "notice",
      text: "Hello, this is a notice"
    };
    
    const result = UiDirectiveSchema.safeParse(notice);
    expect(result.success).toBe(true);
  });

  test("validates card directive", () => {
    const card = {
      type: "card",
      id: "test-card",
      title: "Test Card",
      body: "This is a test card",
      bullets: ["Bullet 1", "Bullet 2"],
      cta: {
        label: "Click me",
        action: {
          type: "emit",
          event: "TEST_EVENT"
        }
      }
    };
    
    const result = UiDirectiveSchema.safeParse(card);
    expect(result.success).toBe(true);
  });

  test("validates form directive", () => {
    const form = {
      type: "form",
      form_id: "test-form",
      title: "Test Form",
      fields: [
        {
          id: "name",
          label: "Name",
          kind: "text",
          required: true
        },
        {
          id: "category",
          label: "Category",
          kind: "select",
          options: ["Option 1", "Option 2"]
        }
      ],
      submit_label: "Submit"
    };
    
    const result = UiDirectiveSchema.safeParse(form);
    expect(result.success).toBe(true);
  });

  test("validates envelope with multiple directives", () => {
    const envelope = {
      directives: [
        {
          type: "notice",
          text: "Welcome!"
        },
        {
          type: "card",
          title: "Get Started",
          body: "Click below to begin"
        }
      ]
    };
    
    const result = UiEnvelopeSchema.safeParse(envelope);
    expect(result.success).toBe(true);
  });

  test("rejects invalid directive", () => {
    const invalid = {
      type: "invalid",
      text: "This should fail"
    };
    
    const result = UiDirectiveSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
