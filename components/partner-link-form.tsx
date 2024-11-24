"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/client'
import { Partner } from '@/types/partner'

// Create this outside the component to persist between re-renders
const fetchController = {
  hasRun: false
}

export function PartnerLinkForm() {
  const [availablePartners, setAvailablePartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    console.log('Fetching partners...');   
     if (fetchController.hasRun) {
      setLoading(false)
      return
    }

    const fetchPartners = async () => {
      try {
        fetchController.hasRun = true
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !isMounted) return
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .neq('id', user.id)
          .single()

        if (!error && isMounted) {
          setAvailablePartners(data ? [data] : [])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPartners()

    return () => {
      isMounted = false
    }
  }, [])

  const handleSendRequest = async (partnerId: string) => {
    console.log('Sending request to partner:', partnerId)
    // Your existing request sending logic
  }

  if (loading) {
    return <div>Loading available partners...</div>
  }

  if (availablePartners.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No available partners found. Make sure you and your partner have set the same passphrase.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {availablePartners.map((partner) => (
            <div key={partner.id} 
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{partner.full_name}</p>
                <p className="text-sm text-muted-foreground">{partner.email}</p>
              </div>
              <Button 
                onClick={() => handleSendRequest(partner.id)}
                variant="outline"
              >
                Send Request
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 