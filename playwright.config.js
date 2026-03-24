const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 40 * 1000,
    expect: {
        timeout: 40 * 1000,
    },
    reporter: 'html',
    retries: 2,
    use: {
        browserName: 'chromium',
        headless: false,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],
});
