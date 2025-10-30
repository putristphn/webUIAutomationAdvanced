const assert = require('assert');
const buildDriver = require('../../utils/driver');
const LoginPage = require('../../pages/loginPage');
const InventoryPage = require('../../pages/inventoryPage');

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
});
