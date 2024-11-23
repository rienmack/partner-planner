"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/lib/supabase/client'

interface AvailablePartner {
  id: string
  email: string
  full_name: string
}

export function PartnerLinkForm() {
  const [availablePartners, setAvailablePartners] = useState<AvailablePartner[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAvailablePartners()
  }, [])

  const fetchAvailablePartners = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // This will only return profiles with matching passphrases due to RLS
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .neq('id', user.id)

    if (!error) {
      setAvailablePartners(data || [])
    }
    setLoading(false)
  }

  const handleSendRequest = async (partnerId: string) => {
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