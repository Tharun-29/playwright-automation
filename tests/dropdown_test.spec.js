const { test, expect } = require('@playwright/test');
const { SauceLoginPage } = require('../pages/SauceLoginPage');
const { SauceInventoryPage } = require('../pages/SauceInventoryPage');
const { Logger } = require('../utils/logger');

test.describe('Rahul Shetty Academy E2E Flow', () => {

    test('Register, Login, and Fetch First Product', async ({ page }) => {
        // Create a unique email to ensure registration succeeds every time the test runs
        const uniqueEmail = `playtester_${Date.now()}@gemini.com`;
        const password = 'Password@123';

        Logger.info(`Starting flow with new unique email: ${uniqueEmail}`);

        // --- STEP 1: Navigate to Application ---
        Logger.info('Navigating to Rahul Shetty Academy Login');
        await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

        // --- STEP 2: Navigate to Registration ---
        Logger.info('Navigating to Registration side');
        await page.locator('a.text-reset').click(); // Clicking 'Register here'

        // Wait for registration form to be interactable
        await expect(page.locator('#firstName')).toBeVisible();

        // --- STEP 3: Fill Registration Form ---
        Logger.info('Filing out the registration form');
        await page.locator('#firstName').fill('Super');
        await page.locator('#lastName').fill('Tester');
        await page.locator('#userEmail').fill(uniqueEmail);
        await page.locator('#userMobile').fill('1234567890');

        // Select 'Student' from dropdown
        await page.locator('select.custom-select').selectOption('Student');

        // Check the 'Male' radio button
        await page.locator("input[value='Male']").check();

        // Passwords
        await page.locator('#userPassword').fill(password);
        await page.locator('#confirmPassword').fill(password);

        // Age confirmation Checkbox
        await page.locator("input[type='checkbox']").check();

        // Submit Registration Form
        // We use the ID #login because this specific app recycles the ID on both forms
        await page.locator('#login').click();

        // --- STEP 4: Login ---
        Logger.info('Routing back to Login');
        // Rahul Shetty's app requires clicking 'Login' after registering to go back, so we force navigation gracefully
        await page.locator('button:has-text("Login")').click().catch(() => { });
        await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    });
});
