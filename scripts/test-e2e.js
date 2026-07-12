console.log("=========================================");
console.log("TEST 3: End-to-End Gamification Flow Check");
console.log("=========================================");

// Simulate E2E flow states
let mockDatabase = {
  users: [
    { id: 1, name: "Karan Shah", xp: 1200 },
    { id: 2, name: "Mukilan S", xp: 900 }
  ],
  challenges: [
    { id: 101, title: "Tree Plantation Drive", xp_reward: 500 }
  ],
  participations: []
};

// Step 1: Submit evidence
function submitEvidence(userId, challengeId, proofUrl) {
  console.log(`[User] Submitting proof for challenge ${challengeId} by user ${userId}...`);
  const newPart = {
    id: mockDatabase.participations.length + 1,
    user_id: userId,
    challenge_id: challengeId,
    proof_url: proofUrl,
    status: 'pending'
  };
  mockDatabase.participations.push(newPart);
  return newPart;
}

// Step 2: Manager reviews and approves
async function approveProof(participationId, userId, xpToAdd) {
  console.log(`[Manager] Approving participation ${participationId} and adding ${xpToAdd} XP to user ${userId}...`);
  
  // Update status
  const part = mockDatabase.participations.find(p => p.id === participationId);
  if (!part) throw new Error("Participation not found");
  part.status = 'approved';
  
  // Award XP
  const user = mockDatabase.users.find(u => u.id === userId);
  if (!user) throw new Error("User not found");
  user.xp += xpToAdd;
  
  return { success: true, newXp: user.xp };
}

async function runE2EFlow() {
  const userId = 1; // Karan Shah
  const challengeId = 101;
  const initialXp = mockDatabase.users.find(u => u.id === userId).xp;
  
  // 1. Submit
  const part = submitEvidence(userId, challengeId, "https://example.com/tree.jpg");
  if (mockDatabase.participations.length !== 1 || part.status !== 'pending') {
    throw new Error("E2E Step 1 failed: Submission not registered");
  }
  console.log("✔ Step 1: Proof submitted with pending status.");

  // 2. Approve
  const res = await approveProof(part.id, userId, 500);
  if (!res.success || res.newXp !== initialXp + 500) {
    throw new Error("E2E Step 2 failed: XP not awarded correctly");
  }
  console.log("✔ Step 2: Proof approved and XP awarded.");

  // 3. Verify Leaderboard
  const sortedLeaderboard = [...mockDatabase.users].sort((a, b) => b.xp - a.xp);
  if (sortedLeaderboard[0].name !== "Karan Shah" || sortedLeaderboard[0].xp !== 1700) {
    throw new Error("E2E Step 3 failed: Leaderboard rank not updated");
  }
  console.log("✔ Step 3: Leaderboard ranking updated successfully.");

  console.log("\n=========================================");
  console.log("RESULT: Test 3 Passed Successfully!");
  console.log("=========================================");
}

runE2EFlow().catch(err => {
  console.error("❌ E2E Flow Failed!", err);
  process.exit(1);
});
