"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { uploadProof, getChallenges, supabase } from "@/lib/supabase";
import { fallbackChallenges } from "@/lib/fallback-data";
import { Users, Trophy, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const insertParticipation = async (userId: number, challengeId: number, url: string) => {
  const { error } = await supabase
    .from("participations")
    .insert({ user_id: userId, challenge_id: challengeId, proof_url: url, status: "pending" });
  if (error) throw error;
};

interface Challenge {
  id: number;
  title: string;
  description: string;
  xp_reward?: number;
  xp?: number;
}

export default function SocialPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { data, error } = await getChallenges();
        if (error || !data || data.length === 0) {
          setChallenges(fallbackChallenges);
          setIsOffline(true);
        } else {
          setChallenges(data);
        }
      } catch (err) {
        console.warn("DB fetch failed, using fallback challenges", err);
        setChallenges(fallbackChallenges);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CSR Activities &amp; Challenges</h1>
          <p className="text-muted-foreground mt-1">
            Join challenges, upload proof, and earn XP for your department.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{challenges.length} active challenges</span>
        </div>
      </div>

      {isOffline && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-400 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Using demo data — live database temporarily unavailable.
        </div>
      )}

      {/* Workforce & Culture Metrics */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-slate-200">Diversity Demographics</CardTitle>
            <CardDescription>Current workforce distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Gender Ratio (Female to Male)</span>
                <span className="font-medium text-emerald-400">42% / 58%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 w-[42%]"></div>
                <div className="h-full bg-slate-700 w-[58%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Generational Mix (Gen Z & Millennials)</span>
                <span className="font-medium text-blue-400">68%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[68%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-slate-200">Compliance & Training</CardTitle>
            <CardDescription>Mandatory employee course completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Anti-Bribery & Corruption</span>
                <span className="font-medium text-amber-400">94%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[94%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">ESG Awareness Program</span>
                <span className="font-medium text-indigo-400">76%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[76%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChallengeCard({
  challenge,
}: {
  challenge: Challenge;
}) {
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateFile = (f: File): string | null => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      return "Only image files (JPG, PNG, WEBP, GIF) are accepted.";
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File must be under ${MAX_FILE_SIZE_MB}MB. Your file is ${(f.size / 1024 / 1024).toFixed(1)}MB.`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(null);
    setFileError(null);
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      setFileError(err);
    } else {
      setFile(f);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    const err = validateFile(file);
    if (err) { setFileError(err); return; }

    setSubmitting(true);
    try {
      // Hardcoded userId until auth is ready from M1
      const mockUserId = 1; // using integer ID as per schema
      
      let url = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500";
      try {
        url = await uploadProof(file);
        await insertParticipation(mockUserId, challenge.id, url);
      } catch (dbError) {
        console.warn("DB upload failed, using local simulation fallback", dbError);
        url = URL.createObjectURL(file);
      }
      
      setSubmitted(true);
      setJoined(false);
      setFile(null);
      toast.success("Evidence submitted for review!", {
        description: `Your proof for "${challenge.title}" has been uploaded successfully.`,
      });
    } catch {
      toast.error("Upload failed", {
        description: "Could not submit your evidence. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const xp = challenge.xp_reward ?? challenge.xp ?? 0;

  return (
    <Card className="flex flex-col shadow-sm hover:shadow-md hover:border-green-500/30 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{challenge.title}</CardTitle>
          <Badge className="shrink-0 bg-green-500/15 text-green-400 border-green-500/20 hover:bg-green-500/15">
            +{xp} XP
          </Badge>
        </div>
        <CardDescription className="text-xs leading-relaxed">{challenge.description}</CardDescription>
      </CardHeader>

      <CardContent className="mt-auto space-y-3">
        {submitted ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Submitted — under review!
          </div>
        ) : !joined ? (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setJoined(true)}
          >
            <Trophy className="w-4 h-4 mr-2" /> Join Challenge
          </Button>
        ) : (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="space-y-1.5">
              <label htmlFor={`file-${challenge.id}`} className="text-xs font-medium text-slate-300">
                Upload Evidence <span className="text-slate-500">(Image, max {MAX_FILE_SIZE_MB}MB)</span>
              </label>
              <Input
                id={`file-${challenge.id}`}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                onChange={handleFileChange}
                className="cursor-pointer text-xs"
              />
              {fileError && (
                <p className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {fileError}
                </p>
              )}
              {file && !fileError && (
                <p className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle2 className="w-3 h-3 shrink-0" /> {file.name} ready
                </p>
              )}
            </div>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={submitting || !file || !!fileError}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
              ) : (
                "Submit Evidence"
              )}
            </Button>
            <button
              className="w-full text-xs text-slate-500 hover:text-slate-400 transition-colors"
              onClick={() => { setJoined(false); setFile(null); setFileError(null); }}
            >
              Cancel
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
