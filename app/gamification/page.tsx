"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react"; // Assuming M4 installed lucide-react

// Mock getLeaderboard until M1 is ready
const getLeaderboard = async () => {
  return new Promise<any[]>((resolve) => 
    setTimeout(() => 
      resolve([
        { rank: 1, employee: "Aditi Rao", xp: 1200 },
        { rank: 2, employee: "Karan Shah", xp: 950 },
        { rank: 3, employee: "Mukesh Kumar", xp: 800 },
        { rank: 4, employee: "Fadil", xp: 650 },
        { rank: 5, employee: "Muthesh", xp: 400 },
      ])
    , 500)
  );
};

const badges = [
  { id: 1, name: "🌱 Green Beginner", description: "Completed your first CSR activity and joined the movement." },
  { id: 2, name: "🚴 Eco Commuter", description: "Logged 50 miles of sustainable bike commuting." },
  { id: 3, name: "♻️ Zero Waste Hero", description: "Successfully achieved zero waste for an entire week." },
  { id: 4, name: "🌍 Climate Champion", description: "Reached the Top 3 in the company leaderboard this month." },
  { id: 5, name: "💧 Water Saver", description: "Reduced water usage by 20% compared to last quarter." },
  { id: 6, name: "🔌 Energy Star", description: "Powered down workstation consistently after hours." },
];

export default function GamificationPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // In reality: const data = await getLeaderboard() from M1
        const data = await getLeaderboard();
        // Sort by XP DESC to guarantee order
        const sorted = [...data].sort((a, b) => b.xp - a.xp);
        setLeaderboard(sorted);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-slate-400" />;
      case 2: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <Award className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-500">
      
      {/* Leaderboard Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">Company Leaderboard</h1>
        </div>
        
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[100px] text-center">Rank</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Total XP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    Loading leaderboard data...
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-center">
                      <div className="flex justify-center items-center gap-2">
                        {getRankIcon(index)}
                        {index > 2 && <span>{index + 1}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{row.employee}</TableCell>
                    <TableCell className="text-right font-bold text-green-500">{row.xp} XP</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Badges Section (The "Wow" Element) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-500" />
          Badge Gallery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <Card key={badge.id} className="border-2 border-transparent hover:border-green-500/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardHeader className="pb-2 text-center">
                <div className="text-4xl mb-2">{badge.name.split(" ")[0]}</div>
                <CardTitle className="text-lg">{badge.name.substring(badge.name.indexOf(" ") + 1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-slate-300">{badge.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
    </div>
  );
}
