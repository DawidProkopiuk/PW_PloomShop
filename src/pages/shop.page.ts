import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { MarketData } from '../config/markets';

export class ShopPage extends BasePage {
   constructor(page: Page, marketData: MarketData) {
      super(page, marketData);
   }

   async openProductPage(productSelector: string) {
      await this.page.locator(productSelector).click();
   }
}