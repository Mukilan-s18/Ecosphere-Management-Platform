"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Leaf,
  Users,
  FileText,
  Settings,
  ClipboardCheck,
  Shield,
  Trophy,
  AlertTriangle,
  Sparkles,
  Menu,
  X,
} from "lucide-react"

const routes = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Environmental", path: "/environmental", icon: Leaf },
  { name: "Social / Challenges", path: "/social", icon: Users },
  { name: "Gamification", path: "/gamification", icon: Trophy },
  { name: "Manager Review", path: "/manager", icon: ClipboardCheck },
  { name: "Governance", path: "/governance", icon: Shield },
  { name: "Anomaly Detection", path: "/anomalies", icon: AlertTriangle },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "ESG Wrapped", path: "/wrapped", icon: Sparkles },
  { name: "Settings", path: "/settings", icon: Settings },
]

function NavContent({
  pathname,
  setMobileOpen,
}: {
  pathname: string
  setMobileOpen: (open: boolean) => void
}) {
  return (
    <>
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-green-500 tracking-tight">EcoSphere</h1>
        <p className="text-xs text-slate-500 mt-0.5">ESG Management Platform</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {routes.map((route) => {
          const Icon = route.icon
          const isActive = pathname === route.path
          return (
            <Link
              key={route.name}
              href={route.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-green-500/15 text-green-400 border border-green-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-green-400" : ""}`} />
              {route.name}
              {route.name === "Anomaly Detection" && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-600 text-center">v1.0 · Hackathon Build</p>
      </div>
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 rounded-lg bg-slate-900 border border-slate-700 p-2 text-slate-300"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-40 h-screen w-64 border-r border-slate-800 bg-black flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent pathname={pathname} setMobileOpen={setMobileOpen} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-800 h-screen fixed left-0 bg-black flex-col">
        <NavContent pathname={pathname} setMobileOpen={setMobileOpen} />
      </aside>
    </>
  )
}
