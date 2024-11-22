"use client"

import { useState } from 'react'
import { Calendar } from './calendar'
import { AppointmentForm } from './appointment-form'
import { AppointmentList } from './appointment-list'
import { Appointment } from '../types/appointment'

export function SchedulingApp() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Partner Scheduling App</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Calendar appointments={appointments} />
        </div>
        <div>
          <AppointmentForm onAddAppointment={addAppointment} />
          <AppointmentList appointments={appointments} />
        </div>
      </div>
    </div>
  )
}

