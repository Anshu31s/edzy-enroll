"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { enrollmentSchema } from "@/schemas/enrollment.schema";
import { useEnrollment } from "@/lib/enrollment-store";

import { ProgressHeader } from "@/components/enroll/ProgressHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900 text-right">
        {value ?? <span className="text-slate-400">—</span>}
      </p>
    </div>
  );
}

export default function ReviewPage() {
  const router = useRouter();
  const { data, clear } = useEnrollment();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Guard: cannot open review if step-3 incomplete
  useEffect(() => {
    if (!data.fullName || !data.classLevel) router.replace("/enroll/step-1");
    else if (!data.subjects || data.subjects.length === 0) router.replace("/enroll/step-2");
    else if (!data.pinCode || !data.guardianMobile) router.replace("/enroll/step-3");
  }, [data, router]);

  const payload = useMemo(() => data, [data]);

  const submit = async () => {
    // ✅ Final validation across all steps
    const result = enrollmentSchema.safeParse(payload);
    if (!result.success) {
      // send user back to first invalid step
      const fields = result.error.issues.map((i) => i.path.join("."));
      const step1Fields = ["fullName", "email", "mobile", "classLevel", "board", "preferredLanguage"];
      const step3Fields = [
        "pinCode",
        "state",
        "city",
        "addressLine",
        "guardianName",
        "guardianMobile",
        "paymentPlan",
        "paymentMode",
      ];

      if (fields.some((f) => step1Fields.includes(f))) router.push("/enroll/step-1");
      else if (fields.some((f) => step3Fields.includes(f))) router.push("/enroll/step-3");
      else router.push("/enroll/step-2");

      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);

    console.log("✅ Enrollment Payload:", result.data);
    setSuccess(true);
  };

  return (
    <div>
      <ProgressHeader step={4} />

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {success && (
          <Alert className="rounded-2xl">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Enrollment Submitted!</AlertTitle>
            <AlertDescription>
              Your enrollment has been successfully submitted.
            </AlertDescription>
          </Alert>
        )}

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Review & Submit</CardTitle>
              <p className="text-sm text-slate-500">
                Verify details before submitting.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1 */}
            <div className="rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Student Details</p>
                <Button variant="outline" size="sm" onClick={() => router.push("/enroll/step-1")}>
                  Edit
                </Button>
              </div>

              <Separator className="my-3" />

              <Row label="Full Name" value={data.fullName} />
              <Row label="Email" value={data.email} />
              <Row label="Mobile" value={data.mobile ? `+91 ${data.mobile}` : ""} />
              <Row label="Class" value={data.classLevel} />
              <Row label="Board" value={data.board} />
              <Row label="Preferred Language" value={data.preferredLanguage} />
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Academic Details</p>
                <Button variant="outline" size="sm" onClick={() => router.push("/enroll/step-2")}>
                  Edit
                </Button>
              </div>

              <Separator className="my-3" />

              <Row label="Subjects" value={(data.subjects ?? []).join(", ")} />
              <Row label="Exam Goal" value={data.examGoal} />
              <Row label="Weekly Study Hours" value={data.weeklyStudyHours} />
              <Row label="Scholarship" value={data.scholarship ? "Yes" : "No"} />
              {data.scholarship && (
                <>
                  <Row label="Last Exam %" value={data.lastExamPercentage} />
                  <Row label="Achievements" value={data.achievements} />
                </>
              )}
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Address & Guardian</p>
                <Button variant="outline" size="sm" onClick={() => router.push("/enroll/step-3")}>
                  Edit
                </Button>
              </div>

              <Separator className="my-3" />

              <Row label="PIN Code" value={data.pinCode} />
              <Row label="State" value={data.state} />
              <Row label="City" value={data.city} />
              <Row label="Address" value={data.addressLine} />
              <Row label="Guardian Name" value={data.guardianName} />
              <Row label="Guardian Mobile" value={data.guardianMobile ? `+91 ${data.guardianMobile}` : ""} />
              <Row label="Payment Plan" value={data.paymentPlan} />
              <Row label="Payment Mode" value={data.paymentMode} />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => clear()}>
                Clear Draft
              </Button>

              <Button onClick={submit} disabled={submitting || success}>
                {submitting ? "Submitting..." : success ? "Submitted" : "Submit"}
              </Button>
            </div>

            {/* Payload JSON (collapsible) */}
            <Accordion type="single" collapsible>
              <AccordionItem value="json">
                <AccordionTrigger>View JSON Payload</AccordionTrigger>
                <AccordionContent>
                  <pre className="max-h-[260px] overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-white">
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
