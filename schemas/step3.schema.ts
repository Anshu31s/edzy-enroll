import { z } from "zod";

export const step3Schema = z.object({
  // PIN: /^\d{6}$/
  pinCode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),

  state: z.string().trim().min(2, "State / UT is required"),
  city: z.string().trim().min(2, "City is required"),

  // Address: 10–120 chars
  addressLine: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(120, "Address must be at most 120 characters"),

  guardianName: z.string().trim().min(2, "Guardian name is required"),

  // Guardian mobile: /^[6-9]\d{9}$/
  guardianMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit guardian mobile number"),

  paymentPlan: z.enum(["Quarterly", "Half-Yearly", "Annual"]),
  paymentMode: z.enum(["UPI", "Card", "NetBanking"]),
});

export type Step3Schema = z.infer<typeof step3Schema>;
