import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

type DatePickerWithRangeProps = {
  startDate: Date
  endDate: Date
  setStartDate: (date: Date) => void
  setEndDate: (date: Date) => void
}

export function DatePickerWithRange({
  className,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: React.HTMLAttributes<HTMLDivElement> & DatePickerWithRangeProps) {
  const date = { from: startDate, to: endDate }

  const setDate = (date: DateRange | undefined) => {
    if (date === undefined) return
    if (date.from) {
      setStartDate(date.from)
    }
    if (date.to) {
      setEndDate(date.to)
    }
  }

  return (
    <div className={cn("grid gap-2 ", className)}>
      <div className="flex items-center justify-between">
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            " justify-start text-left font-normal h-12 w-full",
            !date && "text-muted-foreground ",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick your starting and ending date</span>
          )}
        </Button>
      </div>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={1}
      />
    </div>
  )
}
