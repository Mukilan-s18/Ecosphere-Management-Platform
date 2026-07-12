"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  DownloadCloud,
  FileText,
  FileSpreadsheet,
  FileJson,
  Award,
  Leaf,
  Users,
  ShieldAlert,
  CheckCircle,
  Building2,
  Globe,
  ChevronRight,
  X,
} from "lucide-react"

// --- GRI / SASB Report Data ---
const reportData = {
  company: "EcoSphere Corp Ltd.",
  reportingPeriod: "January 1, 2025 – December 31, 2025",
  reportingFramework: "GRI Standards 2021 & SASB (TCFD-Aligned)",
  preparedBy: "EcoSphere Management Platform",
  generatedOn: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),

  environmental: {
    score: 82,
    disclosures: [
      { id: "GRI 302-1", title: "Energy Consumption Within Organization", value: "14,200 GJ", status: "Disclosed", trend: "-8% YoY" },
      { id: "GRI 305-1", title: "Scope 1 Direct GHG Emissions", value: "1,240 tCO2e", status: "Disclosed", trend: "-12% YoY" },
      { id: "GRI 305-2", title: "Scope 2 Indirect GHG Emissions", value: "2,960 tCO2e", status: "Disclosed", trend: "-9% YoY" },
      { id: "GRI 303-3", title: "Water Withdrawal by Source", value: "6,800 m³", status: "Disclosed", trend: "-5% YoY" },
      { id: "GRI 306-3", title: "Waste Generated", value: "42 metric tons", status: "Disclosed", trend: "-18% YoY" },
    ],
  },

  social: {
    score: 74,
    disclosures: [
      { id: "GRI 401-1", title: "New Employee Hires & Turnover Rate", value: "14.2% turnover", status: "Disclosed", trend: "-2.1% YoY" },
      { id: "GRI 403-9", title: "Work-Related Injuries", value: "0 fatalities, TRIR: 0.8", status: "Disclosed", trend: "Improved" },
      { id: "GRI 404-1", title: "Average Training Hours Per Employee", value: "32 hrs / year", status: "Disclosed", trend: "+6 hrs YoY" },
      { id: "GRI 405-1", title: "Diversity of Governance Bodies", value: "42% women in leadership", status: "Disclosed", trend: "+4% YoY" },
      { id: "SASB HC-101", title: "CSR Activity Participation Rate", value: "68% of workforce", status: "Disclosed", trend: "+22% YoY" },
    ],
  },

  governance: {
    score: 88,
    disclosures: [
      { id: "GRI 205-2", title: "Anti-Corruption Policies Communicated", value: "100% of employees", status: "Disclosed", trend: "Stable" },
      { id: "GRI 207-1", title: "Tax Transparency", value: "Full disclosure to regulators", status: "Disclosed", trend: "Stable" },
      { id: "TCFD Governance", title: "Board Oversight of Climate-Related Risks", value: "Quarterly review cycle", status: "Disclosed", trend: "New" },
      { id: "GRI 417-1", title: "Product & Service Labelling Requirements", value: "100% compliant SKUs", status: "Disclosed", trend: "Stable" },
    ],
  },
}

function ReportModal({ onClose }: { onClose: () => void }) {
  const handleDownload = (format: string) => {
    toast(`Generating ${format} Report`, {
      description: `Your GRI/SASB Investor-Ready ${format} report is being compiled.`,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Award className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Investor-Ready Report</span>
            </div>
            <h2 className="text-2xl font-bold text-white">GRI Standards 2021 & SASB Disclosure</h2>
            <p className="text-slate-400 text-sm mt-1">{reportData.company} · {reportData.reportingPeriod}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Report Metadata */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Building2, label: "Reporting Entity", value: reportData.company },
              { icon: Globe, label: "Framework", value: "GRI 2021 + SASB + TCFD" },
              { icon: FileText, label: "Generated", value: reportData.generatedOn },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
                <Icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-medium text-white mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ESG Score Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Leaf, label: "Environmental", score: reportData.environmental.score, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
              { icon: Users, label: "Social", score: reportData.social.score, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
              { icon: ShieldAlert, label: "Governance", score: reportData.governance.score, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
            ].map(({ icon: Icon, label, score, color, bg }) => (
              <div key={label} className={`border rounded-xl p-5 flex items-center gap-4 ${bg}`}>
                <Icon className={`w-8 h-8 ${color}`} />
                <div>
                  <p className="text-slate-400 text-sm">{label} Score</p>
                  <p className={`text-3xl font-bold ${color}`}>{score}<span className="text-lg text-slate-400">/100</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* Environmental Disclosures */}
          <ReportSection
            icon={<Leaf className="w-5 h-5 text-green-400" />}
            title="Environmental Disclosures"
            colorClass="text-green-400"
            disclosures={reportData.environmental.disclosures}
          />

          {/* Social Disclosures */}
          <ReportSection
            icon={<Users className="w-5 h-5 text-blue-400" />}
            title="Social Disclosures"
            colorClass="text-blue-400"
            disclosures={reportData.social.disclosures}
          />

          {/* Governance Disclosures */}
          <ReportSection
            icon={<ShieldAlert className="w-5 h-5 text-amber-400" />}
            title="Governance Disclosures"
            colorClass="text-amber-400"
            disclosures={reportData.governance.disclosures}
          />

          {/* Footer / Download Actions */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              This report conforms to GRI Standards 2021, SASB industry standards, and TCFD recommendations.
              All figures are audited and prepared in accordance with the EcoSphere Management Platform data governance framework.
            </p>
            <div className="flex gap-3 shrink-0">
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => handleDownload("PDF")}>
                <FileText className="w-4 h-4 mr-2" /> PDF
              </Button>
              <Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10" onClick={() => handleDownload("Excel")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold" onClick={() => handleDownload("GRI Package")}>
                <Award className="w-4 h-4 mr-2" /> Export GRI Package
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportSection({
  icon,
  title,
  colorClass,
  disclosures,
}: {
  icon: React.ReactNode
  title: string
  colorClass: string
  disclosures: { id: string; title: string; value: string; status: string; trend: string }[]
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className={`text-lg font-semibold ${colorClass}`}>{title}</h3>
      </div>
      <div className="rounded-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/60 text-slate-400 text-left">
              <th className="px-4 py-3 font-medium">Standard ID</th>
              <th className="px-4 py-3 font-medium">Disclosure</th>
              <th className="px-4 py-3 font-medium">Reported Value</th>
              <th className="px-4 py-3 font-medium">YoY Trend</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {disclosures.map((d, i) => (
              <tr key={d.id} className={`border-t border-slate-800 ${i % 2 === 0 ? "bg-slate-900/30" : ""}`}>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{d.id}</td>
                <td className="px-4 py-3 text-white">{d.title}</td>
                <td className="px-4 py-3 font-semibold text-white">{d.value}</td>
                <td className="px-4 py-3 text-slate-300">{d.trend}</td>
                <td className="px-4 py-3">
                  <Badge className="bg-green-500/15 text-green-400 border-green-500/30 gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {d.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function ReportsBuilder() {
  const [showModal, setShowModal] = useState(false)

  const handleExport = (format: string) => {
    toast(`Report generation started`, {
      description: `Your ${format} report is being prepared.`,
    })
  }

  return (
    <>
      {showModal && <ReportModal onClose={() => setShowModal(false)} />}

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Report Builder</h1>
          <p className="text-slate-400 mt-2">Generate custom reports across all ESG modules.</p>
        </div>

        {/* GRI/SASB Investor-Ready Report Banner */}
        <Card className="bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-500/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent" />
          <CardHeader>
            <div className="flex items-center justify-between relative">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30">
                  <Award className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl text-white">Investor-Ready ESG Report</CardTitle>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs">GRI · SASB · TCFD</Badge>
                  </div>
                  <p className="text-slate-400 text-sm max-w-xl">
                    Generate a fully structured disclosure report conforming to <strong className="text-amber-300">GRI Standards 2021</strong> and <strong className="text-amber-300">SASB industry guidelines</strong>. Ready for investor relations, board submissions, and regulatory filings.
                  </p>
                  <div className="flex items-center gap-6 mt-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-green-400" /> 5 Environmental Metrics</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-400" /> 5 Social Metrics</span>
                    <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> 4 Governance Metrics</span>
                  </div>
                </div>
              </div>
              <Button
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 shrink-0 gap-2 shadow-lg shadow-amber-500/20"
                onClick={() => setShowModal(true)}
              >
                Preview Report
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Standard Custom Report Builder */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-8">
          <h2 className="text-lg font-semibold">Custom Report Builder</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">Date Range</label>
              <Select defaultValue="this-year">
                <SelectTrigger className="bg-slate-950 border-slate-800">
                  <SelectValue placeholder="Select Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year (YTD)</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">Department</label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-slate-950 border-slate-800">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">Module</label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-slate-950 border-slate-800">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Complete ESG Report</SelectItem>
                  <SelectItem value="environmental">Environmental Only</SelectItem>
                  <SelectItem value="social">Social Only</SelectItem>
                  <SelectItem value="governance">Governance Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <DownloadCloud className="w-5 h-5" />
              <span>Export As:</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400" onClick={() => handleExport("PDF")}>
                <FileText className="w-4 h-4 mr-2" />PDF
              </Button>
              <Button variant="outline" className="border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400" onClick={() => handleExport("Excel")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />Excel
              </Button>
              <Button variant="outline" className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400" onClick={() => handleExport("CSV")}>
                <FileJson className="w-4 h-4 mr-2" />CSV
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
