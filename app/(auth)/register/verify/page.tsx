'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FileText, Mail, Shield, CheckCircle } from 'lucide-react'

export default function VerifyOTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60 second countdown

  useEffect(() => {
    // Check for email registration
    const emailData = sessionStorage.getItem('emailRegistration')
    if (emailData) {
      const parsed = JSON.parse(emailData)
      setEmail(parsed.email)
      return
    }

    // Check for MDC registration (legacy)
    const mdcData = sessionStorage.getItem('mdcRegistration')
    if (mdcData) {
      const parsed = JSON.parse(mdcData)
      setEmail(parsed.email)
      return
    }

    // No registration data found
    router.push('/login')
  }, [router])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      // Verify OTP
      const { data, error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })

      if (otpError) throw otpError

      // OTP verified successfully - redirect to password creation
      router.push('/register/create-password')
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResending(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        }
      })

      if (error) throw error

      // Reset timer and clear OTP field
      setTimeLeft(60)
      setOtp('')
      // Show success message
      setError('✓ A new verification code has been sent to your email.')
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Redirecting...</p>
      </div>
    )
  }

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
        {/* Verification Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 sm:p-10 space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/30">
                <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-slate-900">Verify Email</h1>
              <p className="text-sm text-slate-500">
                Enter the verification code sent to
              </p>
              <p className="text-sm font-medium text-emerald-600">
                {email}
              </p>
              <div className="flex justify-center pt-2">
                <div className="w-16 h-1 bg-emerald-500 rounded-full" />
              </div>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4 pt-4">
              {error && (
                <div className={`${error.startsWith('✓') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'} border rounded-lg p-3 text-sm`}>
                  {error}
                </div>
              )}

              {/* Info Alert - All Green with Countdown */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">Check your email</p>
                      {timeLeft > 0 ? (
                        <span className={`text-xs font-mono font-semibold px-2 py-1 rounded ${
                          timeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {timeLeft}s
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">
                      We've sent a 6-digit verification code to your registered email address. Enter it quickly - codes expire in 60 seconds!
                    </p>
                  </div>
                </div>
              </div>

              {/* OTP Input */}
              <div className="space-y-1.5">
                <label htmlFor="otp" className="text-sm font-medium text-slate-700 block">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={loading}
                  maxLength={6}
                  className="w-full px-3 py-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl text-slate-900 placeholder:text-slate-400 font-mono tracking-widest text-center focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              {/* Resend Link */}
              <p className="text-sm text-slate-600 text-center pt-2">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-emerald-600 hover:underline font-medium transition-colors disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend code'}
                </button>
              </p>
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
            <span>Secured connection • Your data is encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
