"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Settings, Bell, Shield, Award, Camera, Users, Zap, Globe } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [gamification, setGamification] = useState({
    autoAwardBadges: true,
    requireEvidence: true,
    enablePeerRecognition: true,
    doubleXpEvents: false,
  })

  const [notifications, setNotifications] = useState({
    newComplianceIssue: true,
    approvalDecisions: true,
    policyReminders: false,
    badgeUnlocks: true,
  })

  const [businessRules, setBusinessRules] = useState({
    autoEmissionCalc: true,
    evidenceRequirement: true,
    badgeAutoAward: true,
  })

  const [compliance, setCompliance] = useState({
    mandatoryTraining: true,
    auditTrailLogging: true,
    dataRetentionPolicy: false,
  })

  const [integrations, setIntegrations] = useState({
    supabaseUrl: "",
    carbonApiKey: "",
  })

  function toggleGamification(key: keyof typeof gamification) {
    setGamification((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleNotifications(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleBusinessRules(key: keyof typeof businessRules) {
    setBusinessRules((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleCompliance(key: keyof typeof compliance) {
    setCompliance((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSave() {
    toast.success("Settings saved successfully")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          </div>
          <p className="text-muted-foreground ml-13">
            Configure gamification rules, notification preferences, and compliance requirements
          </p>
        </div>

        <div className="space-y-6">
          {/* Gamification Rules */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <CardTitle>Gamification Rules</CardTitle>
              </div>
              <CardDescription>
                Control how achievements, badges, and XP are awarded across the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-award" className="text-sm font-medium">
                    Auto-award Badges
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically award achievement badges when challenge criteria are met
                  </p>
                </div>
                <Switch
                  id="auto-award"
                  checked={gamification.autoAwardBadges}
                  onCheckedChange={() => toggleGamification("autoAwardBadges")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="require-evidence" className="text-sm font-medium">
                      Require Evidence Upload
                    </Label>
                    <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Require photo or document proof for all challenge completions
                  </p>
                </div>
                <Switch
                  id="require-evidence"
                  checked={gamification.requireEvidence}
                  onCheckedChange={() => toggleGamification("requireEvidence")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="peer-recognition" className="text-sm font-medium">
                      Enable Peer Recognition
                    </Label>
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Allow employees to nominate peers for sustainability achievements
                  </p>
                </div>
                <Switch
                  id="peer-recognition"
                  checked={gamification.enablePeerRecognition}
                  onCheckedChange={() => toggleGamification("enablePeerRecognition")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="double-xp" className="text-sm font-medium">
                      Double XP Events
                    </Label>
                    <Zap className="h-3.5 w-3.5 text-yellow-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enable periodic double XP multiplier events for engagement boost
                  </p>
                </div>
                <Switch
                  id="double-xp"
                  checked={gamification.doubleXpEvents}
                  onCheckedChange={() => toggleGamification("doubleXpEvents")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Rules Engine */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-500" />
                <CardTitle>Business Rules Engine</CardTitle>
              </div>
              <CardDescription>
                Core configuration toggles for automated platform behaviors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-emission" className="text-sm font-medium">
                    Auto Emission Calculation
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically calculate carbon from linked ERP transactions
                  </p>
                </div>
                <Switch
                  id="auto-emission"
                  checked={businessRules.autoEmissionCalc}
                  onCheckedChange={() => toggleBusinessRules("autoEmissionCalc")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="evidence-req" className="text-sm font-medium">
                    Evidence Requirement
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Require proof files for CSR Activity participation approvals
                  </p>
                </div>
                <Switch
                  id="evidence-req"
                  checked={businessRules.evidenceRequirement}
                  onCheckedChange={() => toggleBusinessRules("evidenceRequirement")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="badge-auto" className="text-sm font-medium">
                    Badge Auto-Award
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically assign badges based on metrics
                  </p>
                </div>
                <Switch
                  id="badge-auto"
                  checked={businessRules.badgeAutoAward}
                  onCheckedChange={() => toggleBusinessRules("badgeAutoAward")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>
                Manage which platform notifications are sent to team members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="new-compliance-issue" className="text-sm font-medium">
                    New compliance issue raised
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notify owners when a compliance audit fails or policy is violated
                  </p>
                </div>
                <Switch
                  id="new-compliance-issue"
                  checked={notifications.newComplianceIssue}
                  onCheckedChange={() => toggleNotifications("newComplianceIssue")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="approval-decisions" className="text-sm font-medium">
                    CSR/Challenge approval decisions
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notify employees when their CSR/Challenge submissions are approved or rejected
                  </p>
                </div>
                <Switch
                  id="approval-decisions"
                  checked={notifications.approvalDecisions}
                  onCheckedChange={() => toggleNotifications("approvalDecisions")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="policy-reminders" className="text-sm font-medium">
                    Policy acknowledgement reminders
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Send reminders to employees who have pending policy acknowledgements
                  </p>
                </div>
                <Switch
                  id="policy-reminders"
                  checked={notifications.policyReminders}
                  onCheckedChange={() => toggleNotifications("policyReminders")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="badge-unlocks" className="text-sm font-medium">
                    Badge unlocks
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notify users when they automatically earn a new badge
                  </p>
                </div>
                <Switch
                  id="badge-unlocks"
                  checked={notifications.badgeUnlocks}
                  onCheckedChange={() => toggleNotifications("badgeUnlocks")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Compliance & Governance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <CardTitle>Compliance &amp; Governance</CardTitle>
              </div>
              <CardDescription>
                Enforce organizational policies and regulatory requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="mandatory-training" className="text-sm font-medium">
                    Mandatory ESG Training
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Require all employees to complete ESG onboarding modules
                  </p>
                </div>
                <Switch
                  id="mandatory-training"
                  checked={compliance.mandatoryTraining}
                  onCheckedChange={() => toggleCompliance("mandatoryTraining")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="audit-trail" className="text-sm font-medium">
                    Audit Trail Logging
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Log all setting changes and administrative actions for audit review
                  </p>
                </div>
                <Switch
                  id="audit-trail"
                  checked={compliance.auditTrailLogging}
                  onCheckedChange={() => toggleCompliance("auditTrailLogging")}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="data-retention" className="text-sm font-medium">
                    Data Retention Policy
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically purge inactive records after the configured retention period
                  </p>
                </div>
                <Switch
                  id="data-retention"
                  checked={compliance.dataRetentionPolicy}
                  onCheckedChange={() => toggleCompliance("dataRetentionPolicy")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-violet-500" />
                <CardTitle>Integration Settings</CardTitle>
              </div>
              <CardDescription>
                Manage external service connections and API credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">Supabase Project URL</Label>
                  <Input
                    id="supabase-url"
                    placeholder="https://your-project.supabase.co"
                    value={integrations.supabaseUrl}
                    onChange={(e) =>
                      setIntegrations((prev) => ({ ...prev, supabaseUrl: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbon-api-key">Carbon API Key</Label>
                  <Input
                    id="carbon-api-key"
                    type="password"
                    placeholder="••••••••••••••••"
                    value={integrations.carbonApiKey}
                    onChange={(e) =>
                      setIntegrations((prev) => ({ ...prev, carbonApiKey: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Connected Integrations</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Supabase</Badge>
                  <Badge variant="secondary">GHG Protocol API</Badge>
                  <Badge variant="outline">UN SDG Tracker</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Master Data Administration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-emerald-500" />
                <CardTitle>Master Data Administration</CardTitle>
              </div>
              <CardDescription>
                Manage system-wide classifications and departments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold text-slate-200">Departments</Label>
                    <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-xs">
                      + Add Dept
                    </Button>
                  </div>
                  <div className="rounded-md border border-slate-800 bg-slate-950">
                    <div className="p-3 text-sm text-slate-300 border-b border-slate-800 flex justify-between">
                      <span>Logistics</span>
                      <span className="text-slate-500 text-xs hover:text-emerald-400 cursor-pointer">Edit</span>
                    </div>
                    <div className="p-3 text-sm text-slate-300 border-b border-slate-800 flex justify-between">
                      <span>Manufacturing</span>
                      <span className="text-slate-500 text-xs hover:text-emerald-400 cursor-pointer">Edit</span>
                    </div>
                    <div className="p-3 text-sm text-slate-300 flex justify-between">
                      <span>Human Resources</span>
                      <span className="text-slate-500 text-xs hover:text-emerald-400 cursor-pointer">Edit</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold text-slate-200">ESG Categories</Label>
                    <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-xs">
                      + Add Category
                    </Button>
                  </div>
                  <div className="rounded-md border border-slate-800 bg-slate-950">
                    <div className="p-3 text-sm text-slate-300 border-b border-slate-800 flex justify-between">
                      <span>Carbon Emissions</span>
                      <span className="text-slate-500 text-xs hover:text-emerald-400 cursor-pointer">Edit</span>
                    </div>
                    <div className="p-3 text-sm text-slate-300 border-b border-slate-800 flex justify-between">
                      <span>Diversity & Inclusion</span>
                      <span className="text-slate-500 text-xs hover:text-emerald-400 cursor-pointer">Edit</span>
                    </div>
                    <div className="p-3 text-sm text-slate-300 flex justify-between">
                      <span>Employee Training</span>
                      <span className="text-slate-500 text-xs hover:text-emerald-400 cursor-pointer">Edit</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button size="lg" onClick={handleSave} className="min-w-[160px]">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
