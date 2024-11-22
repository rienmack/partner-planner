"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Appointment } from '../types/appointment'

interface AppointmentFormProps {
  onAddAppointment: (appointment: Appointment) => void
}

export function AppointmentForm({ onAddAppointment }: AppointmentFormProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && date) {
      onAddAppointment({ title, date })
      setTitle('')
      setDate('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <Label htmlFor="title">Appointment Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Add Appointment</Button>
    </form>
  )
}

