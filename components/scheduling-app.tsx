"use client"

import { useState } from 'react'
import { AppointmentCalendar } from './calendar'
import { AppointmentForm } from './appointment-form'
import { AppointmentList } from './appointment-list'
import { Appointment } from '../types/appointment'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SchedulingApp() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment])
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Scheduler</h1>
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="new">New Appointment</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View all your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentCalendar appointments={appointments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Manage your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentList appointments={appointments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Appointment</CardTitle>
              <CardDescription>Schedule a new appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentForm onAddAppointment={addAppointment} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

