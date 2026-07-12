"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, TreePine, Car, Zap, Droplets, Share2, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fallbackQuarterData = {
  quarter: "Q2 2026",
  company: "EcoSphere Corp",
  co2Saved: 5000,
  carEquivalent: 15,
  treesEquivalent: 250,
  energySaved: 12400,
  waterSaved: 48000,
  topDept: "Engineering",
  topEmployee: "Aditi Rao",
  topEmployeeXP: 1200,
  activeChallenges: 47,
  complianceScore: 92,
  trend: "+18% vs Q1",
  milestones: [
    "🌍 Reached carbon neutrality for 3 consecutive weeks",
    "⚡ 100% renewable energy usage in February",
    "🌊 Zero liquid waste discharge achieved in March",
    "🏆 Engineering dept hit all 12 environmental targets",
  ],
};

const slides = [
  "intro",
  "co2",
  "equivalents",
  "energy",
  "people",
  "milestones",
  "outro",
];

const gradients = [
  "from-emerald-950 via-slate-950 to-slate-950",
  "from-slate-950 via-green-950 to-slate-950",
  "from-slate-950 via-teal-950 to-slate-950",
  "from-slate-950 via-blue-950 to-slate-950",
  "from-slate-950 via-purple-950 to-slate-950",
  "from-slate-950 via-amber-950 to-slate-950",
  "from-emerald-950 via-slate-950 to-slate-950",
];

function CountUp({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
}

export default function WrappedPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [quarterData, setQuarterData] = useState(fallbackQuarterData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRealData = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: users, error: err1 } = await supabase.from('users').select('id, name, total_xp').order('total_xp', { ascending: false }).limit(1);
        const { data: participations, error: err2 } = await supabase.from('participations').select('id, challenges(id, type)');
        
        const updates: any = {};
        if (!err1 && users?.length > 0) {
          updates.topEmployee = users[0].name;
          updates.topEmployeeXP = users[0].total_xp || 1200;
        }
        if (!err2 && participations) {
          const envChallenges = participations.filter((p: any) => p.challenges?.type === 'environmental').length;
          updates.activeChallenges = participations.length;
          updates.co2Saved = 5000 + (envChallenges * 150);
          updates.carEquivalent = Math.round(updates.co2Saved / 330);
          updates.treesEquivalent = Math.round(updates.co2Saved / 20);
        }
        
        setQuarterData((prev) => ({ ...prev, ...updates }));
      } catch (e) {
        console.error("Failed to load wrapped data", e);
      } finally {
        setLoading(false);
      }
    };
    loadRealData();
  }, []);

  const goTo = (index: number) => {
    if (animating || index === currentSlide) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setAnimating(false);
    }, 300);
  };

  const next = () => {
    if (currentSlide < slides.length - 1) goTo(currentSlide + 1);
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!", {
      description: "Share your quarterly impact summary with your team.",
    });
  };

  const handleDownload = () => {
    toast.success("Generating PDF report...", {
      description: "Your EcoSphere Wrapped PDF will be ready shortly.",
    });
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 print:p-0 print:bg-white print:text-black">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-3xl font-bold">EcoSphere Wrapped</h1>
            <p className="text-slate-400 text-sm">Your {quarterData.quarter} sustainability story</p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" className="gap-2 border-slate-700 text-slate-300 hover:text-white" onClick={handleShare}>
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleDownload}>
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Slide Dots */}
      <div className="flex justify-center gap-2 print:hidden">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentSlide ? "w-8 h-2 bg-emerald-500" : "w-2 h-2 bg-slate-700 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>

      {/* Slide Container */}
      <div
        className={`relative rounded-2xl bg-gradient-to-br ${gradients[currentSlide]} border border-slate-800 overflow-hidden min-h-[480px] flex flex-col items-center justify-center transition-opacity duration-300 ${animating ? "opacity-0" : "opacity-100"} print:bg-none print:border-none print:min-h-0 print:block`}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none print:hidden" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-12 py-10 w-full max-w-2xl mx-auto">
          {/* SLIDE 0: Intro */}
          {currentSlide === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-6xl mb-4">🌍</div>
              <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {quarterData.quarter}
              </h2>
              <p className="text-2xl text-white font-semibold">Your Impact Story</p>
              <p className="text-slate-400">
                {quarterData.company} · {quarterData.trend}
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 text-emerald-400 text-sm">
                  <Sparkles className="w-4 h-4" />
                  Compliance Score: {quarterData.complianceScore}/100
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: CO2 */}
          {currentSlide === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-slate-400 text-lg">This quarter, you saved</p>
              <div className="text-8xl font-black text-emerald-400">
                <CountUp target={quarterData.co2Saved} suffix="kg" />
              </div>
              <p className="text-2xl font-bold text-white">of CO₂</p>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                That's a {quarterData.trend} improvement from last quarter. Your team is accelerating! 🚀
              </p>
            </div>
          )}

          {/* SLIDE 2: Equivalents */}
          {currentSlide === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-slate-400 text-lg">What does that look like?</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
                  <Car className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                  <div className="text-4xl font-black text-blue-400">
                    <CountUp target={quarterData.carEquivalent} />
                  </div>
                  <p className="text-sm text-slate-400 mt-1">cars taken off the road</p>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
                  <TreePine className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <div className="text-4xl font-black text-green-400">
                    <CountUp target={quarterData.treesEquivalent} />
                  </div>
                  <p className="text-sm text-slate-400 mt-1">trees worth of carbon absorbed</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Energy & Water */}
          {currentSlide === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-slate-400 text-lg">You also saved</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
                  <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                  <div className="text-3xl font-black text-yellow-400">
                    <CountUp target={quarterData.energySaved} suffix=" kWh" />
                  </div>
                  <p className="text-sm text-slate-400 mt-1">of energy</p>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
                  <Droplets className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                  <div className="text-3xl font-black text-cyan-400">
                    <CountUp target={quarterData.waterSaved} suffix=" L" />
                  </div>
                  <p className="text-sm text-slate-400 mt-1">of water</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: People */}
          {currentSlide === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-slate-400 text-lg">Your sustainability heroes</p>
              <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/60 rounded-2xl p-6 border border-purple-800/40">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-2xl font-black text-white">{quarterData.topEmployee}</div>
                <p className="text-purple-300 font-medium">{quarterData.topEmployeeXP.toLocaleString()} XP earned this quarter</p>
                <p className="text-slate-500 text-sm mt-1">Top performer companywide</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-emerald-400">{quarterData.topDept}</div>
                  <p className="text-xs text-slate-500">Best Department</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-orange-400">{quarterData.activeChallenges}</div>
                  <p className="text-xs text-slate-500">CSR Challenges Completed</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Milestones */}
          {currentSlide === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
              <p className="text-slate-400 text-lg text-center">Milestones unlocked this quarter</p>
              <div className="space-y-3">
                {quarterData.milestones.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-slate-900/60 rounded-xl p-4 border border-slate-800"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="text-xl">{m.split(" ")[0]}</span>
                    <span className="text-sm text-slate-300">{m.substring(m.indexOf(" ") + 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 6: Outro */}
          {currentSlide === 6 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-6xl">🌱</div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Keep it up!
              </h2>
              <p className="text-slate-300 text-lg max-w-sm mx-auto">
                Every action counts. See you in Q3 for an even bigger impact.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={handleShare}>
                  <Share2 className="w-4 h-4" /> Share Story
                </Button>
                <Button variant="outline" className="gap-2 border-slate-700 text-slate-300 hover:text-white" onClick={handleDownload}>
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Next button */}
        {currentSlide < slides.length - 1 && (
          <button
            onClick={next}
            className="absolute right-6 bottom-6 p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick nav pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {["Intro", "CO₂ Saved", "Equivalents", "Energy & Water", "People", "Milestones", "Finale"].map((label, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              currentSlide === i
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
