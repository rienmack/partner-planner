"use client"

import { useState } from 'react'
import { EventCalendar } from './calendar'
import { EventForm } from './event-form'
import { EventList } from './event-list'
import { Event } from '../types/event'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface SchedulingAppProps {
  userId: string
}

export function SchedulingApp({ userId }: SchedulingAppProps) {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  const addEvent = (event: Event) => {
    setEvents([...events, event])
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">
          Partner Planner
        </h1>
        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="new">New Event</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Calendar View</h2>
            <p className="text-sm text-gray-600">View all your scheduled events</p>
          </div>
          <EventCalendar events={events} />
        </TabsContent>

        <TabsContent value="events" className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Events List</h2>
            <p className="text-sm text-gray-600">Manage your upcoming events</p>
          </div>
          <EventList events={events} />
        </TabsContent>

        <TabsContent value="new" className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Create Event</h2>
            <p className="text-sm text-gray-600">Schedule a new event</p>
          </div>
          <EventForm onSubmit={addEvent} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

