// tests/sesi11_putristphn/login.pom.test.js
import { Builder, By, until  } from 'selenium-webdriver'; 
import assert from 'assert'; 
import chrome from 'selenium-webdriver/chrome.js';
import { buildDriver } from '../../utils/driver.js';
import LoginPage from '../../pages/loginPage.js';
import InventoryPage from '../../pages/inventoryPage.js';

import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

describe('Login functionality using Page Object Model (POM)', function () {
  this.timeout(40000);
  let driver, login, inventory;

  before(async () => {
    driver = await buildDriver();
    login = new LoginPage(driver);
    inventory = new InventoryPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  // Add some delay 2s after each test
  afterEach(async function () {
    await driver.sleep(2000);
  });

  // Helper function untuk mengambil screenshot
  async function takeScreenshot(filename) {
    const image = await driver.takeScreenshot();
    const buffer = Buffer.from(image, 'base64');
    fs.writeFileSync(filename, buffer);
  }

  // Helper function untuk membandingkan gambar
  function compareScreenshots(img1, img2, diffFile) {
    const baseline = PNG.sync.read(fs.readFileSync(img1));
    const current = PNG.sync.read(fs.readFileSync(img2));
    const { width, height } = baseline;
    const diff = new PNG({ width, height });
    
    const numDiffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );
    
    fs.writeFileSync(diffFile, PNG.sync.write(diff));
    return numDiffPixels;
  }

  it('User login successfully with valid credentials', async () => {
    await login.open();
    await login.login('standard_user', 'secret_sauce');
    await inventory.assertOnPage();

    const logo = await inventory.text(inventory.sel.appLogo);
    assert.strictEqual(logo, 'Swag Labs', 'Should directed to the Inventory Page after login');
  });

  it('User failed to login with invalid credentials', async () => {
    await login.open();
    await login.login('locked_out_user', 'secret_sauce');

    const msg = await login.errorText();
    assert.match(msg, /locked out/i, 'Error message should contain "locked out"');
  });

  it('Visual test - Compare login page layout', async () => {
    // Buka halaman login
    await login.open();
    
    // Take baseline screenshot if it doesn't exist
    const baselinePath = 'login-baseline.png';
    if (!fs.existsSync(baselinePath)) {
      await takeScreenshot(baselinePath);
      console.log('Login baseline screenshot created');
      return;
    }

    // Take current screenshot
    const currentPath = 'login-current.png';
    await takeScreenshot(currentPath);
    
    // Compare screenshots and generate diff
    const diffPath = 'login-diff.png';
    const diffPixels = compareScreenshots(baselinePath, currentPath, diffPath);
    
    // Assert that the difference is within acceptable threshold
    assert.ok(diffPixels < 100, `Visual difference is too high: ${diffPixels} pixels`);
  });
});
