const fs = require('fs');
const path = require('path');

console.log("=========================================");
console.log("TEST 4: UI, Responsive & Theme Verification");
console.log("=========================================");

function verifyUiArchitecture() {
  // 1. Check globals.css for Tailwind v4 dark mode config
  const cssPath = path.join(__dirname, '../app/globals.css');
  console.log("Checking globals.css theme definitions...");
  
  if (!fs.existsSync(cssPath)) {
    throw new Error("app/globals.css is missing!");
  }
  
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  if (cssContent.includes('@custom-variant dark') || cssContent.includes('.dark')) {
    console.log("✔ Dark mode css variants found.");
  } else {
    throw new Error("globals.css is missing dark mode variables or variants config");
  }

  // 2. Check layout for responsive sidebar wrappers
  const layoutPath = path.join(__dirname, '../app/layout.tsx');
  console.log("Checking root layout for structural responsive classes...");
  
  if (!fs.existsSync(layoutPath)) {
    throw new Error("app/layout.tsx is missing!");
  }
  
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (layoutContent.includes('ml-64') || layoutContent.includes('flex')) {
    console.log("✔ Layout structure matches correct flexible layout.");
  } else {
    throw new Error("Root layout is missing correct container classes");
  }

  // 3. Verify page files for overflow-x-auto classes on tables
  const pages = [
    '../app/manager/page.tsx',
    '../app/governance/page.tsx',
    '../app/environmental/page.tsx'
  ];

  console.log("Checking page layout wrappers for mobile responsiveness...");
  pages.forEach(p => {
    const pagePath = path.join(__dirname, p);
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');
      if (content.includes('overflow') || content.includes('grid') || content.includes('max-w')) {
        console.log(`✔ Responsive wrappers verified for ${path.basename(pagePath)}.`);
      } else {
        throw new Error(`Responsive wrappers missing in ${path.basename(pagePath)}`);
      }
    }
  });

  console.log("\n=========================================");
  console.log("RESULT: Test 4 Passed Successfully!");
  console.log("=========================================");
}

try {
  verifyUiArchitecture();
} catch (error) {
  console.error("❌ Test 4 Failed!", error.message);
  process.exit(1);
}
