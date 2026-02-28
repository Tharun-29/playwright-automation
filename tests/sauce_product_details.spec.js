const { test, expect } = require('@playwright/test');
const { SauceLoginPage } = require('../pages/SauceLoginPage');
const { SauceInventoryPage } = require('../pages/SauceInventoryPage');
const { SauceCartPage } = require('../pages/SauceCartPage');
const { Logger } = require('../utils/logger');

test.describe('Sauce Demo Product Details Tests', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new SauceLoginPage(page);
        inventoryPage = new SauceInventoryPage(page);
        cartPage = new SauceCartPage(page);

        Logger.info('Navigating to Sauce Demo for Product Details test');
        await loginPage.navigate('https://www.saucedemo.com/');
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test('Navigate to Product Details Page', async ({ page }) => {
        Logger.info('Validating Product Details Navigation');

        // Find the "Sauce Labs Backpack" item and click on its title to go to details page
        const itemName = 'Sauce Labs Backpack';
        await page.locator(`text=${itemName}`).click();

        // Verify we are on the details page by checking the 'Back to products' button
        await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

        // Verify the product name and price
        const title = await page.locator('.inventory_details_name').textContent();
        expect(title).toBe(itemName);

        const price = await page.locator('.inventory_details_price').textContent();
        expect(price).toContain('$29.99');
        Logger.info('Successfully navigated to and verified product details');
    });

    test('Add Product to Cart from Details Page', async ({ page }) => {
        Logger.info('Adding item from Product Details Page');

        // Open details page for a specific product
        const itemName = 'Sauce Labs Fleece Jacket';
        await page.locator(`text=${itemName}`).click();

        // Click Add to cart on details page using the dynamic data-test ID structure for SauceDemo
        await page.locator('[data-test="add-to-cart"]').click();

        // Verify cart badge updates to 1 item
        const cartBadge = page.locator('.shopping_cart_badge');
        await expect(cartBadge).toHaveText('1');

        // Go to cart via the cart icon
        await page.locator('.shopping_cart_link').click();

        // Read cart items using the page object
        const cartItems = await cartPage.getCartItems();
        expect(cartItems).toContain(itemName);

        Logger.info('Added item to cart from details page successfully');
    });
});
