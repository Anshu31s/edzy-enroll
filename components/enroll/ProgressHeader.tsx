"use client";

import { Progress } from "@/components/ui/progress";

export function ProgressHeader({ step }: { step: 1 | 2 | 3 | 4 }) {
  const percent = (step / 4) * 100;

  return (
    <div className="border-b bg-white">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-900">Enrollment</p>
          <p className="text-sm text-slate-500">{step}/4</p>
        </div>
        <div className="mt-3">
          <Progress value={percent} />
        </div>
      </div>
    </div>
  );
}
