"use client"

import { CalendarIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Appointment } from '../types/appointment'
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface CalendarProps {
  appointments: Appointment[]
}

export function AppointmentCalendar({ appointments }: CalendarProps) {
  const today = new Date()
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + 6)

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <CalendarComponent
          mode="range"
          selected={{
            from: today,
            to: endOfWeek
          }}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {[...Array(7)].map((_, index) => {
          const date = new Date(today)
          date.setDate(today.getDate() + index)
          const dayAppointments = appointments.filter(
            (apt) => new Date(apt.date).toDateString() === date.toDateString()
          )

          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
                <div className="text-2xl font-bold mb-2">{date.getDate()}</div>
                <div className="space-y-1">
                  {dayAppointments.map((apt, i) => (
                    <Badge key={i} variant="secondary">{apt.title}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

