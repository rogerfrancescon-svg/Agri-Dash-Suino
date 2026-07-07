const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Try to bypass offline login screen if possible
  // In App.tsx, offline-login event triggers it
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
  
  // create dummy csv
  fs.writeFileSync('test.csv', 'Data,Integrado,Alojamento,Idade,Recomendação,Consumo acumulado,Mortalidade,Comedouro,Colaborador\n01/01/2023,Teste,01/01/2023,10,Rec,10,0,Auto,Test\n');
  
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    console.log("File input found");
    await fileInput.uploadFile('test.csv');
    console.log("File uploaded");
    await new Promise(r => setTimeout(r, 2000));
    const textarea = await page.$('textarea');
    const value = await page.evaluate(el => el.value, textarea);
    console.log("Textarea value:", value);
    
    // Now click import button
    await page.evaluate(() => {
       const buttons = Array.from(document.querySelectorAll('button'));
       const importBtn = buttons.find(b => b.textContent.includes('Iniciar Importação'));
       if (importBtn) importBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
  } else {
    console.log("File input not found");
  }
  
  await browser.close();
})();
