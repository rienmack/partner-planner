"use client"

import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Appointment } from '../types/appointment'

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment)

interface CalendarProps {
  appointments: Appointment[]
}

export function Calendar({ appointments }: CalendarProps) {
  const events = appointments.map(appointment => ({
    title: appointment.title,
    start: new Date(appointment.date),
    end: new Date(appointment.date),
  }))

  return (
    <div className="h-[600px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  )
}

