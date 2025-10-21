// lib/schema.ts
import { z } from "zod";

export const NoticeSchema = z.object({
  type: z.literal("notice"),
  text: z.string(),
});

export const CardSchema = z.object({
  type: z.literal("card"),
  id: z.string().optional(),
  title: z.string(),
  body: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  cta: z
    .object({
      label: z.string(),
      action: z.object({
        type: z.enum(["emit", "navigate"]),
        event: z.string().optional(),
        href: z.string().url().optional(),
      }),
    })
    .optional(),
});

export const ImageSchema = z.object({
  type: z.literal("image"),
  url: z.string().url(),
  alt: z.string(),
});

export const FormFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["text", "select", "chips"]),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

export const FormSchema = z.object({
  type: z.literal("form"),
  form_id: z.string(),
  title: z.string(),
  fields: z.array(FormFieldSchema),
  submit_label: z.string().default("Submit"),
});

export const CarouselSchema = z.object({
  type: z.literal("carousel"),
  title: z.string().optional(),
  items: z.array(CardSchema),
});

export const UiDirectiveSchema = z.discriminatedUnion("type", [
  NoticeSchema,
  CardSchema,
  ImageSchema,
  FormSchema,
  CarouselSchema,
]);

export type UiDirective = z.infer<typeof UiDirectiveSchema>;
export const UiEnvelopeSchema = z.object({
  directives: z.array(UiDirectiveSchema),
});
export type UiEnvelope = z.infer<typeof UiEnvelopeSchema>;

// State machine types
export const DialogueStateSchema = z.enum([
  "GREET",
  "QUALIFY", 
  "CLARIFY",
  "ANSWER",
  "OFFER",
  "WRAP"
]);

export type DialogueState = z.infer<typeof DialogueStateSchema>;

// Event types for session recording
export const SessionEventSchema = z.object({
  timestamp: z.number(),
  kind: z.enum(["user_text", "ai_response", "emit", "state_change"]),
  payload: z.record(z.any()),
});

export type SessionEvent = z.infer<typeof SessionEventSchema>;
