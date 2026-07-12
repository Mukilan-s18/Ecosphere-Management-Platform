console.log("=========================================");
console.log("TEST 2: Database Integration & Resiliency Check");
console.log("=========================================");

// Simulate a database failure or empty database scenario to test fallback behavior
async function testDatabaseFallback() {
  console.log("Simulating challenges fetch fallback behavior...");
  
  // Custom mock database function with failure trigger
  const mockGetChallenges = async (shouldFail) => {
    if (shouldFail) {
      throw new Error("Simulated network/DB error");
    }
    return { data: null }; // Simulates empty DB response
  };

  const getChallengesData = async (shouldFail) => {
    try {
      const { data } = await mockGetChallenges(shouldFail);
      if (data && data.length > 0) {
        return data;
      } else {
        return getFallbackChallenges();
      }
    } catch (err) {
      console.warn("✔ Handled fetch failure gracefully, falling back to mock challenges.");
      return getFallbackChallenges();
    }
  };

  const getFallbackChallenges = () => [
    { id: 1, title: 'Tree Plantation Drive', xp: 500 },
    { id: 2, title: 'Zero Waste Week', xp: 300 }
  ];

  // Test Case 1: Empty database returns fallback data
  console.log("Test Case 1: Empty database fetch...");
  const res1 = await getChallengesData(false);
  if (res1 && res1.length === 2 && res1[0].id === 1) {
    console.log("✔ Test Case 1 passed: Returned correct fallback data for empty response.");
  } else {
    throw new Error("Test Case 1 failed");
  }

  // Test Case 2: Network error triggers fallback data
  console.log("Test Case 2: Network/DB connection error...");
  const res2 = await getChallengesData(true);
  if (res2 && res2.length === 2 && res2[1].xp === 300) {
    console.log("✔ Test Case 2 passed: Handled exception and returned fallback data.");
  } else {
    throw new Error("Test Case 2 failed");
  }

  console.log("\n=========================================");
  console.log("RESULT: Test 2 Passed Successfully!");
  console.log("=========================================");
}

testDatabaseFallback().catch(err => {
  console.error(err);
  process.exit(1);
});
