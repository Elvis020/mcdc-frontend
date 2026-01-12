'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function CreatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mdcData, setMdcData] = useState<any>(null)

  useEffect(() => {
    // Get MDC data from session storage
    const data = sessionStorage.getItem('mdcRegistration')
    if (!data) {
      router.push('/register')
      return
    }

    setMdcData(JSON.parse(data))
  }, [router])

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate password
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Create Supabase Auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: mdcData.email,
        password,
        options: {
          data: {
            full_name: mdcData.fullName,
          },
        },
      })

      if (signUpError) throw signUpError
      if (!authData.user) throw new Error('Failed to create user account')

      // Create user record in users table
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        mdc_registry_id: mdcData.mdcRegistryId,
        full_name: mdcData.fullName,
        role: 'doctor',
        region_id: mdcData.regionId,
        district_id: mdcData.districtId,
        facility_id: mdcData.facilityId,
      })

      if (userError) throw userError

      // Clear session storage
      sessionStorage.removeItem('mdcRegistration')

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mdcData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Redirecting...</p>
        </CardContent>
      </Card>
    )
  }

  const passwordStrength = password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create Password</CardTitle>
        <CardDescription>
          Set a secure password for {mdcData.fullName}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleCreatePassword}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertTitle>Almost done!</AlertTitle>
            <AlertDescription>
              Create a strong password to secure your account.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <div className="text-xs space-y-1">
              <p className={password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}>
                ✓ At least 8 characters
              </p>
              <p className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                ✓ One uppercase letter
              </p>
              <p className={/[a-z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                ✓ One lowercase letter
              </p>
              <p className={/[0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                ✓ One number
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !passwordStrength || password !== confirmPassword}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
