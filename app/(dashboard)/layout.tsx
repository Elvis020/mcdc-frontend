import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NavLink } from "@/components/nav-link";
import Image from "next/image";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { NavigationProvider } from "@/components/navigation-progress";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user details - only select needed fields
  const { data: userData } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col relative">
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.015) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Clean header with eMCOD branding */}
        <header className="bg-white border-b pt-3 border-slate-200 h-20 flex items-center relative z-10">
          <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">
            {/* Logo and title */}
            <NavLink
              href="/dashboard"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/MoH.png"
                alt="Ghana Ministry of Health"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="text-xl font-semibold text-slate-900">
                eMCOD
              </span>
            </NavLink>

            {/* User profile */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end justify-center">
                <p className="text-sm font-medium text-slate-900 leading-tight">
                  {userData?.full_name}
                </p>
                <p className="text-xs text-slate-500 leading-tight mt-0.5">
                  MDC-{user.id.slice(0, 5).toUpperCase()}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-full text-white font-semibold text-sm flex-shrink-0">
                {userData?.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase() || "DR"}
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container mx-auto px-4 lg:px-6 py-8 relative z-10">
          {children}
        </main>

        {/* Footer - sticky to bottom */}
        <footer className="border-t border-slate-200 bg-slate-50 py-1 relative z-10">
          <div className="container mx-auto px-4 lg:px-6 pt-2">
            <p className="text-center text-sm text-slate-500">
              © 2026 eMCOD • Secure government portal
            </p>
          </div>
        </footer>
      </div>
    </NavigationProvider>
  );
}
