"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  FileText,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  Shield,
  Check,
} from "lucide-react";

type RegistrationType = "mdc" | "email" | null;

export default function LoginPage() {
  const router = useRouter();

  // Sign In state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  // Active view
  const [activeView, setActiveView] = useState<"signup" | "signin">("signup");

  // Sign Up state
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  // MDC PIN Registration
  const [mdcPin, setMdcPin] = useState("");
  const [mdcVerified, setMdcVerified] = useState(false);
  const [mdcData, setMdcData] = useState<any>(null);
  const [mdcEmail, setMdcEmail] = useState("");
  const [mdcPassword, setMdcPassword] = useState("");
  const [mdcConfirmPassword, setMdcConfirmPassword] = useState("");

  // Email Registration
  const [signupEmail, setSignupEmail] = useState("");

  // Check for expired registration
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setLoginError('Registration expired. Please start over.');
      setActiveView('signup');
    }
  }, []);

  // Handle Sign In
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    // Milestone 1: Started
    setProgress(10);
    setProgressMessage('Connecting...');

    try {
      const supabase = createClient();

      // Milestone 2: Authenticating
      setProgress(30);
      setProgressMessage('Authenticating...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Milestone 3: Auth successful
      setProgress(50);
      setProgressMessage('Verified!');
      setRedirecting(true);

      // Log sign-in to user_sign_ins table
      if (data.user) {
        // Milestone 4: Logging activity
        setProgress(70);
        setProgressMessage('Logging sign-in...');

        await supabase.from("user_sign_ins").insert({
          user_id: data.user.id,
          ip_address: null,
          user_agent: navigator.userAgent,
        });

        // Update last_sign_in_at
        await supabase
          .from("users")
          .update({ last_sign_in_at: new Date().toISOString() })
          .eq("id", data.user.id);
      }

      // Milestone 5: Navigating
      setProgress(85);
      setProgressMessage('Preparing dashboard...');

      // Milestone 6: Complete
      setProgress(100);
      setProgressMessage('Redirecting...');

      router.push("/dashboard");
      // Don't reset loading - let navigation complete
    } catch (err: any) {
      setProgress(0);
      setRedirecting(false);
      setLoginError(err.message || "Invalid email or password");
      setLoginLoading(false);
    }
  };

  // Handle MDC PIN Verification
  const handleVerifyMDC = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterLoading(true);

    try {
      const supabase = createClient();

      const { data: mdcRecord, error: mdcError } = await supabase
        .from("mdc_registry")
        .select("*")
        .eq("mdc_pin", mdcPin.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (mdcError || !mdcRecord) {
        throw new Error("Invalid MDC PIN or PIN is not active.");
      }

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("mdc_registry_id", mdcRecord.id)
        .single();

      if (existingUser) {
        throw new Error(
          "An account with this MDC PIN already exists. Please sign in.",
        );
      }

      setMdcData(mdcRecord);
      setMdcVerified(true);
    } catch (err: any) {
      setRegisterError(err.message || "Failed to verify MDC PIN.");
    } finally {
      setRegisterLoading(false);
    }
  };

  // Handle MDC Account Creation
  const handleCreateMDCAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (
      mdcPassword.length < 8 ||
      !/[A-Z]/.test(mdcPassword) ||
      !/[a-z]/.test(mdcPassword) ||
      !/[0-9]/.test(mdcPassword)
    ) {
      setRegisterError(
        "Password must be 8+ characters with uppercase, lowercase, and number",
      );
      return;
    }
    if (mdcPassword !== mdcConfirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    setRegisterLoading(true);

    try {
      const supabase = createClient();

      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: mdcEmail,
          password: mdcPassword,
          options: {
            data: {
              full_name: mdcData.full_name,
            },
          },
        },
      );

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Failed to create account");

      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        mdc_registry_id: mdcData.id,
        full_name: mdcData.full_name,
        role: "doctor",
        region_id: mdcData.region_id,
        district_id: mdcData.district_id,
        facility_id: mdcData.facility_id,
      });

      if (userError) throw userError;

      router.push("/dashboard");
    } catch (err: any) {
      setRegisterError(err.message || "Failed to create account.");
    } finally {
      setRegisterLoading(false);
    }
  };

  // Handle Email Registration (OTP)
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterLoading(true);

    try {
      const supabase = createClient();

      sessionStorage.setItem(
        "emailRegistration",
        JSON.stringify({
          email: signupEmail,
        }),
      );

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: signupEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (otpError) throw otpError;

      router.push("/register/verify");
    } catch (err: any) {
      setRegisterError(err.message || "Failed to send verification code.");
    } finally {
      setRegisterLoading(false);
    }
  };

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
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gradient Orbs - Hidden on mobile for performance */}
      <div
        className="hidden sm:block absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/4 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="hidden sm:block absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/2 -translate-x-1/4 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Card Content */}
          <div className="p-8 sm:p-10 space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-slate-900">eMCOD</h1>
              <p className="text-sm text-slate-500">
                Electronic Medical Cause of Death Certificate System
              </p>
              <div className="flex justify-center pt-2">
                <div className="w-16 h-1 bg-emerald-500 rounded-full" />
              </div>
            </div>

            {/* Sign In Form - Grid Animation Container */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{
                gridTemplateRows: activeView === "signin" ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden px-1">
                {redirecting ? (
                  <div className="p-8 sm:p-10 space-y-6">
                    <ProgressBar progress={progress} />
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-lg font-medium text-slate-900">{progressMessage}</p>
                      <p className="text-sm text-slate-500">{progress}% complete</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  {loginError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                      {loginError}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700 block"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="email"
                        type="email"
                        placeholder="doctor@hospital.gov.gh"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loginLoading}
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-slate-700"
                      >
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-xs text-emerald-600 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loginLoading}
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
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
                  </div>

                  {/* Keep signed in */}
                  <div className="flex items-center space-x-3">
                    <label
                      htmlFor="keepSignedIn"
                      className="relative flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="keepSignedIn"
                        checked={keepSignedIn}
                        onChange={(e) => setKeepSignedIn(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border border-emerald-300 rounded-sm bg-white peer-checked:bg-emerald-600 peer-checked:border-emerald-600 peer-focus:border-emerald-500 transition-all duration-200 cursor-pointer flex items-center justify-center">
                        {keepSignedIn && (
                          <Check
                            className="w-3.5 h-3.5 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </label>
                    <label
                      htmlFor="keepSignedIn"
                      className="text-sm text-slate-600 cursor-pointer select-none"
                    >
                      Keep me signed in on this device
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loginLoading ? "Signing in..." : "Sign In"}
                  </button>

                  {/* Authorized Access */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 space-y-3">
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Authorized Access For
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-700 border border-slate-200/80 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Medical Doctors
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-700 border border-slate-200/80 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Birth & Death Registry
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-700 border border-slate-200/80 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        Health Info Officers
                      </span>
                    </div>
                  </div>

                  {/* Navigation Link */}
                  <p className="text-sm text-slate-600 text-center pt-4">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView("signup");
                        setLoginError(null);
                      }}
                      className="text-emerald-600 hover:underline font-medium transition-colors"
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
                )}
              </div>
            </div>

            {/* Sign Up Form - Grid Animation Container (Default) */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{
                gridTemplateRows: activeView === "signup" ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden px-1">
                <div className="space-y-4 pt-4">
                  {registerError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                      {registerError}
                    </div>
                  )}

                  {!registrationType && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 text-center">
                        Select registration method
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRegistrationType("mdc")}
                          className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl transition-all"
                        >
                          <Stethoscope className="h-6 w-6 text-emerald-600" />
                          <span className="text-xs font-medium text-slate-700">
                            MDC PIN
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegistrationType("email")}
                          className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl transition-all"
                        >
                          <Mail className="h-6 w-6 text-emerald-600" />
                          <span className="text-xs font-medium text-slate-700">
                            Email
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {registrationType === "mdc" && !mdcVerified && (
                    <form onSubmit={handleVerifyMDC} className="space-y-4">
                      <button
                        type="button"
                        onClick={() => setRegistrationType(null)}
                        className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        ← Back
                      </button>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 block">
                          MDC PIN
                        </label>
                        <input
                          value={mdcPin}
                          onChange={(e) => setMdcPin(e.target.value)}
                          placeholder="MDC-12345"
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={registerLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                      >
                        {registerLoading ? "Verifying..." : "Verify PIN"}
                      </button>
                    </form>
                  )}

                  {registrationType === "mdc" && mdcVerified && (
                    <form
                      onSubmit={handleCreateMDCAccount}
                      className="space-y-4"
                    >
                      <p className="text-sm text-emerald-600 font-medium">
                        ✓ PIN Verified: {mdcData.full_name}
                      </p>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 block">
                          Email
                        </label>
                        <input
                          type="email"
                          value={mdcEmail}
                          onChange={(e) => setMdcEmail(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 block">
                          Password
                        </label>
                        <input
                          type="password"
                          value={mdcPassword}
                          onChange={(e) => setMdcPassword(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 block">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={mdcConfirmPassword}
                          onChange={(e) =>
                            setMdcConfirmPassword(e.target.value)
                          }
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={registerLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                      >
                        {registerLoading ? "Creating..." : "Create Account"}
                      </button>
                    </form>
                  )}

                  {registrationType === "email" && (
                    <form onSubmit={handleEmailSignup} className="space-y-4">
                      <button
                        type="button"
                        onClick={() => setRegistrationType(null)}
                        className="text-sm text-slate-600 hover:text-slate-900"
                      >
                        ← Back
                      </button>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={registerLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                      >
                        {registerLoading
                          ? "Sending..."
                          : "Send Verification Code"}
                      </button>
                    </form>
                  )}

                  {/* Navigation Link */}
                  <p className="text-sm text-slate-600 text-center pt-6">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView("signin");
                        setRegisterError(null);
                      }}
                      className="text-emerald-600 hover:underline font-medium transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Outside Card */}
        <div className="mt-8 space-y-4 text-center">
          <p className="text-sm text-slate-600">
            Need access?{" "}
            <a
              href="#"
              className="text-emerald-600 hover:underline font-medium"
            >
              Contact your administrator
            </a>
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-700 transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-700 transition-colors">
              Terms
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-700 transition-colors">
              Help
            </a>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5" />
            <span>Secured connection • Last sign-in shown after login</span>
          </div>
        </div>
      </div>
    </div>
  );
}
