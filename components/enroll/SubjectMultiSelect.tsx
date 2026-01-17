"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Props = {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
};

export function SubjectMultiSelect({ options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selectedSet = useMemo(() => new Set(value), [value]);

  const toggle = (item: string) => {
    if (selectedSet.has(item)) onChange(value.filter((x) => x !== item));
    else onChange([...value, item]);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="w-full justify-between">
            Select subjects
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[340px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search subject..." />
            <CommandList>
              <CommandEmpty>No subject found.</CommandEmpty>

              {options.map((item) => (
                <CommandItem key={item} onSelect={() => toggle(item)}>
                  <span className="mr-2 flex h-5 w-5 items-center justify-center rounded border">
                    {selectedSet.has(item) ? <Check className="h-4 w-4" /> : null}
                  </span>
                  {item}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {value.length === 0 ? (
          <p className="text-sm text-slate-500">No subjects selected</p>
        ) : (
          value.map((item) => (
            <Badge key={item} variant="secondary" className="gap-1">
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== item))}
                className="ml-1 rounded hover:bg-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
