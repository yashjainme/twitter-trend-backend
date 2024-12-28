const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const Capabilities = require('selenium-webdriver/lib/capabilities').Capabilities;
const uuid = require('uuid');
const { MongoClient } = require('mongodb');
require('chromedriver');
require('dotenv').config();

// MongoDB Configuration
const mongoUrl = process.env.mongoUrl;
const dbName = process.env.dbName;
const collection_name = process.env.collection_name;

// Proxy Configuration
const PROXY_USERNAME = process.env.PROXY_USERNAME;
const PROXY_PASSWORD = process.env.PROXY_PASSWORD;
const PROXY_HOST = process.env.PROXY_HOST;
const PROXY_PORT = process.env.PROXY_PORT;

const CHROME_PROFILE_PATH = 'C:\\Users\\YASH JAIN\\AppData\\Local\\Google\\Chrome\\User Data';
const PROFILE_NAME = 'Profile 6';

// Utility function to wait for elements more efficiently
async function waitForElement(driver, selector, timeout = 10000) {
    try {
        return await driver.wait(until.elementLocated(By.css(selector)), timeout);
    } catch (error) {
        console.error(`Failed to find element: ${selector}`);
        throw error;
    }
}

async function fetchTwitterTrends() {
    const client = new MongoClient(mongoUrl);
    let driver;

    try {
        console.log('Setting up Chrome with ProxyMesh...');

        // Proxy setup for Selenium
        const capabilities = Capabilities.chrome();
        const proxyConfig = {
            proxyType: 'manual',
            httpProxy: `${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`,
            sslProxy: `${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`,
        };
        capabilities.set('proxy', proxyConfig);

        // Chrome options for headless mode and other optimizations
        const options = new chrome.Options();
        options.addArguments(
            '--headless', // Ensure the browser runs headlessly (without GUI)
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--ignore-certificate-errors',
            '--window-size=1920x1080',
            '--disable-extensions',
            '--disable-gpu',
            '--disable-software-rasterizer',
            `--proxy-server=http://${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`,
            `--user-data-dir=${CHROME_PROFILE_PATH}`,
            `--profile-directory=${PROFILE_NAME}`
        );

        // Initialize the browser
        driver = await new Builder()
            .withCapabilities(capabilities)
            .setChromeOptions(options)
            .build();

        await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000 }); // Reduced timeouts

        console.log('Navigating to Twitter...');
        await driver.get('https://x.com');
        await driver.sleep(2000); // Reduce initial sleep time

        console.log('Fetching trends...');
        const trends = await driver.wait(until.elementsLocated(By.css('[data-testid="trend"]')), 10000);
        const topTrends = [];

        // Fetch top 5 trends and store them
        for (let i = 0; i < Math.min(5, trends.length); i++) {
            const trendText = await trends[i].getText();
            topTrends.push(trendText);
        }

        console.log('Saving to MongoDB...');
        await client.connect();
        const collection = client.db(dbName).collection(collection_name);

        const data = {
            unique_id: uuid.v4(),
            trends: topTrends,
            date_time: new Date(),
            ip_address: PROXY_HOST
        };

        await collection.insertOne(data);
        console.log('Data saved successfully:', data);

    } catch (error) {
        console.error('Error:', error.message);

        if (driver) {
            const screenshotPath = 'error_screenshot.png';
            const screenshot = await driver.takeScreenshot();
            require('fs').writeFileSync(screenshotPath, screenshot, 'base64');
            console.log(`Saved screenshot for debugging: ${screenshotPath}`);
        }

    } finally {
        if (driver) await driver.quit();
        if (client) await client.close();
    }
}

module.exports = fetchTwitterTrends;
