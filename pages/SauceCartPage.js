const { BasePage } = require('./BasePage');

class SauceCartPage extends BasePage {
    constructor(page) {
        super(page);
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('#checkout');
    }

    async getCartItems() {
        return await this.cartItems.allTextContents();
    }

    async checkout() {
        await this.checkoutButton.click();
    }
}
module.exports = { SauceCartPage };
