import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  const chartHtml = await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll('div.border-slate-800')).find(el => el.textContent.includes('Emissions Trend'));
    if (card) return card.innerHTML;
    
    const h3 = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.includes('Emissions Trend'));
    if (h3) return h3.parentElement.parentElement.innerHTML;
    return 'Chart not found';
  });
  
  console.log('CHART HTML:', chartHtml);
  
  await browser.close();
})();
