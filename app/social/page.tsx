"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Mock until M1 supabase is ready
const mockChallenges = [
  { id: "1", title: "Beach Cleanup", description: "Help clean the local beach this weekend. Every piece of trash removed counts towards our corporate environmental goals.", xp_reward: 50 },
  { id: "2", title: "Tree Plantation", description: "Plant a tree in your neighborhood. Contribute to our carbon offset initiatives.", xp_reward: 100 },
  { id: "3", title: "Zero Waste Sprint", description: "Produce zero waste for a whole week. Take the ultimate sustainability challenge.", xp_reward: 150 },
];

const mockUploadProof = async (file: File): Promise<string> => {
  return new Promise((resolve) => setTimeout(() => resolve("https://mock-url.com/proof.jpg"), 1000));
};

const mockInsertParticipation = async (userId: number, challengeId: string, url: string): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 500));
};

export default function SocialPage() {
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    // Will be replaced with: const { data } = await getChallenges();
    setChallenges(mockChallenges);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">CSR Activities &amp; Challenges</h1>
      <div className="flex flex-row gap-6 flex-wrap">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: { id: string; title: string; description: string; xp_reward: number } }) {
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
      const mockUserId = 1;
      const url = await mockUploadProof(file);
      await mockInsertParticipation(mockUserId, challenge.id, url);

      toast.success("Evidence submitted for review!", {
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
          +{challenge.xp_reward} XP
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
