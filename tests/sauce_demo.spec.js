const { test, expect } = require('@playwright/test');
const { SauceLoginPage } = require('../pages/SauceLoginPage');
const { SauceInventoryPage } = require('../pages/SauceInventoryPage');
const { SauceCartPage } = require('../pages/SauceCartPage');
const { SauceCheckoutPage } = require('../pages/SauceCheckoutPage');
const { Logger } = require('../utils/logger');

test.describe('Sauce Demo Authentication', () => {
    test('Login Failure with Locked Out User', async ({ page }) => {
        const loginPage = new SauceLoginPage(page);
        await loginPage.navigate('https://www.saucedemo.com/');
        await loginPage.login('locked_out_user', 'secret_sauce');
        await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
    });

    test('Login Failure with Incorrect Password', async ({ page }) => {
        const loginPage = new SauceLoginPage(page);
        await loginPage.navigate('https://www.saucedemo.com/');
        await loginPage.login('standard_user', 'wrong_password');
        await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    });
});

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
    });

    test('Inventory Sorting (Price Low to High)', async ({ page }) => {
        Logger.info('Testing Inventory Sorting');
        await inventoryPage.sortBy('lohi');

        const items = await inventoryPage.getInventoryItems();
        const priceFirst = parseFloat(items[0].price.replace('$', ''));
        const priceLast = parseFloat(items[items.length - 1].price.replace('$', ''));

        expect(priceFirst).toBeLessThanOrEqual(priceLast);
        Logger.info('Sorting verified: Prices are in ascending order');
    });

    test('Inventory Sorting (Price High to Low)', async ({ page }) => {
        Logger.info('Testing Inventory Sorting High to Low');
        await inventoryPage.sortBy('hilo');

        const items = await inventoryPage.getInventoryItems();
        const priceFirst = parseFloat(items[0].price.replace('$', ''));
        const priceLast = parseFloat(items[items.length - 1].price.replace('$', ''));

        expect(priceFirst).toBeGreaterThanOrEqual(priceLast);
        Logger.info('Sorting verified: Prices are in descending order');
    });

    test('Purchase Lowest Price Product', async ({ page }) => {
        Logger.info('Starting Purchase Flow for Lowest Price Product');

        // 1. Find lowest price item
        const items = await inventoryPage.getInventoryItems();
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

        // Note: cartItems is an array of strings (item names now)
        expect(cartItems).toContain(lowestPriceItem.name);

        // 4. Checkout
        await cartPage.checkout();
        await checkoutPage.fillInformation('John', 'Doe', '12345');
        await checkoutPage.finish();

        // 5. Verify Success
        const confirmation = await checkoutPage.getOrderConfirmation();
        expect(confirmation).toBe('Thank you for your order!');
    });

    test('Verify Cart Persistence', async ({ page }) => {
        Logger.info('Verifying Cart Persistence');
        const firstItemName = 'Sauce Labs Backpack';

        await inventoryPage.addItemToCart(firstItemName);

        Logger.info('Reloading page...');
        await page.reload();

        await inventoryPage.openCart();
        const cartItems = await cartPage.getCartItems();

        expect(cartItems).toContain(firstItemName);
        Logger.info('Cart persistence verified');
    });

    test('Add Multiple Items to Cart', async ({ page }) => {
        Logger.info('Adding Multiple Items');
        const item1 = 'Sauce Labs Backpack';
        const item2 = 'Sauce Labs Bike Light';

        await inventoryPage.addItemToCart(item1);
        await inventoryPage.addItemToCart(item2);

        await inventoryPage.openCart();
        const cartItems = await cartPage.getCartItems();

        expect(cartItems).toHaveLength(2);
        expect(cartItems).toContain(item1);
        expect(cartItems).toContain(item2);
        Logger.info('Multiple items added to cart successfully');
    });

    test('Checkout Validation - Empty Fields', async ({ page }) => {
        Logger.info('Verifying Checkout Form Validation');
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        await inventoryPage.openCart();
        await cartPage.checkout();

        // Try traversing forward without data
        await checkoutPage.continueButton.click();

        const error = await checkoutPage.getErrorMessage();
        expect(error).toContain('Error: First Name is required');
        Logger.info('Checkout validation error verified');
    });

    test('Logout Flow', async ({ page }) => {
        Logger.info('Verifying Logout');
        await inventoryPage.logout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
});
