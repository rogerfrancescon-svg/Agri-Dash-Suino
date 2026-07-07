const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // click the import tab
  await page.evaluate(() => {
     const links = Array.from(document.querySelectorAll('a, button, div'));
     const importTab = links.find(el => el.textContent.includes('Importar/Exportar'));
     if (importTab) importTab.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // create dummy csv
  fs.writeFileSync('test.csv', 'Data,Integrado\n01/01/2023,Teste\n');
  
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    console.log("File input found");
    await fileInput.uploadFile('test.csv');
    console.log("File uploaded");
    await new Promise(r => setTimeout(r, 1000));
    const textarea = await page.$('textarea');
    const value = await page.evaluate(el => el.value, textarea);
    console.log("Textarea value:", value);
  } else {
    console.log("File input not found");
  }
  
  await browser.close();
})();
