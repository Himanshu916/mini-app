import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, bg, isShowPercent, textColor, ...props }, ref) => (
  <div className="relative">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        `relative  w-full overflow-hidden rounded-full bg-secondary`,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 ${bg} rounded-full transition-all`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      ></ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
    {isShowPercent && (
      <span
        className={` absolute font-medium text-xs top-0  ${
          value <= 25
            ? `left-[50%] translate-x-[-50%]  ${textColor} `
            : `left-2  text-white `
        }    `}
      >
        {Math.round(Number(value)?.toFixed(2))}%
      </span>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
