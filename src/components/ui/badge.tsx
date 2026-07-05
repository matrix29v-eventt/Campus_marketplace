import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200": variant === "default",
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300": variant === "success",
          "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300": variant === "warning",
          "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300": variant === "danger",
          "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300": variant === "info",
        },
        className
      )}
    >
      {children}
    </span>
  )
}
