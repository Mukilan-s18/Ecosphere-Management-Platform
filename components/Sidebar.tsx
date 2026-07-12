"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Leaf,
  Users,
  FileText,
  Settings,
  ClipboardCheck,
  Shield,
  Award,
  Sparkles,
  AlertTriangle,
} from "lucide-react"

export function Sidebar() {
  const routes = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Environmental", path: "/environmental", icon: Leaf },
    { name: "Social", path: "/social", icon: Users },
    { name: "Manager Review", path: "/manager", icon: ClipboardCheck },
    { name: "Governance", path: "/governance", icon: Shield },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Gamification", path: "/gamification", icon: Award },
    { name: "EcoSphere Wrapped", path: "/wrapped", icon: Sparkles },
    { name: "Anomaly Detection", path: "/anomalies", icon: AlertTriangle },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-slate-800 h-screen fixed left-0 bg-slate-950 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-500">EcoSphere</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {routes.map((route) => {
          const Icon = route.icon
          return (
            <Link
              key={route.name}
              href={route.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === route.path
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {route.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
