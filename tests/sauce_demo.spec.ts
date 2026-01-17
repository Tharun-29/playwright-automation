import { test, expect } from '@playwright/test';
import { SauceLoginPage } from '../pages/SauceLoginPage';
import { SauceInventoryPage } from '../pages/SauceInventoryPage';
import { Logger } from '../utils/logger';

test('Sauce Demo Login Test', async ({ page }) => {
    const loginPage = new SauceLoginPage(page);
    const inventoryPage = new SauceInventoryPage(page);

    Logger.info('Navigating to Sauce Demo');
    await loginPage.navigate('https://www.saucedemo.com/');

    Logger.info('Logging in with standard_user');
    await loginPage.login('standard_user', 'secret_sauce');

    // Verify login success
    await expect(inventoryPage.headerTitle).toHaveText('Products');
    await expect(page).toHaveURL(/inventory.html/);

    Logger.info('Sauce Demo login verified');
});
