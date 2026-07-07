const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('dialog', async dialog => {
    console.log('DIALOG:', dialog.message());
    await dialog.accept();
  });
  
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
  
  // create dummy iso-8859-1 csv
  fs.writeFileSync('test_final2.csv', Buffer.from('Data;Nome Integrado;Lote;Idade;Animais Alojados;Recomendação;Mortalidade;Comedouro;Peso Aloj;Pontuação Sanitária;Colaborador;Consumo\n01/01/2023;Teste;1;10;1000;Ração X;0;Auto;30.5;Excelente;João;100\n01/01/23;Teste;1;10;1000;Ração X;0;Auto;30.5;Excelente;João;100', 'latin1'));
  
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    console.log("File input found");
    await fileInput.uploadFile(path.resolve('test_final2.csv'));
    console.log("File uploaded");
    await new Promise(r => setTimeout(r, 2000));
    
    // Now click import button
    await page.evaluate(() => {
       const buttons = Array.from(document.querySelectorAll('button'));
       const importBtn = buttons.find(b => b.textContent.includes('Iniciar Importação'));
       if (importBtn) importBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    const logs = await page.evaluate(() => {
       const logElements = Array.from(document.querySelectorAll('.bg-slate-50 > div'));
       return logElements.map(el => el.textContent);
    });
    console.log("Logs:", logs);
    
    const rawData = await page.evaluate(() => document.querySelector('textarea').value);
    console.log("Raw Data Length:", rawData.length);
    
  } else {
    console.log("File input not found");
  }
  
  await browser.close();
})();
