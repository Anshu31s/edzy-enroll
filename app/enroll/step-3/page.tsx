"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { step3Schema, type Step3Schema } from "@/schemas/step3.schema";
import { useEnrollment } from "@/lib/enrollment-store";
import { PIN_LOOKUP } from "@/lib/pin-map";

import { ProgressHeader } from "@/components/enroll/ProgressHeader";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Step3Page() {
  const router = useRouter();
  const { data, update } = useEnrollment();

  // ✅ Route guard: Must finish step-1 and step-2 first
  useEffect(() => {
    if (!data.fullName || !data.classLevel || !data.mobile || !data.email) {
      router.replace("/enroll/step-1");
      return;
    }
    if (!data.subjects || data.subjects.length === 0 || !data.examGoal) {
      router.replace("/enroll/step-2");
      return;
    }
  }, [data, router]);

  const form = useForm<Step3Schema>({
    resolver: zodResolver(step3Schema),
    mode: "onTouched",
    defaultValues: {
      pinCode: data.pinCode ?? "",
      state: data.state ?? "",
      city: data.city ?? "",
      addressLine: data.addressLine ?? "",
      guardianName: data.guardianName ?? "",
      guardianMobile: data.guardianMobile ?? "",
      paymentPlan: (data.paymentPlan as Step3Schema["paymentPlan"]) ?? undefined,
      paymentMode: (data.paymentMode as Step3Schema["paymentMode"]) ?? undefined,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = form;

  const pin = watch("pinCode");

  // ✅ PIN Auto Fill (mock)
  useEffect(() => {
    if (!pin) return;

    if (/^\d{6}$/.test(pin)) {
      const hit = PIN_LOOKUP[pin];
      if (hit) {
        setValue("state", hit.state, { shouldValidate: true });
        setValue("city", hit.city, { shouldValidate: true });
      }
    }
  }, [pin, setValue]);

  const onSubmit = (values: Step3Schema) => {
    update(values);
    router.push("/enroll/review");
  };

  return (
    <div>
      <ProgressHeader step={3} />

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Address & Guardian</CardTitle>
            <p className="text-sm text-slate-500">
              Fill your address and guardian details to continue.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* ✅ Address section */}
              <Card className="rounded-2xl border shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Address</CardTitle>
                  <p className="text-sm text-slate-500">
                    Enter your PIN to auto-fill State/City (mock).
                  </p>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="pinCode">PIN Code</Label>
                      <Input
                        id="pinCode"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="e.g. 560001"
                        {...register("pinCode")}
                      />
                      {errors.pinCode && (
                        <p className="text-sm text-red-600">{errors.pinCode.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State / UT</Label>
                      <Input id="state" placeholder="e.g. Karnataka" {...register("state")} />
                      {errors.state && (
                        <p className="text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="e.g. Bengaluru" {...register("city")} />
                      {errors.city && (
                        <p className="text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine">Address Line</Label>
                    <Input
                      id="addressLine"
                      placeholder="House no, street, locality..."
                      {...register("addressLine")}
                    />
                    {errors.addressLine && (
                      <p className="text-sm text-red-600">{errors.addressLine.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Guardian section */}
              <Card className="rounded-2xl border shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Guardian</CardTitle>
                  <p className="text-sm text-slate-500">
                    Parent/Guardian contact for communication.
                  </p>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="guardianName">Guardian Name</Label>
                      <Input id="guardianName" {...register("guardianName")} />
                      {errors.guardianName && (
                        <p className="text-sm text-red-600">
                          {errors.guardianName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guardianMobile">Guardian Mobile</Label>
                      <div className="flex">
                        <div className="flex items-center rounded-l-md border border-r-0 bg-slate-50 px-3 text-sm text-slate-600">
                          +91
                        </div>
                        <Input
                          id="guardianMobile"
                          className="rounded-l-none"
                          inputMode="numeric"
                          maxLength={10}
                          {...register("guardianMobile")}
                        />
                      </div>
                      {errors.guardianMobile && (
                        <p className="text-sm text-red-600">
                          {errors.guardianMobile.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Payment section */}
              <Card className="rounded-2xl border shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Preference</CardTitle>
                  <p className="text-sm text-slate-500">
                    Select your plan and preferred payment mode.
                  </p>
                </CardHeader>

                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Preferred Payment Plan</Label>
                    <Select
                      value={watch("paymentPlan")}
                      onValueChange={(v) =>
                        setValue("paymentPlan", v as Step3Schema["paymentPlan"], {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                        <SelectItem value="Annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>

                    {errors.paymentPlan && (
                      <p className="text-sm text-red-600">{errors.paymentPlan.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Mode Preference</Label>
                    <Select
                      value={watch("paymentMode")}
                      onValueChange={(v) =>
                        setValue("paymentMode", v as Step3Schema["paymentMode"], {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="NetBanking">NetBanking</SelectItem>
                      </SelectContent>
                    </Select>

                    {errors.paymentMode && (
                      <p className="text-sm text-red-600">{errors.paymentMode.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Actions */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/enroll/step-2")}
                >
                  Back
                </Button>

                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? "Saving..." : "Next"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
