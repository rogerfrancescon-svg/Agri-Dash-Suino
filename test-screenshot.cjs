const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    window.dispatchEvent(new Event('offline-login'));
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
     const links = Array.from(document.querySelectorAll('button'));
     const importTab = links.find(el => el.textContent.includes('Importar Dados'));
     if (importTab) importTab.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'screenshot.png' });
  
  await browser.close();
})();
