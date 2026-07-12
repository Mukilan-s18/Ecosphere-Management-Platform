// Centralized fallback data for offline resilience
// Used when Supabase is unreachable

export const fallbackChallenges = [
  {
    id: 1,
    title: "Tree Plantation Drive",
    description: "Plant 10 trees in your local community and upload photographic proof.",
    xp_reward: 50,
    status: "Active",
  },
  {
    id: 2,
    title: "Blood Donation Camp",
    description: "Donate blood at a certified camp and submit your donation certificate.",
    xp_reward: 80,
    status: "Active",
  },
  {
    id: 3,
    title: "Beach Cleanup",
    description: "Participate in a coastal cleanup event and log at least 2 hours of service.",
    xp_reward: 60,
    status: "Active",
  },
  {
    id: 4,
    title: "ESG Workshop",
    description: "Attend an ESG awareness workshop and submit your completion certificate.",
    xp_reward: 40,
    status: "Active",
  },
];

export const fallbackLeaderboard = [
  { employee: "Manufacturing Dept", xp: 4500 },
  { employee: "Aditi Rao", xp: 3500 },
  { employee: "Corporate Dept", xp: 2500 },
  { employee: "Karan Shah", xp: 2100 },
  { employee: "Logistics Team", xp: 1850 },
  { employee: "Priya Menon", xp: 1600 },
];

export const fallbackDashboardStats = {
  carbonOffset: "12.4 tCO₂e",
  activeParticipants: 847,
  complianceScore: 94.7,
  totalEmissions: "4.2k tCO₂e",
};
