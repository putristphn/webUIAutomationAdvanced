// utils/driver.js
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';  

async function buildDriver() {
  const options = new chrome.Options();

  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new', '--window-size=1920,1080');
  } else {
    options.addArguments('--incognito');
  }

  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

export { buildDriver };
