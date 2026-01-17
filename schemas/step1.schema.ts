import { z } from "zod";

export const step1Schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name must be at most 60 characters")
    .regex(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  classLevel: z.enum(["9", "10", "11", "12"]),
  board: z.enum(["CBSE", "ICSE", "State Board"]),
  preferredLanguage: z.enum(["English", "Hindi", "Hinglish"]),
});

export type Step1Schema = z.infer<typeof step1Schema>;
