import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  console.log('Clicking Oracle button...');
  await page.click('#esg-oracle-toggle');
  
  // Wait a bit to see if it opened
  await new Promise(r => setTimeout(r, 1000));
  
  const isPanelVisible = await page.evaluate(() => {
    const panel = document.querySelector('div[role="dialog"]');
    return window.getComputedStyle(panel).opacity === '1';
  });
  console.log('Is Oracle panel visible after click?', isPanelVisible);
  
  console.log('Clicking Reports tab...');
  await page.click('button[value="analytics"]');
  
  await new Promise(r => setTimeout(r, 1000));
  console.log('Current URL after tab click:', page.url());
  
  await browser.close();
})();
