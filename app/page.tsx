"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Leaf, Users, ShieldAlert, TrendingDown } from "lucide-react"

const trendData = [
  { month: 'Jan', co2: 120 },
  { month: 'Feb', co2: 110 },
  { month: 'Mar', co2: 130 },
  { month: 'Apr', co2: 95 },
  { month: 'May', co2: 85 },
  { month: 'Jun', co2: 70 },
]

const rankingData = [
  { dept: 'Logistics', score: 85 },
  { dept: 'Manufacturing', score: 78 },
  { dept: 'Office', score: 92 },
  { dept: 'IT', score: 95 },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Tabs defaultValue="dashboard" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="border-green-500/50 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Environmental</CardTitle>
            <Leaf className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82/100</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Social</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">74/100</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Governance</CardTitle>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88/100</div>
            <p className="text-xs text-muted-foreground">Stable</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
            <TrendingDown className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2k tCO2e</div>
            <p className="text-xs text-muted-foreground">-12% from last year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 bg-slate-900/50">
          <CardHeader>
            <CardTitle>Emissions Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="co2" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50">
          <CardHeader>
            <CardTitle>Department Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rankingData.map((dept, i) => (
                <div key={dept.dept} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">{i + 1}.</span>
                    <span>{dept.dept}</span>
                  </div>
                  <span className="font-bold text-green-500">{dept.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
