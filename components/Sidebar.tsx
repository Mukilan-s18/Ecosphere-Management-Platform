"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
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
  ChevronLeft,
  ChevronRight
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
  isExpanded,
  setIsExpanded,
}: {
  pathname: string
  setMobileOpen: (open: boolean) => void
  isExpanded: boolean
  setIsExpanded?: (open: boolean) => void
}) {
  return (
    <>
      <div className={`flex items-center border-b border-border p-4 h-[73px] transition-all duration-300 ${isExpanded ? "justify-between" : "justify-center"}`}>
        {isExpanded && (
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            <h1 className="text-2xl font-bold text-green-500 tracking-tight">EcoSphere</h1>
            <p className="text-xs text-slate-500 mt-0.5">ESG Platform</p>
          </div>
        )}
        {setIsExpanded && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Menu className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {routes.map((route) => {
          const Icon = route.icon
          const isActive = pathname === route.path
          return (
            <Link
              key={route.name}
              href={route.path}
              onClick={() => setMobileOpen(false)}
              title={!isExpanded ? route.name : undefined}
              className={`relative flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 z-10 ${
                isActive
                  ? "text-green-300"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-green-500/20 border border-green-500/30 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.15)] backdrop-blur-md -z-10"
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                />
              )}
              <Icon className={`w-5 h-5 shrink-0 relative z-10 ${isActive ? "text-green-400" : ""}`} />
              
              {isExpanded && (
                <>
                  <span className="relative z-10 whitespace-nowrap">{route.name}</span>
                  {route.name === "Anomaly Detection" && (
                    <span className="ml-auto flex h-2 w-2 rounded-full bg-red-500 animate-pulse relative z-10" />
                  )}
                </>
              )}
              
              {!isExpanded && route.name === "Anomaly Detection" && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse z-20" />
              )}
            </Link>
          )
        })}
      </nav>
      {isExpanded && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-slate-600 text-center whitespace-nowrap">v1.0 · Hackathon Build</p>
        </div>
      )}
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar (always expanded on mobile when open) */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-background flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent pathname={pathname} setMobileOpen={setMobileOpen} isExpanded={true} />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-border h-screen sticky top-0 shrink-0 bg-background transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-[72px]"}`}>
        <NavContent pathname={pathname} setMobileOpen={setMobileOpen} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </aside>
    </>
  )
}
