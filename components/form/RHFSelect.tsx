"use client";

import { Label } from "@/components/ui/label";
import type { FieldErrors, FieldValues, Path, UseFormSetValue, UseFormWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { label: string; value: string };

type Props<T extends FieldValues> = {
  label: string;
  placeholder?: string;
  options: Option[];

  // RHF
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
};

export function RHFSelect<T extends FieldValues>({
  label,
  placeholder = "Select",
  options,
  name,
  setValue,
  watch,
  errors,
}: Props<T>) {
  const value = watch(name) as string | undefined;
  const message = errors?.[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Select
        value={value}
        onValueChange={(v) =>
          setValue(name, v as any, { shouldValidate: true })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
