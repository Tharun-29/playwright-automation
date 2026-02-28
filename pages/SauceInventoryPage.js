const { BasePage } = require('./BasePage');

class SauceInventoryPage extends BasePage {
    constructor(page) {
        super(page);
        this.headerTitle = page.locator('.title');
        this.shoppingCart = page.locator('.shopping_cart_link');
        this.inventoryItems = page.locator('.inventory_item');
        this.burgerMenu = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.sortDropdown = page.locator('.product_sort_container');
    }

    async getInventoryItems() {
        return await this.inventoryItems.evaluateAll((items) => {
            return items.map(item => {
                return {
                    name: item.querySelector('.inventory_item_name').innerText,
                    description: item.querySelector('.inventory_item_desc').innerText,
                    price: item.querySelector('.inventory_item_price').innerText
                };
            });
        });
    }

    async addItemToCart(name) {
        const item = this.inventoryItems.filter({ hasText: name });
        await item.locator('button').click();
    }

    async openCart() {
        await this.shoppingCart.click();
    }
    async logout() {
        await this.burgerMenu.click();
        await this.logoutLink.click();
    }

    async sortBy(option) {
        await this.sortDropdown.selectOption(option);
    }
}
module.exports = { SauceInventoryPage };
