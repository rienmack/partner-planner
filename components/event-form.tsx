"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Event } from '@/types/event'

interface EventFormProps {
  onSubmit: (event: Event) => void
}

export function EventForm({ onSubmit }: EventFormProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newEvent: Event = {
      title,
      date: `${date}${time ? 'T' + time : ''}`
    }

    onSubmit(newEvent)

    setTitle('')
    setDate('')
    setTime('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input 
          id="title"
          placeholder="Enter event title"
          className="max-w-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input 
          id="date"
          type="date"
          className="max-w-md"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Time (optional)</Label>
        <Input 
          id="time"
          type="time"
          className="max-w-md"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full max-w-md">
          Create Event
        </Button>
      </div>
    </form>
  )
}

