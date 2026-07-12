"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
// Assuming M1 will provide these in lib/supabase. 
// import { uploadProof, insertParticipation } from "@/lib/supabase";

// Mock functions until M1 is ready with lib/supabase.ts
const uploadProof = async (file: File) => {
  return new Promise<string>((resolve) => setTimeout(() => resolve("https://mock-url.com/proof.jpg"), 1000));
};

const insertParticipation = async (userId: string, challengeId: string, url: string) => {
  return new Promise<void>((resolve) => setTimeout(resolve, 500));
};

const challenges = [
  { id: "1", title: "Beach Cleanup", description: "Help clean the local beach this weekend. Every piece of trash removed counts towards our corporate environmental goals.", xp: 50 },
  { id: "2", title: "Tree Plantation", description: "Plant a tree in your neighborhood. Contribute to our carbon offset initiatives.", xp: 100 },
  { id: "3", title: "Zero Waste Sprint", description: "Produce zero waste for a whole week. Take the ultimate sustainability challenge.", xp: 150 },
];

export default function SocialPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">CSR Activities & Challenges</h1>
      <div className="flex flex-row gap-6 flex-wrap">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: { id: string; title: string; description: string; xp: number } }) {
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleJoin = () => {
    setJoined(true);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      // Hardcoded userId until auth is ready from M1
      const mockUserId = "user_123";
      
      const url = await uploadProof(file);
      await insertParticipation(mockUserId, challenge.id, url);
      
      toast(`Evidence submitted for review!`, {
        description: `Your proof for "${challenge.title}" has been uploaded.`,
      });
      
      setJoined(false);
      setFile(null);
    } catch (error) {
      toast.error("Error submitting evidence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{challenge.title}</CardTitle>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-bold text-green-500 mb-6 px-3 py-1 bg-green-500/10 inline-block rounded-full">
          +{challenge.xp} XP
        </div>
        
        {!joined ? (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleJoin}>
            Join
          </Button>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="picture" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Upload Evidence
              </label>
              <Input 
                id="picture"
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>
            <Button 
              className="w-full" 
              variant="default" 
              onClick={handleSubmit} 
              disabled={loading || !file}
            >
              {loading ? "Uploading..." : "Submit Evidence"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
