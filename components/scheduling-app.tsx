"use client"

import { useState } from 'react'
import { EventCalendar } from './calendar'
import { EventForm } from './event-form'
import { EventList } from './event-list'
import { Event } from '../types/event'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SchedulingApp() {
  const [events, setEvents] = useState<Event[]>([])

  const addEvent = (event: Event) => {
    setEvents([...events, event])
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">Partner Scheduling App</h1>
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View all your scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <EventCalendar events={events} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Manage your scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <EventList events={events} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Event</CardTitle>
              <CardDescription>Schedule a new event</CardDescription>
            </CardHeader>
            <CardContent>
              <EventForm onAddEvent={addEvent} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

