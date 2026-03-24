const { test, expect } = require('@playwright/test');
const { SauceLoginPage } = require('../pages/SauceLoginPage');
const { SauceInventoryPage } = require('../pages/SauceInventoryPage');
const { Logger } = require('../utils/logger');

test.describe('Sauce Demo Products', () => {
    let loginPage;
    let inventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new SauceLoginPage(page);
        inventoryPage = new SauceInventoryPage(page);

        Logger.info('Navigating to Sauce Demo');
        await loginPage.navigate('https://www.saucedemo.com/');
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test('Fetch Product Titles from Inventory Cards', async ({ page }) => {
        Logger.info('Fetching product titles from the inventory page');

        // Wait for the first inventory item to be visible to ensure the page loaded
        await expect(inventoryPage.inventoryItems.first()).toBeVisible();

        // Using your existing Page Object Model method to get all item data
        const items = await inventoryPage.getInventoryItems();

        // Extracting just the product names from the array of objects
        const productTitles = items.map(item => item.name);

        // Printing the titles using your logger
        Logger.info('--- List of Product Titles on Current Page ---');

        productTitles.forEach((title, index) => {
            Logger.info(`${index + 1}. ${title}`);
        });
        Logger.info('--------------------------------------------');

        // Added assertions to properly validate our script worked
        expect(productTitles.length).toBeGreaterThan(0);
        expect(productTitles).toContain('Sauce Labs Backpack');
    });
});
