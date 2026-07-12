import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const html = await page.content();
  console.log('HAS LOADING CHART:', html.includes('Loading chart...'));
  console.log('HAS RECHARTS:', html.includes('recharts-wrapper'));
  console.log('HAS IS MOUNTED TRUE?', await page.evaluate(() => window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ? 'devtools active' : 'no devtools'));
  await browser.close();
})();
