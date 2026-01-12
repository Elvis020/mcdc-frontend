import { FileText, ShieldCheck, Lock } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding and information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary/80 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mb-48 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo and title */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MCDC System</h1>
                <p className="text-sm text-white/80">Medical Cause of Death Certificate</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8 py-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Secure Medical Portal</h2>
              <p className="text-white/80 text-lg">
                Streamlined certificate management for healthcare professionals
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">MDC Verified</h3>
                  <p className="text-sm text-white/80">
                    Integrated with Medical & Dental Council registry for secure authentication
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure & Compliant</h3>
                  <p className="text-sm text-white/80">
                    Enterprise-grade security ensuring patient data confidentiality
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Efficient Workflow</h3>
                  <p className="text-sm text-white/80">
                    Streamlined certificate creation and management process
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/60">
            <p>2026 Medical Cause of Death Certificate System</p>
            <p className="mt-1">Secure Government Portal</p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center bg-muted/20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MCDC System</h1>
                <p className="text-xs text-muted-foreground">Medical Certificate Portal</p>
              </div>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
