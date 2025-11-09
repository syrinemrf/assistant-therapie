import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number[]
  onValueChange?: (value: number[]) => void
  max?: number
  step?: number
  min?: number
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = [50], onValueChange, max = 100, step = 1, min = 0, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      onValueChange?.([newValue])
    }

    return (
      <div ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }