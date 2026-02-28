# Playwright UI Automation - Sauce Demo

A robust and scalable automated UI testing suite for the [Sauce Demo](https://www.saucedemo.com/) web application. Built using [Playwright](https://playwright.dev/) and JavaScript, this project follows the **Page Object Model (POM)** design pattern ensuring high maintainability and code reusability.

## 🚀 Key Features

*   **Page Object Model (POM) Architecture:** Clean separation of UI locators/methods from the test cases.
*   **Comprehensive Test Coverage:** 
    *   Authentication (Valid logins, locked-out users, invalid passwords)
    *   Inventory Sorting (Price Low-to-High, High-to-Low)
    *   Add to Cart (Single items, multiple items, persistent cart testing)
    *   Checkout Validation (Successful purchases, empty field validations)
    *   Logout Flows
*   **Cross-Browser Testing:** Configured to run tests across Desktop Chromium, Firefox, and Safari (WebKit).
*   **Robustness:** Built-in automatic retries (`retries: 2`) for handling flaky tests.
*   **Built-in Logger:** Custom logging utilities for tracking test execution steps.
*   **Reporting:** Automatically generates beautiful HTML reports for test runs (`reporter: 'html'`).

## 📁 Project Structure

```text
├── pages/                  # Page Object classes (LoginPage, InventoryPage, CartPage, CheckoutPage)
├── tests/                  # Playwright specification files (sauce_demo.spec.js)
├── utils/                  # Utility functions and custom Custom Logger
├── playwright.config.js    # Global Playwright configuration
├── package.json            # Node.js dependencies and scripts
└── playwright-report/      # Generated HTML reports (after test execution)
```

## 🛠️ Prerequisites

*   [Node.js](https://nodejs.org/en/) (v16 or higher)
*   npm (comes with Node.js)

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Tharun-29/playwright-automation.git
    cd playwright-automation
    ```

2.  Install NPM dependencies:
    ```bash
    npm install
    ```

3.  Install Playwright browsers:
    ```bash
    npx playwright install
    ```

## 🏃‍♂️ Running the Tests

You can execute the tests using the predefined npm scripts.

**Run tests in headless mode (default):**
```bash
npm run test
```

**Run tests in UI mode (interactive execution with time-travel debugging):**
```bash
npm run test:ui
```

**Run tests in debug mode:**
```bash
npm run test:debug
```

## 📊 Viewing Test Reports

After a test run completes, an HTML report is automatically compiled. By default, Playwright will attempt to open it if there's a failure. You can manually view it using:

```bash
npx playwright show-report
```

## 📝 License

This project is licensed under the ISC License.
