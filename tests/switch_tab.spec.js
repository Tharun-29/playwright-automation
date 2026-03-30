const { test, expect } = require('@playwright/test');

test.describe('Tab Switch and Window Automation', () => {

    test('Automate Page or tab switch by clicking Join Rahul Shetty link', async ({ context, page }) => {
        // --- STEP 1: Navigate to the Application ---
        // Go to the main practice page
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

        // --- STEP 2: Locate the Target Link ---
        // Locate the blinking or top-right link "Join Rahul Shetty for a QA Career Meetup..."
        const joinRahulShettyLink = page.locator('.blinkingText');

        // Verify the link is visible before interacting
        await expect(joinRahulShettyLink).toBeVisible();

        // --- STEP 3: Setup Listener for New Tab ---
        // Start waiting for the new page (tab) to open concurrently with the click action
        const pagePromise = context.waitForEvent('page');

        // Click the actual link which opens in a new tab due to target="_blank"
        await joinRahulShettyLink.click();

        // Catch the newly opened page reference from the promise
        const newPage = await pagePromise;

        // Wait until the new tab has adequately loaded its content
        await newPage.waitForLoadState('domcontentloaded');

        // --- STEP 4: Validations on the New Tab ---
        // Capture new page info
        const newPageUrl = newPage.url();
        const newPageTitle = await newPage.title();
        
        console.log(`Successfully switched to new tab.`);
        console.log(`New tab URL: ${newPageUrl}`);
        console.log(`New tab Title: ${newPageTitle}`);

        // Example Assertion: Validate the URL is expected to correspond to the clicked link
        expect(newPageUrl).toContain('qasummit.org');

        // You can now interact with the new page DOM if needed
        // e.g., await expect(newPage.locator('h1')).toBeVisible();

        // We can also verify we are still connected to the original page
        const mainPageTitle = await page.title();
        expect(mainPageTitle).toContain('Practice Page');
    });

});
