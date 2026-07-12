"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AlertTriangle, RefreshCw, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock carbon transaction data per department
const initialDepartments = [
  {
    id: "eng",
    name: "Engineering",
    historicalAvg: 120,
    transactions: [
      { day: "Mon", kg: 115 },
      { day: "Tue", kg: 130 },
      { day: "Wed", kg: 118 },
      { day: "Thu", kg: 125 },
      { day: "Fri", kg: 480 }, // Spike! lights left on over weekend
      { day: "Sat", kg: 390 },
      { day: "Sun", kg: 410 },
    ],
  },
  {
    id: "mfg",
    name: "Manufacturing",
    historicalAvg: 350,
    transactions: [
      { day: "Mon", kg: 340 },
      { day: "Tue", kg: 360 },
      { day: "Wed", kg: 355 },
      { day: "Thu", kg: 345 },
      { day: "Fri", kg: 370 },
      { day: "Sat", kg: 365 },
      { day: "Sun", kg: 358 },
    ],
  },
  {
    id: "hr",
    name: "Human Resources",
    historicalAvg: 45,
    transactions: [
      { day: "Mon", kg: 42 },
      { day: "Tue", kg: 47 },
      { day: "Wed", kg: 44 },
      { day: "Thu", kg: 195 }, // Spike! AC left running
      { day: "Fri", kg: 200 },
      { day: "Sat", kg: 48 },
      { day: "Sun", kg: 43 },
    ],
  },
  {
    id: "ops",
    name: "Operations",
    historicalAvg: 200,
    transactions: [
      { day: "Mon", kg: 195 },
      { day: "Tue", kg: 210 },
      { day: "Wed", kg: 205 },
      { day: "Thu", kg: 198 },
      { day: "Fri", kg: 207 },
      { day: "Sat", kg: 202 },
      { day: "Sun", kg: 199 },
    ],
  },
];

type Department = typeof initialDepartments[0];

function detectAnomalies(dept: Department) {
  return dept.transactions.filter((t) => t.kg > dept.historicalAvg * 3);
}

type Alert = {
  id: string;
  dept: string;
  day: string;
  value: number;
  avg: number;
  pct: number;
  severity: "HIGH" | "CRITICAL";
  resolved: boolean;
  createdAt: string;
};

export default function AnomaliesPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [scanning, setScanning] = useState(true); // Start as scanning on mount
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("eng");
  
  const hasMounted = useRef(false);

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  const performScan = useCallback((deptsToScan: Department[]) => {
    setScanning(true);
    setTimeout(() => {
      const found: Alert[] = [];
      deptsToScan.forEach((dept) => {
        const spikes = detectAnomalies(dept);
        spikes.forEach((spike) => {
          const pct = Math.round((spike.kg / dept.historicalAvg) * 100);
          found.push({
            id: `${dept.id}-${spike.day}`,
            dept: dept.name,
            day: spike.day,
            value: spike.kg,
            avg: dept.historicalAvg,
            pct,
            severity: pct > 500 ? "CRITICAL" : "HIGH",
            resolved: false,
            createdAt: new Date().toLocaleTimeString(),
          });
        });
      });
      setAlerts(found);
      setLastScan(new Date().toLocaleTimeString());
      setScanning(false);
    }, 1500);
  }, []);

  const runScan = () => performScan(departments);

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  const simulateSpike = () => {
    const updatedDepts = departments.map((dept) => {
      if (dept.id === "ops") {
        return {
          ...dept,
          transactions: dept.transactions.map((t) =>
            t.day === "Wed" ? { ...t, kg: 850 } : t
          ),
        };
      }
      return dept;
    });
    setDepartments(updatedDepts);
    setSelectedDeptId("ops");
    performScan(updatedDepts);
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      performScan(initialDepartments);
    }
  }, [performScan]);

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Anomaly Detection</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Real-time monitoring · Flags departments with carbon spikes &gt;300% above historical average
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastScan && (
            <span className="text-xs text-slate-500">Last scan: {lastScan}</span>
          )}
          <Button
            onClick={simulateSpike}
            disabled={scanning}
            variant="outline"
            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            Simulate Spike
          </Button>
          <Button
            onClick={runScan}
            disabled={scanning}
            className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? "Scanning..." : "Re-scan Now"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-red-950/40 border-red-800/50">
          <CardContent className="pt-5 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <div className="text-2xl font-bold text-red-400">{activeAlerts.length}</div>
              <div className="text-sm text-slate-400">Active Alerts</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-950/40 border-green-800/50">
          <CardContent className="pt-5 flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-green-400">{resolvedAlerts.length}</div>
              <div className="text-sm text-slate-400">Resolved</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-950/40 border-blue-800/50">
          <CardContent className="pt-5 flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-blue-400">{departments.length}</div>
              <div className="text-sm text-slate-400">Departments Monitored</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Alerts Feed */}
        <div className="col-span-2 space-y-3">
          <h2 className="text-lg font-semibold text-slate-200">Compliance Issues</h2>
          {scanning && (
            <div className="flex items-center gap-2 text-orange-400 text-sm py-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scanning all departments...
            </div>
          )}
          {!scanning && activeAlerts.length === 0 && (
            <div className="text-slate-500 text-sm py-6 text-center border border-slate-800 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              No anomalies detected
            </div>
          )}
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="border border-red-800/50 rounded-lg p-4 bg-red-950/20 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="font-semibold text-white">{alert.dept}</span>
                </div>
                <Badge
                  className={
                    alert.severity === "CRITICAL"
                      ? "bg-red-600 text-white"
                      : "bg-orange-600 text-white"
                  }
                >
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-sm text-slate-300">
                <span className="text-red-300 font-bold">{alert.value} kg CO₂</span> on{" "}
                {alert.day} — {alert.pct}% of historical avg ({alert.avg} kg)
              </p>
              <p className="text-xs text-slate-500">Detected at {alert.createdAt}</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-slate-700 hover:bg-green-900/30 hover:text-green-300 hover:border-green-700"
                onClick={() => resolveAlert(alert.id)}
              >
                Mark as Resolved
              </Button>
            </div>
          ))}
          {resolvedAlerts.map((alert) => (
            <div
              key={alert.id}
              className="border border-slate-800 rounded-lg p-4 bg-slate-900/30 space-y-1 opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-400 text-sm">{alert.dept} · {alert.day}</span>
                <Badge className="bg-green-800 text-green-300 text-xs">Resolved</Badge>
              </div>
              <p className="text-xs text-slate-500">{alert.value} kg CO₂ — {alert.pct}% spike</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-200">Weekly Carbon — </h2>
            <div className="flex gap-2">
              {departments.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDeptId(d.id)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    selectedDept.id === d.id
                      ? "bg-orange-600 border-orange-600 text-white"
                      : "border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {d.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={selectedDept.transactions}>
                  <defs>
                    <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  {/* Threshold line */}
                  <Area
                    type="monotone"
                    dataKey="kg"
                    stroke="#f97316"
                    fill="url(#carbonGrad)"
                    strokeWidth={2}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      const isSpike = payload.kg > selectedDept.historicalAvg * 3;
                      return (
                        <circle
                          key={`dot-${payload.day}`}
                          cx={cx}
                          cy={cy}
                          r={isSpike ? 7 : 4}
                          fill={isSpike ? "#ef4444" : "#f97316"}
                          stroke={isSpike ? "#fca5a5" : "#f97316"}
                          strokeWidth={isSpike ? 2 : 1}
                        />
                      );
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                  Actual CO₂ (kg)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  Anomaly point (&gt;300% avg)
                </span>
                <span className="ml-auto">
                  Dept avg: <span className="text-slate-300 font-semibold">{selectedDept.historicalAvg} kg/day</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
