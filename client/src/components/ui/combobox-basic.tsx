// src/components/ui/form-combobox.tsx
"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface FormComboboxProps {
  label: string
  placeholder?: string
  required?: boolean
  isSubmitted: boolean
  value: string
  items: readonly string[] | string[]
  onValueChange: (value: string) => void
  errorText?: string
}

export function FormCombobox({
  label,
  placeholder = "Select option",
  required,
  isSubmitted,
  value,
  items,
  onValueChange,
  errorText,
}: FormComboboxProps) {
  
  // Submit လုပ်ပြီး/မပြီး အပေါ်မူတည်ပြီး Border Color စစ်ဆေးပေးခြင်း
  const getInputClass = () => {
    if (!isSubmitted) return ""
    return value.trim() !== "" 
      ? "border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20! dark:border-emerald-500" 
      : "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20!"
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-medium text-foreground/80 flex items-center gap-1">
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      {/* Base UI/Shadcn Combobox Component */}
      <Combobox 
        items={items} 
        value={value} 
        onValueChange={(val) => onValueChange(val || "")}
      >
        <ComboboxInput 
          placeholder={placeholder} 
          className={getInputClass()}
        />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item} className="cursor-pointer">
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {isSubmitted && value.trim() === "" && (
        <span className="text-[11px] text-destructive font-medium animate-in fade-in-50 duration-200">
          {errorText || `${label} ရွေးချယ်ရန် လိုအပ်ပါသည်။`}
        </span>
      )}
    </div>
  )
}