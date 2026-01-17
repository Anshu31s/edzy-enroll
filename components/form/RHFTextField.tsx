"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues> = {
  id: string;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  disabled?: boolean;

  // RHF
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;

  prefix?: string; // e.g. "+91"
};

export function RHFTextField<T extends FieldValues>({
  id,
  label,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  disabled,
  name,
  register,
  errors,
  prefix,
}: Props<T>) {
  const message = errors?.[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {prefix ? (
        <div className="flex">
          <div className="flex items-center rounded-l-md border border-r-0 bg-slate-50 px-3 text-sm text-slate-600">
            {prefix}
          </div>
          <Input
            id={id}
            className="rounded-l-none"
            placeholder={placeholder}
            type={type}
            inputMode={inputMode}
            maxLength={maxLength}
            disabled={disabled}
            {...register(name)}
          />
        </div>
      ) : (
        <Input
          id={id}
          placeholder={placeholder}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          disabled={disabled}
          {...register(name)}
        />
      )}

      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
