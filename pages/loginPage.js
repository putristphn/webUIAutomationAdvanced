// pages/LoginPage.js
const BasePage = require('./basePage');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = 'https://www.saucedemo.com/';
    this.sel = {
      username: '[data-test="username"]',
      password: '[data-test="password"]',
      submit: '.submit-button.btn_action',
      error: '[data-test="error"]',
    };
  }

  async open() {
    await super.open(this.url);
  }

  async login(username, password) {
    await this.type(this.sel.username, username);
    await this.type(this.sel.password, password);
    await this.click(this.sel.submit);
  }

  async errorText() {
    return this.text(this.sel.error);
  }
}

module.exports = LoginPage;
