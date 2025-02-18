import { Locator, Page } from '@playwright/test';
import { extractNumberFromString } from '../utils/helpers';

export class TopMenu {
   private readonly page: Page;
   private readonly shopLocator: Locator;
   private readonly miniCartIconLocator: Locator;
   private readonly miniCartIconCounter: Locator;
   private readonly miniCartCounter: Locator;
   private readonly productNamesInCart: Locator;

   constructor(page: Page, shopSelector: string) {
      this.page = page;
      this.shopLocator = page.locator(shopSelector);
      this.miniCartIconLocator = page.getByTestId('cartIcon');
      this.miniCartIconCounter = page.locator('[class*="CartMiniContentContainer-module-iconLabel"]');
      this.miniCartCounter = page.locator('[class*="CartMiniHeader-module-count"]');
      this.productNamesInCart = page.getByTestId('mini-cart-list').locator('strong.ProductMiniature-module-productName-JRifI');
   }

   async openShop() {
      await this.shopLocator.click();
   }

   async hoverOverMiniCartIcon() {
      await this.hoverOverMenuElement(this.miniCartIconLocator);
   }

   async getMiniCartIconCounter(): Promise<number> {
      if ((await this.miniCartIconCounter.count()) === 0) {
         return 0;
      }

      const itemsCounter = await this.miniCartIconCounter.textContent();
      return parseInt(itemsCounter || '0', 10);
   }

   async getMiniCartItemsAmount(): Promise<number> {
      const itemsAmountText = await this.miniCartCounter.textContent();
      return extractNumberFromString(itemsAmountText);
   }

   async isItemInMiniCart(itemName: string): Promise<boolean> {
      const productNames = await this.productNamesInCart.allTextContents();
      return productNames.includes(itemName);
   }

   async waitForMiniCartListToRefresh() {
      await this.page.locator('[data-testid="mini-cart-list"]').waitFor({ state: 'visible' });
   }

   async removeItemFromMiniCart(itemName: string) {
      const cartItems = await this.page.locator('[data-testid="mini-cart-list"] > div').all();

      for (const item of cartItems) {
         const nameElement = item.locator('strong.ProductMiniature-module-productName-JRifI');

         const text = await nameElement.innerText();
         if (text.includes(itemName)) {
            await item.locator('[data-testid="cartRemoveButton"]').click();
            await this.waitForMiniCartListToRefresh();
            break;
         }
      }
   }

   private async hoverOverMenuElement(locatorToHover: Locator) {
      const logoContainer = locatorToHover.first();
      await logoContainer.hover();
   }
}