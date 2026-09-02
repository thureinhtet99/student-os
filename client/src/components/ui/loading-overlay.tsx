import * as React from "react"
import { CheckCircle2Icon } from "lucide-react"

interface AlertBannerProps {
  show: boolean
  title: string
  description: string
  duration?: number
  onClose: () => void
}

export function AlertBanner({ show, title, description, duration = 3000, onClose }: AlertBannerProps) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300 min-w-[300px]">
      <CheckCircle2Icon className="size-5 shrink-0 text-emerald-500" />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs opacity-90">{description}</p>
      </div>
    </div>
  )
}