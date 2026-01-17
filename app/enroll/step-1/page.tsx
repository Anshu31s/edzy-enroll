"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { step1Schema, type Step1Schema } from "@/schemas/step1.schema";
import { useEnrollment } from "@/lib/enrollment-store";

import { ProgressHeader } from "@/components/enroll/ProgressHeader";
import { Button } from "@/components/ui/button";

import { FormSection } from "@/components/form/FormSection";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";

export default function Step1Page() {
  const router = useRouter();
  const { data, update } = useEnrollment();

  const form = useForm<Step1Schema>({
    resolver: zodResolver(step1Schema),
    mode: "onTouched",
    defaultValues: {
      fullName: data.fullName ?? "",
      email: data.email ?? "",
      mobile: data.mobile ?? "",
      classLevel: (data.classLevel as Step1Schema["classLevel"]) ?? undefined,
      board: (data.board as Step1Schema["board"]) ?? undefined,
      preferredLanguage:
        (data.preferredLanguage as Step1Schema["preferredLanguage"]) ?? undefined,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = form;

  // ✅ Smooth scroll to first error
  useEffect(() => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;

    const el =
      document.querySelector(`[name="${firstKey}"]`) ||
      document.getElementById(firstKey);

    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors]);

  const onSubmit = (values: Step1Schema) => {
    update(values);
    router.push("/enroll/step-2");
  };

  return (
    <div>
      <ProgressHeader step={1} />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <FormSection
          title="Student Details"
          description="Enter basic details to start your enrollment."
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <RHFTextField<Step1Schema>
              id="fullName"
              label="Full Name"
              name="fullName"
              register={register}
              errors={errors}
              placeholder="Enter your full name"
            />

            {/* Email + Mobile */}
            <div className="grid gap-5 sm:grid-cols-2">
              <RHFTextField<Step1Schema>
                id="email"
                label="Email"
                name="email"
                register={register}
                errors={errors}
                placeholder="example@gmail.com"
              />

              <RHFTextField<Step1Schema>
                id="mobile"
                label="Mobile"
                name="mobile"
                register={register}
                errors={errors}
                placeholder="9876543210"
                inputMode="numeric"
                maxLength={10}
                prefix="+91"
              />
            </div>

            {/* Class / Board / Language */}
            <div className="grid gap-5 sm:grid-cols-3">
              <RHFSelect<Step1Schema>
                label="Class"
                placeholder="Select"
                name="classLevel"
                watch={watch}
                setValue={setValue}
                errors={errors}
                options={[
                  { label: "9", value: "9" },
                  { label: "10", value: "10" },
                  { label: "11", value: "11" },
                  { label: "12", value: "12" },
                ]}
              />

              <RHFSelect<Step1Schema>
                label="Board"
                placeholder="Select"
                name="board"
                watch={watch}
                setValue={setValue}
                errors={errors}
                options={[
                  { label: "CBSE", value: "CBSE" },
                  { label: "ICSE", value: "ICSE" },
                  { label: "State Board", value: "State Board" },
                ]}
              />

              <RHFSelect<Step1Schema>
                label="Preferred Language"
                placeholder="Select"
                name="preferredLanguage"
                watch={watch}
                setValue={setValue}
                errors={errors}
                options={[
                  { label: "English", value: "English" },
                  { label: "Hindi", value: "Hindi" },
                  { label: "Hinglish", value: "Hinglish" },
                ]}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Saving..." : "Next"}
              </Button>
            </div>
          </form>
        </FormSection>
      </div>
    </div>
  );
}
