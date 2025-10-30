// tests/sesi11_putristphn/login.pom.test.js
const assert = require('assert');
const buildDriver = require('../../utils/driver');
const LoginPage = require('../../pages/loginPage');
const InventoryPage = require('../../pages/inventoryPage');

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
});
