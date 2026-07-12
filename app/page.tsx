import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Leaf,
  TrendingUp,
  Users,
  Award,
  Target,
  Zap,
  Globe,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

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
    label: "Challenges Completed",
    value: "2,341",
    change: "+24.8%",
    icon: Target,
    description: "Year to date",
  },
  {
    label: "XP Distributed",
    value: "184,200",
    change: "+31.4%",
    icon: Zap,
    description: "Total platform XP",
  },
]

const leaderboard = [
  { rank: 1, name: "Sarah Chen", department: "Engineering", xp: 4820, badge: "Sustainability Champion" },
  { rank: 2, name: "Marcus Johnson", department: "Operations", xp: 4215, badge: "Carbon Neutral Pioneer" },
  { rank: 3, name: "Aisha Patel", department: "HR", xp: 3890, badge: "Community Builder" },
  { rank: 4, name: "David Kim", department: "Finance", xp: 3640, badge: "ESG Advocate" },
  { rank: 5, name: "Elena Rodriguez", department: "Marketing", xp: 3410, badge: "Green Innovator" },
]

const activeChallenges = [
  {
    title: "Q3 Scope 1 Emissions Reduction",
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
    title: "Supply Chain Ethics Certification",
    category: "Governance",
    participants: 156,
    progress: 82,
    xpReward: 150,
    deadline: "Jul 31, 2026",
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
  { goal: "SDG 16 — Peace, Justice & Strong Institutions", progress: 89 },
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
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Globe className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              ESG Performance Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time sustainability metrics, gamification insights, and compliance overview
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>{stat.label}</CardDescription>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="size-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Challenges */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Sustainability Challenges</CardTitle>
                  <CardDescription>
                    Track ongoing ESG initiatives and participation rates
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

        {/* Leaderboard */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sustainability Leaderboard</CardTitle>
                  <CardDescription>Top contributors this quarter</CardDescription>
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
                      <div className="text-xs text-muted-foreground truncate max-w-24">
                        {entry.badge}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* UN SDG Progress */}
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>UN SDG Alignment</CardTitle>
                  <CardDescription>
                    Sustainable Development Goals progress
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

      {/* Quick Actions Footer */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/manager">
          <Card className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/20">
            <CardContent className="flex items-center gap-3 pt-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <BarChart3 className="size-5 text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Review Submissions</div>
                <div className="text-xs text-muted-foreground">
                  6 pending approvals
                </div>
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
                <div className="text-xs text-muted-foreground">
                  94.7% compliance score
                </div>
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
                <div className="text-xs text-muted-foreground">
                  Configure rules & integrations
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
