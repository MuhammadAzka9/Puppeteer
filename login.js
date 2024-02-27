const puppeteer = require('puppeteer');

const usernames = [
  'standard_user',
  'locked_out_user',
  'problem_user',
  'performance_glitch_user',
  'error_user',
  'visual_user'
];

const loginToSauceDemo = async (username) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com/');

  const usernameInput = await page.waitForXPath('//*[@id="user-name"]');
  await usernameInput.click();
  await usernameInput.type(username);

  const passwordInput = await page.waitForXPath('//*[@id="password"]');
  await passwordInput.click();
  await passwordInput.type('secret_sauce');

  const loginButton = await page.waitForXPath('//*[@id="login-button"]');
  await loginButton.click();

  // Wait for the login process to complete, you may need to adjust this delay
  await page.waitForTimeout(2000);

  // Additional logic or actions after login can be added here

  // Uncomment the line below if you want to keep the browser open after login
  // await page.waitForTimeout(5000);

  await browser.close();
};

const runLogin = async () => {
  const loginPromises = [];

  for (let i = 0; i < usernames.length; i++) {
    loginPromises.push(loginToSauceDemo(usernames[i]));
  }

  await Promise.all(loginPromises);
};

runLogin();
