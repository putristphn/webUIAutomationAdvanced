import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import chrome from 'selenium-webdriver/chrome.js';
import { buildDriver } from '../../utils/driver.js';
import LoginPage from '../../pages/loginPage.js';
import InventoryPage from '../../pages/inventoryPage.js';

import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

describe('Product Sorting functionality using Page Object Model (POM)', function () {
  this.timeout(40000);
  let driver, login, inventory;

  before(async () => {
    driver = await buildDriver();
    login = new LoginPage(driver);
    inventory = new InventoryPage(driver);

    await login.open();
    await login.login('standard_user', 'secret_sauce');
    await inventory.assertOnPage();
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
  
  it('Products successfully sorted by Name A→Z', async () => {
    await inventory.sortByValue('az');
    const first = await inventory.firstName();
    assert.strictEqual(first, 'Sauce Labs Backpack', '"Sauce Labs Backpack" should be the first item name when sorted A→Z');
  });

  it('Products successfully sorted by Name Z→A', async () => {
    await inventory.sortByValue('za');
    const first = await inventory.firstName();
    assert.strictEqual(first, 'Test.allTheThings() T-Shirt (Red)', '"Test.allTheThings() T-Shirt (Red)" should be the first item name when sorted Z→A');
  });

  it('Products successfully sorted by Price low→high', async () => {
    await inventory.sortByValue('lohi');
    const price = (await inventory.firstPriceText()).trim();
    assert.strictEqual(price, '$7.99', '$7.99 should be the first item price when sorted Price low→high');
  });

  it('Products successfully sorted by Price high→low', async () => {
    await inventory.sortByValue('hilo');
    const price = (await inventory.firstPriceText()).trim();
    assert.strictEqual(price, '$49.99', '$49.99 should be the first item price when sorted Price high→low');
  });

  it('Visual test - Compare sorting A to Z layout', async () => {
    await inventory.sortByValue('az');
    
    const baselinePath = 'sorting-az-baseline.png';
    if (!fs.existsSync(baselinePath)) {
      await takeScreenshot(baselinePath);
      console.log('A→Z sorting baseline screenshot created');
      return;
    }

    const currentPath = 'sorting-az-current.png';
    await takeScreenshot(currentPath);
    
    const diffPath = 'sorting-az-diff.png';
    const diffPixels = compareScreenshots(baselinePath, currentPath, diffPath);
    assert.ok(diffPixels < 100, `Visual difference in A→Z sorting is too high: ${diffPixels} pixels`);
  });

  it('Visual test - Compare sorting Z to A layout', async () => {
    await inventory.sortByValue('za');
    
    const baselinePath = 'sorting-za-baseline.png';
    if (!fs.existsSync(baselinePath)) {
      await takeScreenshot(baselinePath);
      console.log('Z→A sorting baseline screenshot created');
      return;
    }

    const currentPath = 'sorting-za-current.png';
    await takeScreenshot(currentPath);
    
    const diffPath = 'sorting-za-diff.png';
    const diffPixels = compareScreenshots(baselinePath, currentPath, diffPath);
    assert.ok(diffPixels < 100, `Visual difference in Z→A sorting is too high: ${diffPixels} pixels`);
  });

  it('Visual test - Compare sorting price low to high layout', async () => {
    await inventory.sortByValue('lohi');
    
    const baselinePath = 'sorting-lohi-baseline.png';
    if (!fs.existsSync(baselinePath)) {
      await takeScreenshot(baselinePath);
      console.log('Price low→high sorting baseline screenshot created');
      return;
    }

    const currentPath = 'sorting-lohi-current.png';
    await takeScreenshot(currentPath);
    
    const diffPath = 'sorting-lohi-diff.png';
    const diffPixels = compareScreenshots(baselinePath, currentPath, diffPath);
    assert.ok(diffPixels < 100, `Visual difference in price low→high sorting is too high: ${diffPixels} pixels`);
  });

  it('Visual test - Compare sorting price high to low layout', async () => {
    await inventory.sortByValue('hilo');
    
    const baselinePath = 'sorting-hilo-baseline.png';
    if (!fs.existsSync(baselinePath)) {
      await takeScreenshot(baselinePath);
      console.log('Price high→low sorting baseline screenshot created');
      return;
    }

    const currentPath = 'sorting-hilo-current.png';
    await takeScreenshot(currentPath);
    
    const diffPath = 'sorting-hilo-diff.png';
    const diffPixels = compareScreenshots(baselinePath, currentPath, diffPath);
    assert.ok(diffPixels < 100, `Visual difference in price high→low sorting is too high: ${diffPixels} pixels`);
  });
});