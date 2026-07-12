import Link from "next/link"
import {
  LayoutDashboard,
  Leaf,
  Users,
  FileText,
  Settings,
  AlertTriangle,
  Sparkles,
} from "lucide-react"

export function Sidebar() {
  const routes = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Environmental", path: "/environmental", icon: Leaf },
    { name: "Social", path: "/social", icon: Users },
    { name: "Anomaly Detection", path: "/anomalies", icon: AlertTriangle },
    { name: "EcoSphere Wrapped", path: "/wrapped", icon: Sparkles },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <aside className="w-64 border-r border-slate-800 h-screen fixed left-0 bg-slate-950 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-500">EcoSphere</h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {routes.map((route) => {
          const Icon = route.icon
          const isAlert = route.path === "/anomalies"
          const isWrapped = route.path === "/wrapped"
          return (
            <Link
              key={route.name}
              href={route.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
                isAlert ? "hover:text-orange-300 hover:bg-orange-950/30" : ""
              } ${isWrapped ? "hover:text-yellow-300 hover:bg-yellow-950/20" : ""}`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isAlert ? "text-orange-500" : isWrapped ? "text-yellow-400" : ""
                }`}
              />
              {route.name}
              {isAlert && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
