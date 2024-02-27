const puppeteer = require('puppeteer');

const usernames = Array.from({ length: 100 }, () => 'standard_user');

const loginToSauceDemo = async (username) => {
  try {
    const browser = await puppeteer.launch({ headless: false, timeout: 0, slowMo: 50 });
    const page = await browser.newPage();

    // Wait for navigation to the login page
    await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });

    // Use more specific selectors for username input, password input, and login button
    const usernameInput = await page.waitForSelector('[data-test="username"]', { visible: true, timeout: 30000 });
    await usernameInput.click();
    await usernameInput.type(username);

    const passwordInput = await page.waitForSelector('[data-test="password"]', { visible: true, timeout: 30000 });
    await passwordInput.click();
    await passwordInput.type('secret_sauce');

    const loginButton = await page.waitForSelector('[data-test="login-button"]', { visible: true, timeout: 30000 });
    await loginButton.click();

    // Wait for the login process to complete
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    // Additional logic or actions after login can be added here

    // Uncomment the line below if you want to keep the browser open after login
    await page.waitForTimeout(5000);

    // Close the browser to free up resources
    await browser.close();
  } catch (error) {
    console.error('Error during login:', error);
  }
};

const runLogin = async () => {
  const concurrencyLimit = 20; // Adjust this based on your system resources
  const chunks = usernames.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / concurrencyLimit);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  for (const chunk of chunks) {
    const loginPromises = chunk.map(loginToSauceDemo);
    await Promise.all(loginPromises);
  }
};

runLogin();
