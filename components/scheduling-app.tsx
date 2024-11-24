"use client"

import { useState, useEffect, useCallback } from 'react'
import { EventCalendar } from './calendar'
import { EventForm } from './event-form'
import { EventList } from './event-list'
import { Event } from '@/types/event'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PartnerLinkForm } from './partner-link-form'
import { PartnerInfo } from './partner-info'
import { PartnerRequests } from './partner-requests'
import { PassphraseManager } from './passphrase-manager'

interface SchedulingAppProps {
  userId: string
}

export function SchedulingApp({ userId }: SchedulingAppProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])

  const fetchEvents = useCallback(async () => {
    const supabase = createClient()

    // First get the user's partner_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('partner_id')
      .eq('id', userId)
      .single()

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      })
      return
    }

    // Fetch events for both user and partner
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or(`creator_id.eq.${userId},creator_id.eq.${profile.partner_id}`)
      .order('date', { ascending: true })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
    } else {
      setEvents(data || [])
    }
  }, [toast, userId]);

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  const addEvent = async (event: Event) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('events')
      .insert([{ ...event, creator_id: userId }])

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Event created successfully",
      })
      fetchEvents()
    }
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
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="new">New Event</TabsTrigger>
          <TabsTrigger value="partner">Partner</TabsTrigger>
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

        <TabsContent value="partner" className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-8">
            <PassphraseManager />
            <PartnerRequests />
            <PartnerInfo userId={userId} />
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">Link New Partner</h2>
                <p className="text-sm text-gray-600">
                  Send a request to connect with your partner
                </p>
              </div>
              <PartnerLinkForm />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

