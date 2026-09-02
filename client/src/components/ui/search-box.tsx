import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBox({ value, onChange, placeholder = "Search...", className = "" }: SearchBoxProps) {
  return (
    <div className={`relative flex items-center max-w-sm w-full ${className}`}>
      <SearchIcon className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-8 text-xs bg-background border border-input rounded-lg outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary/20 duration-150"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 p-0.5 rounded-md text-muted-foreground/60 hover:bg-muted hover:text-foreground duration-150 cursor-pointer"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  )
}