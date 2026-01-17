const { BasePage } = require('./BasePage');

class SauceCheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        this.firstNameInput = page.locator('#first-name');
        this.lastNameInput = page.locator('#last-name');
        this.zipCodeInput = page.locator('#postal-code');
        this.continueButton = page.locator('#continue');
        this.finishButton = page.locator('#finish');
        this.completeHeader = page.locator('.complete-header');
    }

    async fillInformation(firstName, lastName, zip) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipCodeInput.fill(zip);
        await this.continueButton.click();
    }

    async finish() {
        await this.finishButton.click();
    }

    async getOrderConfirmation() {
        return await this.completeHeader.innerText();
    }
}
module.exports = { SauceCheckoutPage };
