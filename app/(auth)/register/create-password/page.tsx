'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Eye, EyeOff, Shield, CheckCircle2 } from 'lucide-react'

export default function CreatePasswordPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [registrationData, setRegistrationData] = useState<any>(null)
  const [registrationType, setRegistrationType] = useState<'mdc' | 'email' | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(120) // 120 seconds = 2 minutes
  const [userCreatedAt, setUserCreatedAt] = useState<Date | null>(null)

  useEffect(() => {
    const checkTimeout = async () => {
      const supabase = createClient()

      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Store user creation time for countdown
      const createdAt = new Date(user.created_at)
      setUserCreatedAt(createdAt)

      // Calculate initial time remaining
      const now = new Date()
      const elapsed = (now.getTime() - createdAt.getTime()) / 1000 // seconds
      const remaining = Math.max(0, 120 - elapsed)
      setTimeRemaining(remaining)

      // Check if user was created more than 2 minutes ago
      if (remaining <= 0) {
        // Check if user has profile
        const { data: profile } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        // If no profile, registration expired
        if (!profile) {
          // Sign out the user
          await supabase.auth.signOut()

          // Clear session storage
          sessionStorage.removeItem('emailRegistration')
          sessionStorage.removeItem('mdcRegistration')

          // Redirect to login with expiration notice
          router.push('/login?expired=true')
          return
        }
      }
    }

    checkTimeout()

    // Check for email registration (OTP flow)
    const emailData = sessionStorage.getItem('emailRegistration')
    if (emailData) {
      setRegistrationData(JSON.parse(emailData))
      setRegistrationType('email')
      return
    }

    // Check for MDC registration (legacy - now handled in login page)
    const mdcData = sessionStorage.getItem('mdcRegistration')
    if (mdcData) {
      setRegistrationData(JSON.parse(mdcData))
      setRegistrationType('mdc')
      return
    }

    // No registration data found
    router.push('/login')
  }, [router])

  // Countdown timer effect
  useEffect(() => {
    if (!userCreatedAt || timeRemaining <= 0) return

    const timer = setInterval(() => {
      const now = new Date()
      const elapsed = (now.getTime() - userCreatedAt.getTime()) / 1000
      const remaining = Math.max(0, 120 - elapsed)

      setTimeRemaining(remaining)

      // When time runs out
      if (remaining <= 0) {
        clearInterval(timer)
        handleTimeout()
      }
    }, 100) // Update every 100ms for smooth animation

    return () => clearInterval(timer)
  }, [userCreatedAt])

  const handleTimeout = async () => {
    const supabase = createClient()
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .single()

    // If no profile created, sign out and redirect
    if (!profile) {
      await supabase.auth.signOut()
      sessionStorage.removeItem('emailRegistration')
      sessionStorage.removeItem('mdcRegistration')
      router.push('/login?expired=true')
    }
  }

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

    // Validate full name
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

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

      if (registrationType === 'email') {
        // Email registration (OTP flow)
        // User is already authenticated from OTP verification
        // Just need to set password and create users table record

        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          // Session expired - redirect to start
          sessionStorage.removeItem('emailRegistration')
          router.push('/login')
          return
        }

        // Update the user's password
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        })

        if (updateError) throw updateError

        // Create user record in users table
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          full_name: fullName.trim(),
          role: 'health_information_professional', // Default role for email signup
        })

        if (insertError) throw insertError

        // Clear session storage
        sessionStorage.removeItem('emailRegistration')
      } else if (registrationType === 'mdc') {
        // MDC registration (legacy path - now handled in login page)
        // Create Supabase Auth user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: registrationData.email,
          password,
          options: {
            data: {
              full_name: registrationData.fullName,
            },
          },
        })

        if (signUpError) throw signUpError
        if (!authData.user) throw new Error('Failed to create user account')

        // Create user record in users table
        const { error: userError } = await supabase.from('users').insert({
          id: authData.user.id,
          mdc_registry_id: registrationData.mdcRegistryId,
          full_name: registrationData.fullName,
          role: 'doctor',
          region_id: registrationData.regionId,
          district_id: registrationData.districtId,
          facility_id: registrationData.facilityId,
        })

        if (userError) throw userError

        // Clear session storage
        sessionStorage.removeItem('mdcRegistration')
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Redirecting...</p>
      </div>
    )
  }

  const passwordStrength = password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)

  const displayName = registrationType === 'email'
    ? registrationData.email
    : registrationData.fullName

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 px-4 py-8 overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Gradient Orbs - Hidden on mobile for performance */}
      <div
        className="hidden sm:block absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/4 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <div
        className="hidden sm:block absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/2 -translate-x-1/4 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Create Password Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
          {/* Countdown Progress Bar */}
          {userCreatedAt && timeRemaining > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
              <div
                className={`h-full transition-all duration-100 ease-linear ${
                  timeRemaining < 30 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${(timeRemaining / 120) * 100}%` }}
              />
            </div>
          )}

          <div className="p-8 sm:p-10 space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/30">
                <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-slate-900">Complete Your Profile</h1>
              <p className="text-sm text-slate-500">
                Create your account for
              </p>
              <p className="text-sm font-medium text-emerald-600">
                {displayName}
              </p>
              <div className="flex justify-center pt-2">
                <div className="w-16 h-1 bg-emerald-500 rounded-full" />
              </div>
            </div>

            <form onSubmit={handleCreatePassword} className="space-y-4 pt-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* Info Alert - All Green */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">Almost done!</p>
                      {userCreatedAt && timeRemaining > 0 && (
                        <p className={`text-xs font-mono font-semibold ${timeRemaining < 30 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {Math.floor(timeRemaining / 60)}:{String(Math.floor(timeRemaining % 60)).padStart(2, '0')}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">
                      {userCreatedAt && timeRemaining > 0 ? (
                        timeRemaining < 30 ? '⚠️ Complete soon - registration expires at 0:00' : 'Complete your profile to access your dashboard.'
                      ) : (
                        'Complete your profile to access your dashboard.'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-slate-700 block">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Requirements - All Green */}
                <div className="pt-2 space-y-1.5">
                  <p className={`text-xs flex items-center gap-1.5 ${password.length >= 8 ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <span className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                    At least 8 characters
                  </p>
                  <p className={`text-xs flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <span className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                    One uppercase letter
                  </p>
                  <p className={`text-xs flex items-center gap-1.5 ${/[a-z]/.test(password) ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <span className={`w-1 h-1 rounded-full ${/[a-z]/.test(password) ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                    One lowercase letter
                  </p>
                  <p className={`text-xs flex items-center gap-1.5 ${/[0-9]/.test(password) ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <span className={`w-1 h-1 rounded-full ${/[0-9]/.test(password) ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                    One number
                  </p>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`text-xs ${password === confirmPassword ? 'text-emerald-600 font-medium' : 'text-red-600'}`}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading || !fullName.trim() || !passwordStrength || password !== confirmPassword}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer - Outside Card */}
        <div className="mt-8 space-y-4 text-center">
          <p className="text-sm text-slate-600">
            Need help?{' '}
            <a href="#" className="text-emerald-600 hover:underline font-medium">
              Contact support
            </a>
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-700 transition-colors">Help</a>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5" />
            <span>Secured connection • Your password is encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
