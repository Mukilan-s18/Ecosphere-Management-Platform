"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DownloadCloud, FileText, FileSpreadsheet, FileJson } from "lucide-react"

export default function ReportsBuilder() {
  const handleExport = (format: string) => {
    toast(`Report generation started`, {
      description: `Your ${format} report is being prepared.`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Report Builder</h1>
        <p className="text-slate-400 mt-2">Generate custom reports across all ESG modules.</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-8">
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
            <Button 
              variant="outline" 
              className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
              onClick={() => handleExport("PDF")}
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button 
              variant="outline" 
              className="border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400"
              onClick={() => handleExport("Excel")}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
              onClick={() => handleExport("CSV")}
            >
              <FileJson className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
