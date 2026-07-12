"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { uploadProof, getChallenges, supabase } from "@/lib/supabase";

const insertParticipation = async (userId: number, challengeId: number, url: string) => {
  const { error } = await supabase
    .from('participations')
    .insert({ user_id: userId, challenge_id: challengeId, proof_url: url, status: 'pending' });
  if (error) throw error;
};

export default function SocialPage() {
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data } = await getChallenges();
      if (data) setChallenges(data);
    };
    fetchChallenges();
  }, []);

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

function ChallengeCard({ challenge }: { challenge: { id: number; title: string; description: string; xp: number; xp_reward?: number } }) {
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
      const mockUserId = 1; // using integer ID as per schema
      
      const url = await uploadProof(file);
      await insertParticipation(mockUserId, challenge.id, url);
      
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
          +{challenge.xp_reward || challenge.xp} XP
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
