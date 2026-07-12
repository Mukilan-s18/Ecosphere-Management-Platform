import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  await page.click('#esg-oracle-toggle');
  await new Promise(r => setTimeout(r, 1000));
  
  const chatPanel = await page.$eval('div[role="dialog"]', el => el.className);
  console.log('Chat Panel Classes:', chatPanel);
  
  await browser.close();
})();
