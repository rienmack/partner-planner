"use server"

import { requireAuth } from '@/lib/auth'

export async function createEvent(formData: FormData) {
  const user = await requireAuth()
  
  const event = {
    userId: user.id,
    title: formData.get('title'),
    date: formData.get('date'),
    // ...other fields
  }
  
} 