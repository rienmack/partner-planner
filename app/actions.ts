"use server"

import { requireAuth } from '@/lib/auth'
import { Event } from '@/types/event'
import { createClient } from '@/lib/supabase/server'

export async function createEvent(formData: FormData): Promise<Event> {
  const user = await requireAuth()
  const supabase = createClient()
  
  const event: Event = {
    creator_id: user.id,
    title: formData.get('title') as string,
    date: formData.get('date') as string,
    created_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function linkPartner(partnerEmail: string) {
  const user = await requireAuth()
  const supabase = createClient()
  
  // Find partner's profile
  const { data: partnerProfile, error: partnerError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', partnerEmail)
    .single()

  if (partnerError || !partnerProfile) {
    throw new Error('Partner not found')
  }

  // Update both profiles to link them
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ partner_id: partnerProfile.id })
    .eq('id', user.id)

  if (updateError) throw updateError

  const { error: partnerUpdateError } = await supabase
    .from('profiles')
    .update({ partner_id: user.id })
    .eq('id', partnerProfile.id)

  if (partnerUpdateError) throw partnerUpdateError

  return { success: true }
} 