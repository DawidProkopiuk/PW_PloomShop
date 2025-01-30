import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { MarketData } from '../config/markets';

export class ProductPage extends BasePage {
   private readonly addToCartButton: Locator;

   constructor(page: Page, marketData: MarketData) {
      super(page, marketData);

      this.addToCartButton = page.locator('[data-testid="pdpAddToProduct"]');
   }

   async addProductToCart() {
      await this.addToCartButton.click();
      await this.waitForMiniCartListToRefresh();
   }
}