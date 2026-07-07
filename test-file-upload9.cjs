const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
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
  fs.writeFileSync('test_final4.csv', Buffer.from('Data;Nome Integrado;Lote;Idade;Animais Alojados;Recomendação;Mortalidade;Comedouro;Peso Aloj;Pontuação Sanitária;Colaborador;Consumo\n01/01/2023;Teste8;1;10;1000;Ração X;0;Auto;30.5;Excelente;João;100', 'latin1'));
  
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.uploadFile(path.resolve('test_final4.csv'));
    await new Promise(r => setTimeout(r, 1000));
    
    // Now click import button
    await page.evaluate(() => {
       const buttons = Array.from(document.querySelectorAll('button'));
       const importBtn = buttons.find(b => b.textContent.includes('Iniciar Importação'));
       if (importBtn) importBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 100)); // check immediately
    const btnText = await page.evaluate(() => {
       const buttons = Array.from(document.querySelectorAll('button'));
       const importBtn = buttons.find(b => b.textContent.includes('Importando...'));
       return importBtn ? importBtn.textContent : 'Not found';
    });
    console.log("Button text after click:", btnText);
    
    await new Promise(r => setTimeout(r, 500));
    const logs = await page.evaluate(() => {
       const logElements = Array.from(document.querySelectorAll('.bg-slate-50 > div'));
       return logElements.map(el => el.textContent);
    });
    console.log("Logs during import:", logs);
    
  } else {
    console.log("File input not found");
  }
  
  await browser.close();
})();
