import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { MarketData } from '../config/markets';

export class HomePage extends BasePage {
   constructor(page: Page, marketData: MarketData) {
      super(page, marketData);
   }
}