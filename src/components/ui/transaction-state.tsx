import * as React from "react"
import { cn } from "@/lib/utils"

export interface TransactionStateProps extends React.HTMLAttributes<HTMLUListElement> {
  states: {
    status: string
    icon: React.ReactNode
    description: string
    isActive: boolean
  }[]
}

const TransactionState = React.forwardRef<HTMLUListElement, TransactionStateProps>(
  ({ states, className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(
          "w-full space-y-4",
          className
        )}
        {...props}
      >
        {states.map((state) => (
          <li
            key={state.status}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-red-400 p-1 dark:border-slate-800",
              state.isActive
                ? "text-red-50 dark:bg-slate-50 dark:text-slate-900"
                : "border-red-200 dark:border-slate-800"
            )}
          >
            <span
              className={cn(
                "rounded-sm p-2",
                state.isActive
                  ? "text-slate-50 dark:bg-slate-900 dark:text-slate-50"
                  : "bg-slate-950 text-slate-50 dark:bg-slate-50 dark:text-slate-900"
              )}
            >
              {state.icon}
            </span>
            <div>
              <p className="text-sm font-medium ">{state.status}</p>
              <p
                className={cn(
                  "text-xs",
                  state.isActive
                    ? "text-red-50/80 dark:text-slate-900/80"
                    : "text-slate-950/80 dark:text-slate-50/80"
                )}
              >
                {state.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )
  }
)

TransactionState.displayName = "TransactionState"

export { TransactionState }