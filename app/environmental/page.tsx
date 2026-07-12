import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function EnvironmentalGoals() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Environmental Goals</h1>
        <p className="text-slate-400 mt-2">Track and manage your organization's environmental targets.</p>
      </div>
      
      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableHead>Target</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableCell className="font-medium">Reduce CO2 Emissions by 20%</TableCell>
              <TableCell>Dec 2026</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Progress value={78} className="w-[100px]" />
                  <span className="text-sm text-slate-400">78%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableCell className="font-medium">Zero Waste to Landfill</TableCell>
              <TableCell>Dec 2027</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Progress value={45} className="w-[100px]" />
                  <span className="text-sm text-slate-400">45%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableCell className="font-medium">100% Renewable Energy</TableCell>
              <TableCell>Jan 2030</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Progress value={92} className="w-[100px]" />
                  <span className="text-sm text-slate-400">92%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableCell className="font-medium">Water Usage Reduction</TableCell>
              <TableCell>Jun 2025</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Progress value={100} className="w-[100px]" />
                  <span className="text-sm text-slate-400">100%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-slate-500 text-slate-400">Completed</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
