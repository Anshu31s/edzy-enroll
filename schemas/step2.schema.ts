import { z } from "zod";

export const step2Schema = z
  .object({
    classLevel: z.enum(["9", "10", "11", "12"]),

    subjects: z.array(z.string()).min(1, "Pick at least 1 subject"),

    examGoal: z.enum(["Board Excellence", "Concept Mastery", "Competitive Prep"]),

    // ✅ number type (NOT unknown)
    weeklyStudyHours: z.preprocess(
      (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
      z.number().min(1, "Min 1 hour").max(40, "Max 40 hours")
    ),

    scholarship: z.boolean(),

    // ✅ OPTIONAL number (NOT unknown, NOT required)
    lastExamPercentage: z.preprocess(
      (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
      z.number().min(0, "Min 0").max(100, "Max 100").optional()
    ),

    achievements: z.string().max(300, "Max 300 characters").optional(),
  })
  .superRefine((val, ctx) => {
    // ✅ min subjects based on class
    const minSubjects = val.classLevel === "9" || val.classLevel === "10" ? 2 : 3;

    if (val.subjects.length < minSubjects) {
      ctx.addIssue({
        path: ["subjects"],
        code: z.ZodIssueCode.custom,
        message: `Select at least ${minSubjects} subjects for Class ${val.classLevel}`,
      });
    }

    // ✅ conditional scholarship rule
    if (val.scholarship) {
      if (val.lastExamPercentage === undefined || Number.isNaN(val.lastExamPercentage)) {
        ctx.addIssue({
          path: ["lastExamPercentage"],
          code: z.ZodIssueCode.custom,
          message: "Last Exam Percentage is required for scholarship",
        });
      }
    }

    // ✅ bonus cross-field rule
    if (val.classLevel === "12" && val.examGoal === "Competitive Prep") {
      if (val.subjects.length < 3) {
        ctx.addIssue({
          path: ["subjects"],
          code: z.ZodIssueCode.custom,
          message: "Class 12 + Competitive Prep requires at least 3 subjects",
        });
      }
    }
  });

export type Step2Schema = z.infer<typeof step2Schema>;
