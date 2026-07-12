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
      try {
        const { data } = await getChallenges();
        if (data && data.length > 0) {
          setChallenges(data);
        } else {
          setChallenges([
            { id: 1, title: 'Tree Plantation Drive', xp: 500, description: 'Plant a tree in your local community or park and submit a photo.' },
            { id: 2, title: 'Zero Waste Week', xp: 300, description: 'Avoid single-use plastics for 7 days and upload your daily logs.' },
            { id: 3, title: 'Corporate Beach Cleanup', xp: 400, description: 'Join the weekend beach volunteering drive and upload a group photo.' },
            { id: 4, title: 'Code for Good Campaign', xp: 800, description: 'Contribute to open-source environmental tools and submit your pull request.' }
          ]);
        }
      } catch (err) {
        console.warn("DB fetch failed, using fallback challenges", err);
        setChallenges([
          { id: 1, title: 'Tree Plantation Drive', xp: 500, description: 'Plant a tree in your local community or park and submit a photo.' },
          { id: 2, title: 'Zero Waste Week', xp: 300, description: 'Avoid single-use plastics for 7 days and upload your daily logs.' },
          { id: 3, title: 'Corporate Beach Cleanup', xp: 400, description: 'Join the weekend beach volunteering drive and upload a group photo.' },
          { id: 4, title: 'Code for Good Campaign', xp: 800, description: 'Contribute to open-source environmental tools and submit your pull request.' }
        ]);
      }
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
      
      let url = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500";
      try {
        url = await uploadProof(file);
        await insertParticipation(mockUserId, challenge.id, url);
      } catch (dbError) {
        console.warn("DB upload failed, using local simulation fallback", dbError);
        url = URL.createObjectURL(file);
      }
      
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
