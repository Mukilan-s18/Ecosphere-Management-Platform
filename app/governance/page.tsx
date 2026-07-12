import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  AlertTriangle,
  FileCheck,
  Scale,
  TrendingUp,
  Clock,
} from "lucide-react"

const audits = [
  {
    id: "AUD-2026-041",
    category: "Governance",
    description: "Board Diversity Compliance Review",
    severity: "Medium" as const,
    status: "Completed" as const,
  },
  {
    id: "AUD-2026-042",
    category: "Environmental",
    description: "Scope 3 GHG Emissions Verification",
    severity: "High" as const,
    status: "In Progress" as const,
  },
  {
    id: "AUD-2026-043",
    category: "Social",
    description: "Supply Chain Labor Standards Audit",
    severity: "High" as const,
    status: "In Progress" as const,
  },
  {
    id: "AUD-2026-044",
    category: "Governance",
    description: "Anti-Bribery & Corruption Policy Review",
    severity: "Critical" as const,
    status: "Pending" as const,
  },
  {
    id: "AUD-2026-045",
    category: "Environmental",
    description: "ISO 14001 Environmental Management Certification",
    severity: "Low" as const,
    status: "Completed" as const,
  },
  {
    id: "AUD-2026-046",
    category: "Social",
    description: "Employee Health & Safety Compliance",
    severity: "Medium" as const,
    status: "Completed" as const,
  },
  {
    id: "AUD-2026-047",
    category: "Environmental",
    description: "Carbon Credit Verification & Offset Validation",
    severity: "High" as const,
    status: "In Progress" as const,
  },
  {
    id: "AUD-2026-048",
    category: "Governance",
    description: "Executive Compensation Transparency Report",
    severity: "Low" as const,
    status: "Completed" as const,
  },
]

const frameworks = [
  {
    name: "GRI Standards",
    description: "Global Reporting Initiative sustainability disclosures",
    compliance: 96,
  },
  {
    name: "TCFD",
    description: "Task Force on Climate-related Financial Disclosures",
    compliance: 91,
  },
  {
    name: "UN SDGs",
    description: "United Nations Sustainable Development Goals alignment",
    compliance: 88,
  },
  {
    name: "EU CSRD",
    description: "Corporate Sustainability Reporting Directive compliance",
    compliance: 82,
  },
]

function severityBadgeVariant(severity: string) {
  switch (severity) {
    case "Critical":
    case "High":
      return "destructive" as const
    case "Medium":
      return "secondary" as const
    case "Low":
      return "outline" as const
    default:
      return "secondary" as const
  }
}

function statusBadgeVariant(status: string) {
  switch (status) {
    case "Completed":
      return "default" as const
    case "In Progress":
      return "secondary" as const
    case "Pending":
      return "outline" as const
    default:
      return "secondary" as const
  }
}

function categoryIcon(category: string) {
  switch (category) {
    case "Governance":
      return <Scale className="size-4 text-muted-foreground" />
    case "Environmental":
      return <TrendingUp className="size-4 text-muted-foreground" />
    case "Social":
      return <Shield className="size-4 text-muted-foreground" />
    default:
      return null
  }
}

export default function GovernancePage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Governance &amp; Compliance
        </h1>
        <p className="text-muted-foreground">
          ESG regulatory compliance monitoring and audit trail
        </p>
      </div>

      {/* ESG Oracle Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <span className="text-xl">🌿</span>
          </div>
          <div>
            <h3 className="font-semibold text-emerald-400">Try the new ESG Oracle!</h3>
            <p className="text-sm opacity-90">Got governance or compliance questions? Ask our AI assistant in the bottom right.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Compliance Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Score
            </CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <Progress value={94.7} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">
              +2.1% from last quarter
            </p>
          </CardContent>
        </Card>

        {/* Active Audits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Audits
            </CardTitle>
            <FileCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        {/* Policy Violations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Policy Violations
            </CardTitle>
            <AlertTriangle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        {/* Next Review */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Review</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aug 15, 2026</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Quarterly board review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>
            Complete history of ESG compliance audits and reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Audit ID</TableHead>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[110px]">Severity</TableHead>
                <TableHead className="w-[120px] text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {audit.id}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {categoryIcon(audit.category)}
                      {audit.category}
                    </span>
                  </TableCell>
                  <TableCell>{audit.description}</TableCell>
                  <TableCell>
                    <Badge variant={severityBadgeVariant(audit.severity)}>
                      {audit.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={statusBadgeVariant(audit.status)}>
                      {audit.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Regulatory Frameworks */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Regulatory Frameworks
          </h2>
          <p className="text-sm text-muted-foreground">
            Compliance status across global ESG reporting standards
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {frameworks.map((fw) => (
            <Card key={fw.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{fw.name}</CardTitle>
                <CardDescription className="text-xs">
                  {fw.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fw.compliance}%</div>
                <Progress value={fw.compliance} className="mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
