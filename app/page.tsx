"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import dynamic from "next/dynamic"

const EmissionsChart = dynamic(
  () => import("@/components/EmissionsChart"),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Loading chart...
      </div>
    )
  }
)
import {
  Leaf,
  TrendingUp,
  Users,
  Award,
  Target,
  Zap,
  Globe,
  BarChart3,
  ShieldAlert,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { fallbackDashboardStats } from "@/lib/fallback-data"

const stats = [
  {
    label: "Carbon Offset",
    value: "12.4 tCO₂e",
    change: "+18.2%",
    icon: Leaf,
    description: "This quarter vs. last",
  },
  {
    label: "Active Participants",
    value: "847",
    change: "+12.5%",
    icon: Users,
    description: "Across all departments",
  },
  {
    label: "Compliance Score",
    value: "94.7%",
    change: "Stable",
    icon: ShieldAlert,
    description: "Governance alignment",
  },
  {
    label: "Total Emissions",
    value: "4.2k tCO₂e",
    change: "-12.0%",
    icon: TrendingUp,
    description: "Year over year",
  },
]

const trendData = [
  { month: 'Jan', co2: 120 },
  { month: 'Feb', co2: 110 },
  { month: 'Mar', co2: 130 },
  { month: 'Apr', co2: 95 },
  { month: 'May', co2: 85 },
  { month: 'Jun', co2: 70 },
]

const rankingData = [
  { dept: 'IT Services', score: 95 },
  { dept: 'Office Operations', score: 92 },
  { dept: 'Logistics & Fleet', score: 85 },
  { dept: 'Manufacturing', score: 78 },
]

const leaderboard = [
  { rank: 1, name: "Sarah Chen", department: "Engineering", xp: 4820, badge: "Sustainability Champion" },
  { rank: 2, name: "Marcus Johnson", department: "Operations", xp: 4215, badge: "Carbon Neutral Pioneer" },
  { rank: 3, name: "Aisha Patel", department: "HR", xp: 3890, badge: "Community Builder" },
  { rank: 4, name: "David Kim", department: "Finance", xp: 3640, badge: "ESG Advocate" },
]

const activeChallenges = [
  {
    title: "Q3 Scope 1 Emissions Offset",
    category: "Environmental",
    participants: 234,
    progress: 67,
    xpReward: 100,
    deadline: "Aug 30, 2026",
  },
  {
    title: "Workplace Diversity & Inclusion Initiative",
    category: "Social",
    participants: 412,
    progress: 45,
    xpReward: 75,
    deadline: "Sep 15, 2026",
  },
  {
    title: "Carbon Neutral Commute Challenge",
    category: "Environmental",
    participants: 389,
    progress: 53,
    xpReward: 50,
    deadline: "Aug 15, 2026",
  },
]

const sdgProgress = [
  { goal: "SDG 7 — Affordable & Clean Energy", progress: 78 },
  { goal: "SDG 12 — Responsible Consumption", progress: 64 },
  { goal: "SDG 13 — Climate Action", progress: 71 },
]

function getCategoryVariant(category: string) {
  switch (category) {
    case "Environmental":
      return "default" as const
    case "Social":
      return "secondary" as const
    case "Governance":
      return "outline" as const
    default:
      return "default" as const
  }
}

export default function DashboardPage() {
  const [liveStats, setLiveStats] = useState(fallbackDashboardStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data: users, error: err1 } = await supabase.from('users').select('id')
        const { data: participations, error: err2 } = await supabase.from('participations').select('id').eq('status', 'approved')
        
        if (!err1 && users) {
          setLiveStats((prev) => ({ ...prev, activeParticipants: users.length }))
        }
        if (!err2 && participations) {
           // mock offset calculation based on participations
           const offset = 12.4 + (participations.length * 0.5)
           setLiveStats((prev) => ({ ...prev, carbonOffset: `${offset.toFixed(1)} tCO₂e` }))
        }
      } catch (e) {
        console.error("Failed to load live stats")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardStats()
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Globe className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ESG Performance Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Real-time sustainability metrics, carbon emissions trends, and employee gamification achievements.
            </p>
          </div>
        </div>
        <div className="flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-[300px]">
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all bg-background text-foreground shadow-sm"
          >
            Overview
          </Link>
          <Link
            href="/reports"
            className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all hover:bg-background/50 hover:text-foreground"
          >
            Reports
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
            <Leaf className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveStats.carbonOffset}</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-400">
              +18.2% This quarter vs. last
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
            <Users className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveStats.activeParticipants}</div>
            <p className="text-xs text-muted-foreground mt-1 text-blue-400">
              +12.5% Across all departments
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <ShieldAlert className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveStats.complianceScore}%</div>
            <p className="text-xs text-muted-foreground mt-1 text-amber-400">
              Stable Governance alignment
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
            <TrendingUp className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveStats.totalEmissions}</div>
            <p className="text-xs text-muted-foreground mt-1 text-red-400">
              -12.0% Year over year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Emissions Trend & Challenges) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Emissions Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Emissions Trend (tCO₂e)</CardTitle>
              <CardDescription>Scope 1 and Scope 2 operational greenhouse gas tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <EmissionsChart data={trendData} />
              </div>
            </CardContent>
          </Card>

          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Sustainability Challenges</CardTitle>
                  <CardDescription>
                    Ongoing employee ESG initiatives and progress tracking
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {activeChallenges.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeChallenges.map((challenge) => (
                  <div
                    key={challenge.title}
                    className="flex flex-col gap-2 rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {challenge.title}
                          </span>
                          <Badge
                            variant={getCategoryVariant(challenge.category)}
                          >
                            {challenge.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="size-3" />
                            {challenge.participants} participants
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="size-3" />
                            {challenge.xpReward} XP
                          </span>
                          <span>Due: {challenge.deadline}</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {challenge.progress}%
                      </span>
                    </div>
                    <Progress value={challenge.progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Rankings, Leaderboards, SDGs) */}
        <div className="space-y-6">
          {/* Department Ranking */}
          <Card>
            <CardHeader>
              <CardTitle>Department Sustainability Ranking</CardTitle>
              <CardDescription>ESG compliance score by business unit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rankingData.map((dept, i) => (
                  <div key={dept.dept} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono text-xs">{i + 1}.</span>
                      <span className="text-sm font-medium">{dept.dept}</span>
                    </div>
                    <span className="font-bold text-primary">{dept.score}/100</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Face-Off (Tug-of-War) */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center text-lg">
                <span>Department Face-Off</span>
                <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-1 rounded-full animate-pulse border">Live 🔥</span>
              </CardTitle>
              <CardDescription>IT Services vs Office Operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-10 rounded-full overflow-hidden border border-border shadow-inner">
                <div
                  style={{ width: `${(95 / (95 + 92)) * 100}%` }}
                  className="bg-emerald-500 flex items-center justify-end pr-3 text-xs font-bold text-white transition-all duration-1000"
                >
                  IT (95)
                </div>
                <div
                  style={{ width: `${(92 / (95 + 92)) * 100}%` }}
                  className="bg-blue-500 flex items-center pl-3 text-xs font-bold text-white transition-all duration-1000"
                >
                  Office (92)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sustainability Leaderboard */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gamification Leaderboard</CardTitle>
                  <CardDescription>Top individual sustainability contributors</CardDescription>
                </div>
                <Award className="size-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/30"
                  >
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        entry.rank === 1
                          ? "bg-amber-500/15 text-amber-500"
                          : entry.rank === 2
                          ? "bg-slate-400/15 text-slate-400"
                          : entry.rank === 3
                          ? "bg-orange-400/15 text-orange-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {entry.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.department}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {entry.xp.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* UN SDG Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>UN SDG Alignment</CardTitle>
                  <CardDescription>
                    Sustainable Development Goals tracking
                  </CardDescription>
                </div>
                <BarChart3 className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sdgProgress.map((sdg) => (
                  <div key={sdg.goal} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{sdg.goal}</span>
                      <span className="text-xs text-muted-foreground">
                        {sdg.progress}%
                      </span>
                    </div>
                    <Progress value={sdg.progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Action Navigation Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/manager">
          <Card className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/20">
            <CardContent className="flex items-center gap-3 pt-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <BarChart3 className="size-5 text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Review Submissions</div>
                <div className="text-xs text-muted-foreground">Manager review workflow</div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/governance">
          <Card className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/20">
            <CardContent className="flex items-center gap-3 pt-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Target className="size-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Compliance Center</div>
                <div className="text-xs text-muted-foreground">Governance monitoring</div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/settings">
          <Card className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/20">
            <CardContent className="flex items-center gap-3 pt-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Leaf className="size-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Platform Settings</div>
                <div className="text-xs text-muted-foreground">Configure business rules</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
