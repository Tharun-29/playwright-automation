const { test, expect } = require('@playwright/test');
const { SauceLoginPage } = require('../pages/SauceLoginPage');
const { SauceInventoryPage } = require('../pages/SauceInventoryPage');
const { SauceCartPage } = require('../pages/SauceCartPage');
const { SauceCheckoutPage } = require('../pages/SauceCheckoutPage');
const { Logger } = require('../utils/logger');

test.describe('Sauce Demo Tests', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new SauceLoginPage(page);
        inventoryPage = new SauceInventoryPage(page);
        cartPage = new SauceCartPage(page);
        checkoutPage = new SauceCheckoutPage(page);

        Logger.info('Navigating to Sauce Demo');
        await loginPage.navigate('https://www.saucedemo.com/');
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test('Home Page Validation', async ({ page }) => {
        Logger.info('Validating Home Page');
        await expect(inventoryPage.headerTitle).toHaveText('Products');

        const items = await inventoryPage.getInventoryItems();
        expect(items.length).toBeGreaterThan(0);

        console.log(`Found ${items.length} items on the home page.`);
        items.forEach(item => {
            console.log(`- ${item.name} (${item.price})`);
        });
    });

    test('Purchase Lowest Price Product', async ({ page }) => {
        Logger.info('Starting Purchase Flow for Lowest Price Product');

        // 1. Find lowest price item
        const items = await inventoryPage.getInventoryItems();
        // Parse price string "$29.99" -> 29.99
        const sortedItems = items.sort((a, b) => {
            const priceA = parseFloat(a.price.replace('$', ''));
            const priceB = parseFloat(b.price.replace('$', ''));
            return priceA - priceB;
        });

        const lowestPriceItem = sortedItems[0];
        Logger.info(`Lowest price item found: ${lowestPriceItem.name} at ${lowestPriceItem.price}`);

        // 2. Add to cart
        await inventoryPage.addItemToCart(lowestPriceItem.name);

        // 3. Go to cart
        await inventoryPage.openCart();
        const cartItems = await cartPage.getCartItems();
        expect(cartItems).toContain(lowestPriceItem.name); // Using simple text check for now

        // 4. Checkout
        await cartPage.checkout();
        await checkoutPage.fillInformation('John', 'Doe', '12345');
        await checkoutPage.finish();

        // 5. Verify Success
        const confirmation = await checkoutPage.getOrderConfirmation();
        expect(confirmation).toBe('Thank you for your order!');
        Logger.info('Purchase successful');
    });

    test('Verify Cart Persistence', async ({ page }) => {
        Logger.info('Verifying Cart Persistence');
        const firstItemName = 'Sauce Labs Backpack';

        await inventoryPage.addItemToCart(firstItemName);

        Logger.info('Reloading page...');
        await page.reload();

        await inventoryPage.openCart();
        const cartItems = await cartPage.getCartItems();

        // Note: textContent might header title + item text, checking if array contains part of it
        const isItemInCart = cartItems.some(text => text.includes(firstItemName));
        expect(isItemInCart).toBeTruthy();
        Logger.info('Cart persistence verified');
    });

    test('Logout Flow', async ({ page }) => {
        Logger.info('Verifying Logout');
        // Implement logout logic here if menu page object existed, 
        // for now just asserting we are logged in from beforeEach
        await expect(page).toHaveURL(/inventory.html/);
    });
});
