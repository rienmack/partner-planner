"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/lib/supabase/client'
import { Copy } from 'lucide-react'

export function PassphraseManager() {
  const [currentPassphrase, setCurrentPassphrase] = useState<string | null>(null)
  const [newPassphrase, setNewPassphrase] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchPassphrase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
          .from('profiles')
          .select('passphrase')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setCurrentPassphrase(data?.passphrase || null)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch current passphrase",
          variant: "destructive",
        })
        console.error(error);
      } finally {
        setLoading(false)
      }
    }

    fetchPassphrase()
  }, [supabase, toast])


  const handleUpdatePassphrase = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({ passphrase: newPassphrase.trim() })
        .eq('id', user.id)

      if (error) throw error

      setCurrentPassphrase(newPassphrase.trim())
      setNewPassphrase('')

      toast({
        title: "Success",
        description: "Your passphrase has been updated",
      })
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update passphrase",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const copyPassphrase = async () => {
    if (currentPassphrase) {
      await navigator.clipboard.writeText(currentPassphrase)
      toast({
        title: "Copied",
        description: "Passphrase copied to clipboard",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Passphrase</CardTitle>
        <CardDescription>
          Share this passphrase with your partner to connect. You&apos;ll only be able to see other users
          who have the same passphrase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPassphrase ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription className="flex items-center justify-between">
                <span className="font-mono">{currentPassphrase}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPassphrase}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              You haven&apos;t set a passphrase yet. Set one to connect with your partner.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleUpdatePassphrase} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-passphrase">
              {currentPassphrase ? 'Update Passphrase' : 'Set Passphrase'}
            </Label>
            <Input
              id="new-passphrase"
              value={newPassphrase}
              onChange={(e) => setNewPassphrase(e.target.value)}
              placeholder="Enter a unique passphrase"
              required
            />
            <p className="text-sm text-muted-foreground">
              Share this passphrase with your partner to connect
            </p>
          </div>

          <Button
            type="submit"
            disabled={updating || !newPassphrase.trim()}
          >
            {updating ? 'Updating...' : (currentPassphrase ? 'Update Passphrase' : 'Set Passphrase')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 
