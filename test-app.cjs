const { JSDOM } = require('jsdom');
const server = async () => {
  const dom = await JSDOM.fromURL(`http://localhost:5173/`, {
    runScripts: "dangerously",
    resources: "usable"
  });
  
  dom.window.addEventListener('error', (event) => {
    console.error('Window error:', event.error);
  });
  dom.window.console.error = (...args) => console.error('Console error:', ...args);
  
  setTimeout(() => {
    console.log("App HTML:", dom.window.document.getElementById('root').innerHTML.substring(0, 500));
    const errors = dom.window.document.querySelector('.error');
    if(errors) console.log(errors.innerHTML);
    process.exit(0);
  }, 4000);
};
server();
