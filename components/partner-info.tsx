"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  email: string
  full_name?: string
  partner_id?: string
}

export function PartnerInfo({ userId }: { userId: string }) {
  const [partner, setPartner] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPartner()
  }, [])

  const fetchPartner = async () => {
    const supabase = createClient()

    // First get the current user's partner_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('partner_id')
      .eq('id', userId)
      .single()

    if (profileError || !profile.partner_id) {
      setLoading(false)
      return
    }

    // Then get the partner's profile
    const { data: partnerProfile, error: partnerError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', profile.partner_id)
      .single()

    if (partnerError) {
      toast({
        title: "Error",
        description: "Failed to fetch partner information",
        variant: "destructive",
      })
    } else {
      setPartner(partnerProfile)
    }

    setLoading(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!partner) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Partner</CardTitle>
        <CardDescription>You are currently linked with:</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">{partner.full_name || 'Unnamed Partner'}</p>
          <p className="text-sm text-gray-500">{partner.email}</p>
        </div>
      </CardContent>
    </Card>
  )
} 
