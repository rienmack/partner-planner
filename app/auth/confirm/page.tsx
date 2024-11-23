import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { token_hash?: string; type?: string }
}) {
  const supabase = createClient()

  if (searchParams.token_hash && searchParams.type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: searchParams.token_hash,
      type: searchParams.type as any,
    })

    if (!error) {
      // Redirect to the main app after successful confirmation
      redirect('/')
    }
  }

  // If there's an error or no token, redirect to home
  redirect('/')
} 