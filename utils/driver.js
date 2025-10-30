// utils/driver.js
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function buildDriver() {
  const options = new chrome.Options();

  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new', '--window-size=1920,1080');
  } else {
    options.addArguments('--incognito');
  }

  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

module.exports = buildDriver;
