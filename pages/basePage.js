// pages/BasePage.js
const { By, until } = require('selenium-webdriver');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url) {
    await this.driver.get(url);
  }

  byCss(selector) {
    return By.css(selector);
  }

  async find(selector, timeout = 10000) {
    const el = await this.driver.wait(until.elementLocated(this.byCss(selector)), timeout);
    return el;
  }

  async findAll(selector, timeout = 10000) {
    await this.driver.wait(until.elementLocated(this.byCss(selector)), timeout);
    return this.driver.findElements(this.byCss(selector));
  }

  async click(selector) {
    const el = await this.find(selector);
    await this.driver.wait(until.elementIsVisible(el), 10000);
    await el.click();
  }

  async type(selector, text) {
    const el = await this.find(selector);
    await this.driver.wait(until.elementIsVisible(el), 10000);
    await el.clear();
    await el.sendKeys(text);
  }

  async text(selector) {
    const el = await this.find(selector);
    return el.getText();
  }

  async waitUrlContains(part, timeout = 10000) {
    await this.driver.wait(until.urlContains(part), timeout);
  }

  async pause(ms) {
    await this.driver.sleep(ms);
  }
}

module.exports = BasePage;
