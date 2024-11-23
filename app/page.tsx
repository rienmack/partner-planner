import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SchedulingApp } from '../components/scheduling-app'
import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Home() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto p-4 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Partner Planner</CardTitle>
              <CardDescription>Please login to access your planner</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="container mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <SchedulingApp userId={user.id} />
      </main>
    </div>
  )
}

