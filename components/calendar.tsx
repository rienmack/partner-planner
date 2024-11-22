"use client"

import { useState, useMemo } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Appointment } from '../types/appointment'
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { eachDayOfInterval, isSameDay } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"

interface CalendarProps {
  appointments: Appointment[]
}

export function AppointmentCalendar({ appointments }: CalendarProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  } | undefined>({
    from: new Date(),
    to: new Date()
  })

  const handleSelect = (range: { from: Date; to: Date } | undefined) => {
    setDateRange(range)
  }

  const selectedDays = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
    }
    return []
  }, [dateRange])

  const gridColumns = useMemo(() => {
    const count = selectedDays.length
    if (count <= 7) return `grid-cols-${count}`
    if (count <= 14) return 'grid-cols-7'
    return 'grid-cols-7 lg:grid-cols-14'
  }, [selectedDays.length])

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <CalendarComponent
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          className="rounded-md border"
        />
      </div>
      <ScrollArea className="h-[400px] rounded-md border">
        <div className={`grid gap-2 p-4 ${gridColumns}`}>
          {selectedDays.map((date, index) => {
            const dayAppointments = appointments.filter((apt) =>
              isSameDay(new Date(apt.date), date)
            )

            return (
              <Card key={index} className="h-full">
                <CardContent className="p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-semibold text-xs">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                  <div className="text-lg font-bold mb-2">{date.getDate()}</div>
                  <div className="space-y-1">
                    {dayAppointments.map((apt, i) => (
                      <Badge key={i} variant="secondary" className="text-xs truncate">
                        {apt.title}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

