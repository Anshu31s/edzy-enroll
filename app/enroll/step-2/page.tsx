"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { step2Schema } from "@/schemas/step2.schema";
import { useEnrollment } from "@/lib/enrollment-store";
import { SUBJECTS_BY_CLASS } from "@/lib/subject-catalog";

import { ProgressHeader } from "@/components/enroll/ProgressHeader";
import { SubjectMultiSelect } from "@/components/enroll/SubjectMultiSelect";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define Form Types
// z.input allows fields like 'weeklyStudyHours' to be treated as strings/unknown before coercion
type Step2FormValues = z.input<typeof step2Schema>;
// z.infer guarantees the final output is 'number' as required by the enrollment store
type Step2Output = z.infer<typeof step2Schema>;

export default function Step2Page() {
  const router = useRouter();
  const { data, update } = useEnrollment();

  // ✅ Guard: Ensure previous steps are complete
  useEffect(() => {
    if (!data.fullName || !data.email || !data.mobile || !data.classLevel) {
      router.replace("/enroll/step-1");
    }
  }, [data, router]);

  const classLevel = (data.classLevel ?? "10") as "9" | "10" | "11" | "12";
  const subjectOptions = SUBJECTS_BY_CLASS[classLevel] || [];

  const form = useForm<Step2FormValues, any, Step2Output>({
    resolver: zodResolver(step2Schema),
    mode: "onTouched",
    defaultValues: {
      classLevel,
      subjects: data.subjects ?? [],
      examGoal: ["Board Excellence", "Concept Mastery", "Competitive Prep"].includes(data.examGoal as string)
        ? (data.examGoal as Step2FormValues["examGoal"])
        : undefined,
      weeklyStudyHours: data.weeklyStudyHours ?? 10,
      scholarship: data.scholarship ?? false,
      lastExamPercentage: data.lastExamPercentage ?? undefined,
      achievements: data.achievements ?? "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = form;

  // ✅ Register hidden classLevel so Zod refinements can access it
  useEffect(() => {
    register("classLevel");
  }, [register]);

  const scholarship = watch("scholarship");
  const currentSubjects = watch("subjects") ?? [];
  const currentExamGoal = watch("examGoal");

  // ✅ Updated onSubmit with explicit data type for 'values'
  const onSubmit = (values: Step2Output) => {
    // values is now Step2Output, ensuring weeklyStudyHours is number | undefined
    update(values);
    router.push("/enroll/step-3");
  };

  return (
    <div>
      <ProgressHeader step={2} />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Academic Details</CardTitle>
            <p className="text-sm text-slate-500">
              Select your subjects, goal and weekly study hours.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Subjects */}
              <div className="space-y-2">
                <Label>Subjects (based on Class {classLevel})</Label>
                <SubjectMultiSelect
                  options={subjectOptions}
                  value={currentSubjects}
                  onChange={(v) => setValue("subjects", v, { shouldValidate: true })}
                />
                {errors.subjects && (
                  <p className="text-sm text-red-600">{errors.subjects.message}</p>
                )}
              </div>

              {/* Exam Goal */}
              <div className="space-y-2">
                <Label>Exam Goal</Label>
                <RadioGroup
                  value={currentExamGoal}
                  onValueChange={(v) =>
                    setValue("examGoal", v as Step2FormValues["examGoal"], {
                      shouldValidate: true,
                    })
                  }
                  className="grid gap-2"
                >
                  {["Board Excellence", "Concept Mastery", "Competitive Prep"].map((g) => (
                    <div
                      key={g}
                      className="flex items-center gap-2 rounded-xl border p-3 hover:bg-slate-50 transition-colors"
                    >
                      <RadioGroupItem value={g} id={g} />
                      <Label htmlFor={g} className="flex-1 cursor-pointer">{g}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.examGoal && <p className="text-sm text-red-600">{errors.examGoal.message}</p>}
              </div>

              {/* Weekly Study Hours */}
              <div className="space-y-2">
                <Label htmlFor="weeklyStudyHours">Weekly Study Hours (1–40)</Label>
                <Input
                  id="weeklyStudyHours"
                  type="number"
                  {...register("weeklyStudyHours", { valueAsNumber: true })}
                  placeholder="10"
                />
                {errors.weeklyStudyHours && (
                  <p className="text-sm text-red-600">{errors.weeklyStudyHours.message}</p>
                )}
              </div>

              {/* Scholarship Switch */}
              <div className="flex items-center justify-between rounded-xl border p-4 bg-slate-50/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900">Scholarship Application?</p>
                  <p className="text-xs text-slate-500">Required for fee waiver consideration.</p>
                </div>
                <Switch
                  checked={scholarship}
                  onCheckedChange={(v) => setValue("scholarship", v, { shouldValidate: true })}
                />
              </div>

              {/* Conditional Scholarship Fields */}
              {scholarship && (
                <div className="space-y-4 rounded-xl border p-4 border-dashed animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label htmlFor="lastExamPercentage">Last Exam Percentage (0–100)</Label>
                    <Input
                      id="lastExamPercentage"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 92.5"
                      onChange={(e) => {
                        const val = e.target.value;
                        setValue(
                          "lastExamPercentage",
                          val === "" ? undefined : Number(val),
                          { shouldValidate: true }
                        );
                      }}
                      value={(watch("lastExamPercentage") as number | undefined) ?? ""}
                    />
                    {errors.lastExamPercentage && (
                      <p className="text-sm text-red-600">{errors.lastExamPercentage.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="achievements">Achievements (optional)</Label>
                    <Textarea
                      id="achievements"
                      placeholder="Awards, school rank, etc."
                      {...register("achievements")}
                    />
                    {errors.achievements && (
                      <p className="text-sm text-red-600">{errors.achievements.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/enroll/step-1")}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Next Step"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}