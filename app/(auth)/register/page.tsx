'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function RegisterPage() {
  const router = useRouter()
  const [mdcPin, setMdcPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleVerifyMDC = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      // Check if MDC PIN exists and is active
      const { data: mdcRecord, error: mdcError } = await supabase
        .from('mdc_registry')
        .select('*')
        .eq('mdc_pin', mdcPin.trim().toUpperCase())
        .eq('is_active', true)
        .single()

      if (mdcError || !mdcRecord) {
        throw new Error('Invalid MDC PIN or PIN is not active. Please contact the Medical & Dental Council.')
      }

      // Check if user already exists with this MDC PIN
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('mdc_registry_id', mdcRecord.id)
        .single()

      if (existingUser) {
        throw new Error('An account with this MDC PIN already exists. Please login instead.')
      }

      // Store MDC data in session storage for next step
      sessionStorage.setItem('mdcRegistration', JSON.stringify({
        mdcRegistryId: mdcRecord.id,
        fullName: mdcRecord.full_name,
        email: mdcRecord.email,
        medicalQualification: mdcRecord.medical_qualification,
        regionId: mdcRecord.region_id,
        districtId: mdcRecord.district_id,
        facilityId: mdcRecord.facility_id,
      }))

      // Send OTP to email using Supabase Auth magic link
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: mdcRecord.email,
        options: {
          shouldCreateUser: false, // We'll create manually after OTP verification
        }
      })

      if (otpError) throw otpError

      // Redirect to OTP verification page
      router.push('/register/verify')
    } catch (err: any) {
      setError(err.message || 'Failed to verify MDC PIN. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Doctor Registration</CardTitle>
        <CardDescription>
          Enter your Medical & Dental Council (MDC) PIN to register
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleVerifyMDC}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertTitle>MDC PIN Verification</AlertTitle>
            <AlertDescription>
              Your MDC PIN must be registered with the Medical & Dental Council.
              A verification code will be sent to your registered email address.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="mdcPin">MDC PIN</Label>
            <Input
              id="mdcPin"
              type="text"
              placeholder="e.g., MDC-12345"
              value={mdcPin}
              onChange={(e) => setMdcPin(e.target.value)}
              required
              disabled={loading}
              className="font-mono uppercase"
            />
            <p className="text-xs text-muted-foreground">
              Format: MDC-XXXXX
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify MDC PIN'}
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
