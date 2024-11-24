"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PartnerRequest } from '@/types/partner'

export function PartnerRequests() {
  const [requests, setRequests] = useState<PartnerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchRequests()

    // Subscribe to changes
    const channel = supabase
      .channel('partner_requests')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'partner_requests' },
        () => fetchRequests()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('partner_requests')
      .select(`
        *,
        requester:profiles!requester_id(email, full_name),
        recipient:profiles!recipient_id(email, full_name)
      `)
      .eq('recipient_id', user.id)
      .eq('status', 'pending')

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch partner requests",
        variant: "destructive",
      })
    } else {
      setRequests(data || [])
    }
    setLoading(false)
  }

  const handleRequest = async (requestId: string, accept: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('partner_requests')
        .update({
          status: accept ? 'accepted' : 'rejected'
        })
        .eq('id', requestId)

      if (updateError) throw updateError

      if (accept) {
        // Update both profiles if accepted
        const request = requests.find(r => r.id === requestId)
        if (!request) return

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ partner_id: request.requester_id })
          .eq('id', request.recipient_id)

        if (profileError) throw profileError

        const { error: partnerError } = await supabase
          .from('profiles')
          .update({ partner_id: request.recipient_id })
          .eq('id', request.requester_id)

        if (partnerError) throw partnerError
      }

      toast({
        title: accept ? "Request Accepted" : "Request Rejected",
        description: accept ? "You are now linked with your partner" : "Partner request rejected",
      })
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to process request",
        variant: "destructive",
      })
    }
  }

  if (loading) return <div>Loading...</div>

  if (requests.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partner Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">
                  {request.requester.full_name || request.requester.email}
                </p>
                <p className="text-sm text-gray-500">wants to be your partner</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleRequest(request.id, false)}
                >
                  Decline
                </Button>
                <Button
                  onClick={() => handleRequest(request.id, true)}
                >
                  Accept
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
