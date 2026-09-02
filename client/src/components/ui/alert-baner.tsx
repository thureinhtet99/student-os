import * as React from "react"
import { XIcon, CheckCircle2Icon } from "lucide-react"

interface AlertBannerProps {
  show: boolean
  title: string
  description: string
  onClose: () => void
}

export function AlertBanner({ show, title, description, onClose }: AlertBannerProps) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000) // ၄ စက္ကန့်ပြည့်ရင် အလိုအလျောက် ပိတ်သွားမည်
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex w-full max-w-sm items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-600 shadow-xl backdrop-blur-md dark:text-emerald-400 animate-in fade-in slide-in-from-top-4 duration-300">
      <CheckCircle2Icon className="size-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold leading-none">{title}</h4>
        <p className="text-xs opacity-90 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  )
}