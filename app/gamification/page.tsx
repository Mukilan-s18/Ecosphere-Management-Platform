"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Trophy, 
  Medal, 
  Award, 
  AlertCircle, 
  Globe, 
  Recycle, 
  Bike, 
  Sprout, 
  Leaf, 
  Star,
  CheckCircle2,
  Zap,
  Droplets,
  Trees
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fallbackLeaderboard } from "@/lib/fallback-data";

const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('name, xp')
      .order('xp', { ascending: false })
      .limit(10);
      
    if (error || !data || data.length === 0) {
      return [
        { employee: 'Aditi Rao', xp: 1500 },
        { employee: 'Karan Shah', xp: 1200 },
        { employee: 'Mukilan S', xp: 900 },
        { employee: 'Priya Sharma', xp: 600 },
        { employee: 'Rahul Desai', xp: 300 }
      ];
    }
    
    return data.map((user) => ({
      employee: user.name,
      xp: user.xp,
    }));
  } catch (e) {
    console.warn("DB fetch failed, using fallback leaderboard data", e);
    return [
      { employee: 'Aditi Rao', xp: 1500 },
      { employee: 'Karan Shah', xp: 1200 },
      { employee: 'Mukilan S', xp: 900 },
      { employee: 'Priya Sharma', xp: 600 },
      { employee: 'Rahul Desai', xp: 300 }
    ];
  }
};

const activeChallenges = [
  { id: "c1", title: "Sustainability Sprint", xp: 200, difficulty: "Hard", deadline: "07/20", status: "Active", icon: <Globe className="w-5 h-5 text-indigo-400" /> },
  { id: "c2", title: "Recycle Challenge", xp: 80, difficulty: "Easy", deadline: "07/15", status: "Active", icon: <Recycle className="w-5 h-5 text-emerald-400" /> },
  { id: "c3", title: "Commute Green", xp: 120, difficulty: "Medium", deadline: "07/25", status: "Active", icon: <Bike className="w-5 h-5 text-emerald-500" /> },
  { id: "c4", title: "Energy Saver", xp: 150, difficulty: "Medium", deadline: "07/22", status: "Draft", icon: <Zap className="w-5 h-5 text-yellow-400" /> },
  { id: "c5", title: "Water Conservation", xp: 90, difficulty: "Easy", deadline: "07/28", status: "Active", icon: <Droplets className="w-5 h-5 text-blue-400" /> },
  { id: "c6", title: "Plant a Tree", xp: 300, difficulty: "Hard", deadline: "08/01", status: "Active", icon: <Trees className="w-5 h-5 text-emerald-600" /> },
];

const badges = [
  { id: 1, name: "Green Beginner", icon: <Sprout className="w-6 h-6 text-emerald-400" /> },
  { id: 2, name: "Carbon Saver", icon: <Leaf className="w-6 h-6 text-emerald-500" /> },
  { id: 3, name: "Eco Champion", icon: <Globe className="w-6 h-6 text-indigo-400" /> },
  { id: 4, name: "Team Player", icon: <Star className="w-6 h-6 text-yellow-400" /> },
  { id: 5, name: "Energy Master", icon: <Zap className="w-6 h-6 text-amber-400" /> },
  { id: 6, name: "Water Guardian", icon: <Droplets className="w-6 h-6 text-blue-400" /> },
];

interface LeaderboardEntry {
  employee: string;
  xp: number;
}

export default function GamificationPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        if (!data || data.length === 0) {
          setLeaderboard(fallbackLeaderboard);
        } else {
          const sorted = [...data].sort((a, b) => b.xp - a.xp);
          setLeaderboard(sorted);
        }
      } catch (error) {
        console.error("Failed to load leaderboard", error);
        setLeaderboard(fallbackLeaderboard);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  const handleJoin = (id: string) => {
    setJoinedChallenges((prev) => [...prev, id]);
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case 1: return "bg-slate-300/10 text-slate-300 border-slate-300/30";
      case 2: return "bg-amber-600/10 text-amber-600 border-amber-600/30";
      default: return "text-slate-400 border-transparent";
    }
  };

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Trophy className="w-8 h-8 text-emerald-500" />
        <h1 className="text-3xl font-bold tracking-tight text-white">Gamification Hub</h1>
      </div>

      {/* 1. Leaderboard Section (Top) */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-7 h-7 text-emerald-500" />
          <h2 className="text-2xl font-bold text-white">Company Leaderboard</h2>
        </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-800 bg-slate-900/50 hover:bg-slate-900/50">
                <TableHead className="w-[100px] text-center text-slate-400 font-semibold">Rank</TableHead>
                <TableHead className="text-slate-400 font-semibold">Participant</TableHead>
                <TableHead className="text-right text-slate-400 font-semibold">Total XP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <>
                  {[...Array(6)].map((_, i) => (
                    <TableRow key={i} className="border-slate-800">
                      <TableCell><div className="h-6 w-8 mx-auto rounded bg-slate-800 animate-pulse" /></TableCell>
                      <TableCell><div className="h-6 w-48 rounded bg-slate-800 animate-pulse" /></TableCell>
                      <TableCell><div className="h-6 w-20 ml-auto rounded bg-slate-800 animate-pulse" /></TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                leaderboard.slice(0, 6).map((row, index) => (
                  <TableRow key={index} className="border-slate-800 hover:bg-slate-900/60 transition-colors">
                    <TableCell className="font-medium text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full border font-bold ${getRankStyle(index)}`}>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-200 text-lg">
                      {row.employee}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-400 text-lg">
                      {row.xp.toLocaleString()} XP
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* 2. Challenges Section (Middle) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-7 h-7 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Active Challenges</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeChallenges.map((challenge) => {
            const isJoined = joinedChallenges.includes(challenge.id);
            const isDraft = challenge.status === "Draft";
            
            return (
              <Card 
                key={challenge.id} 
                className={`bg-slate-900/40 backdrop-blur-md border-2 transition-all duration-300 ${
                  isDraft 
                    ? "border-slate-800/50 opacity-75" 
                    : "border-emerald-500/20 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                      {challenge.icon}
                    </div>
                    <CardTitle className="text-lg text-slate-200 leading-tight">{challenge.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium">Difficulty</p>
                      <p className="text-slate-200">{challenge.difficulty}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-slate-400 font-medium">Reward</p>
                      <p className="text-emerald-400 font-bold">{challenge.xp} XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-xs">
                    <span className="text-slate-500">Ends {challenge.deadline}</span>
                    <span className={`px-2.5 py-1 rounded-md font-semibold ${
                      isDraft 
                        ? "bg-slate-800/50 text-slate-400 border border-slate-700/50" 
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {challenge.status}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <button 
                    onClick={() => handleJoin(challenge.id)}
                    disabled={isJoined || isDraft}
                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isJoined 
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 cursor-default" 
                        : isDraft
                          ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/25"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Participating
                      </>
                    ) : (
                      "Join Challenge"
                    )}
                  </button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>

      {/* 3. Badge Gallery (Bottom) */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <Medal className="w-7 h-7 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Badge Gallery</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-700/50 bg-slate-950/40 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:-translate-y-1 text-center"
            >
              <div className="p-4 rounded-full bg-slate-900 border-2 border-slate-800 group-hover:border-indigo-500/50 transition-colors">
                {badge.icon}
              </div>
              <span className="font-semibold text-slate-300 text-sm leading-tight">{badge.name}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
