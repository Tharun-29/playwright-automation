import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SauceLoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async login(username: string, pass: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
    }
}
