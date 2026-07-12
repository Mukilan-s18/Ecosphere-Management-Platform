"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock,
  Leaf,
  Shield,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

async function approveProof(participationId: string, userId: string, xp: number) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, xpAwarded: xp };
}

// ---------------------------------------------------------------------------
// Types & seed data
// ---------------------------------------------------------------------------

type Category = "Environmental" | "Social" | "Governance";

interface Submission {
  id: string;
  employeeName: string;
  employeeRole: string;
  challenge: string;
  category: Category;
  submittedAt: string;
  proofUrl: string;
  proofType: string;
  xpReward: number;
  status: "pending";
}

const initialSubmissions: Submission[] = [
  {
    id: "sub-001",
    employeeName: "Anika Sharma",
    employeeRole: "Sustainability Analyst",
    challenge: "Q3 Scope 1 Emissions Offset",
    category: "Environmental",
    submittedAt: "2026-07-10T14:32:00Z",
    proofUrl: "https://drive.google.com/file/d/abc123",
    proofType: "PDF Report",
    xpReward: 350,
    status: "pending",
  },
  {
    id: "sub-002",
    employeeName: "Marcus Chen",
    employeeRole: "Community Outreach Lead",
    challenge: "Community Solar Panel Installation",
    category: "Social",
    submittedAt: "2026-07-11T09:15:00Z",
    proofUrl: "https://photos.app.goo.gl/xyz456",
    proofType: "Photo Gallery",
    xpReward: 500,
    status: "pending",
  },
  {
    id: "sub-003",
    employeeName: "Fatima Al-Rashid",
    employeeRole: "Environmental Engineer",
    challenge: "Biodiversity Habitat Restoration",
    category: "Environmental",
    submittedAt: "2026-07-11T11:40:00Z",
    proofUrl: "https://docs.google.com/document/d/def789",
    proofType: "Field Report",
    xpReward: 420,
    status: "pending",
  },
  {
    id: "sub-004",
    employeeName: "Jordan Okafor",
    employeeRole: "HR Business Partner",
    challenge: "Workplace Diversity Training Completion",
    category: "Social",
    submittedAt: "2026-07-11T15:05:00Z",
    proofUrl: "https://lms.internal.co/cert/jok-2026",
    proofType: "Certificate",
    xpReward: 200,
    status: "pending",
  },
  {
    id: "sub-005",
    employeeName: "Elena Vasquez",
    employeeRole: "Compliance Officer",
    challenge: "Anti-Corruption Policy Compliance Audit",
    category: "Governance",
    submittedAt: "2026-07-12T08:20:00Z",
    proofUrl: "https://sharepoint.internal.co/audits/q3-2026",
    proofType: "Audit Log",
    xpReward: 600,
    status: "pending",
  },
  {
    id: "sub-006",
    employeeName: "Liam Nakamura",
    employeeRole: "Software Developer",
    challenge: "Carbon Neutral Commute Challenge",
    category: "Environmental",
    submittedAt: "2026-07-12T09:00:00Z",
    proofUrl: "https://strava.com/activities/987654",
    proofType: "Activity Log",
    xpReward: 150,
    status: "pending",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const categoryBadgeVariant: Record<
  Category,
  "default" | "secondary" | "outline"
> = {
  Environmental: "default",
  Social: "secondary",
  Governance: "outline",
};

const categoryIcon: Record<Category, React.ReactNode> = {
  Environmental: <Leaf className="mr-1 h-3 w-3" />,
  Social: <CheckCircle className="mr-1 h-3 w-3" />,
  Governance: <Shield className="mr-1 h-3 w-3" />,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ManagerPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Stats
  const [approvedToday, setApprovedToday] = useState(12);
  const [xpAwarded, setXpAwarded] = useState(4_820);

  const handleApprove = async (submission: Submission) => {
    setLoadingId(submission.id);
    try {
      await approveProof(submission.id, submission.employeeName, submission.xpReward);
      setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
      setApprovedToday((prev) => prev + 1);
      setXpAwarded((prev) => prev + submission.xpReward);
      toast.success("Approved & XP Awarded!", {
        description: `${submission.xpReward} XP granted to ${submission.employeeName}`,
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = (submission: Submission) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
    toast.error("Submission Rejected", {
      description: `${submission.challenge} by ${submission.employeeName}`,
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Submission Review Dashboard
        </h1>
        <p className="text-muted-foreground">
          Review, approve, or reject employee ESG challenge submissions and
          award experience points.
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Stats row                                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <CardDescription className="mt-1 text-xs">
              submissions awaiting review
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedToday}</div>
            <CardDescription className="mt-1 text-xs">
              challenges verified so far
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">XP Awarded</CardTitle>
            <Leaf className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {xpAwarded.toLocaleString()}
            </div>
            <CardDescription className="mt-1 text-xs">
              experience points distributed today
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Submissions table                                                 */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
          <CardDescription>
            Click approve to award XP or reject to decline the submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle className="mb-4 h-12 w-12 text-emerald-500/60" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm text-muted-foreground">
                No pending submissions to review.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Challenge</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead className="text-right">XP</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      {/* Employee */}
                      <TableCell>
                        <div className="font-medium">{sub.employeeName}</div>
                        <div className="text-xs text-muted-foreground">
                          {sub.employeeRole}
                        </div>
                      </TableCell>

                      {/* Challenge + category badge */}
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <span className="font-medium leading-snug">
                            {sub.challenge}
                          </span>
                          <Badge
                            variant={categoryBadgeVariant[sub.category]}
                            className="w-fit"
                          >
                            {categoryIcon[sub.category]}
                            {sub.category}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Submitted date */}
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(sub.submittedAt)}
                      </TableCell>

                      {/* Proof link */}
                      <TableCell>
                        <a
                          href={sub.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary underline-offset-4 hover:underline"
                        >
                          {sub.proofType}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </TableCell>

                      {/* XP reward */}
                      <TableCell className="text-right font-semibold tabular-nums">
                        +{sub.xpReward}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={loadingId === sub.id}
                            onClick={() => handleApprove(sub)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            {loadingId === sub.id ? "Approving…" : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={loadingId === sub.id}
                            onClick={() => handleReject(sub)}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
