import * as React from "react"
import { Input } from "@/components/ui/input"

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  label: string
  required?: boolean
  isSubmitted: boolean
  value: string
  errorText?: string
}

export function FormField({ label, required, isSubmitted, value, errorText, className, ...props }: FormFieldProps) {
  // Border color စစ်ဆေးခြင်း
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
      <Input 
        value={value}
        className={`${getInputClass()} ${className || ""}`}
        {...props} 
      />
      {isSubmitted && value.trim() === "" && (
        <span className="text-[11px] text-destructive font-medium animate-in fade-in-50 duration-200">
          {errorText || `${label} ဖြည့်သွင်းရန် လိုအပ်ပါသည်။`}
        </span>
      )}
    </div>
  )
}