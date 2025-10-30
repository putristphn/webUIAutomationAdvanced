// pages/InventoryPage.js
import BasePage from './basePage.js';
import { until } from 'selenium-webdriver';   

class InventoryPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.sel = {
      appLogo: '.app_logo',
      sortSelect: '[data-test="product-sort-container"]',
      firstItemName: '.inventory_item_name',
      firstItemPrice: '.inventory_item_price',
    };
  }

  async assertOnPage() {
    await this.waitUrlContains('/inventory.html');
    const logo = await this.text(this.sel.appLogo);
    if (logo !== 'Swag Labs') {
      throw new Error('Not directed to the Inventory page or the logo is missing');
    }
  }

  // values: 'az' | 'za' | 'lohi' | 'hilo'
  async sortByValue(value) {
    await this.click(this.sel.sortSelect);
    await this.click(`${this.sel.sortSelect} option[value="${value}"]`);
  }

  async firstName() {
    return this.text(this.sel.firstItemName);
  }

  async firstPriceText() {
    return this.text(this.sel.firstItemPrice);
  }
}

export default InventoryPage;
