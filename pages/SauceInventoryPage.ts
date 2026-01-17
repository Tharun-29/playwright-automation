import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SauceInventoryPage extends BasePage {
    readonly headerTitle: Locator;
    readonly shoppingCart: Locator;
    readonly inventoryItems: Locator;

    constructor(page: Page) {
        super(page);
        this.headerTitle = page.locator('.title');
        this.shoppingCart = page.locator('.shopping_cart_link');
        this.inventoryItems = page.locator('.inventory_item');
    }
}
