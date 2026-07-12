const { execSync } = require('child_process');

console.log("=========================================");
console.log("TEST 1: Static Type & Compile-time Check");
console.log("=========================================");

try {
  console.log("Running TypeScript compilation check (tsc --noEmit)...");
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log("✔ TypeScript compile check passed!");
  
  console.log("\nRunning Next.js production build test (next build)...");
  execSync('npm run build', { stdio: 'inherit' });
  console.log("✔ Next.js production build compiled successfully!");
  
  console.log("\n=========================================");
  console.log("RESULT: Test 1 Passed Successfully!");
  console.log("=========================================");
} catch (error) {
  console.error("\n❌ Test 1 Failed!");
  process.exit(1);
}
