import { test as baseTest } from '@playwright/test';
import { HomePage } from '../../pages/home.page.ts';
import { ShopPage } from '../../pages/shop.page.ts';
import { ProductPage } from '../../pages/product.page.ts';
import { MarketName, markets } from '../../config/markets.ts';

export type Fixtures = {
   homePage: HomePage;
   shopPage: ShopPage;
   productPage: ProductPage;
   marketName: MarketName;
};

export const test = baseTest.extend<Fixtures>({
   marketName: [
      'uk',
      {
         option: true
      },
   ],
   homePage: async ({ page, marketName }, use) => {
      await use(new HomePage(page, markets[marketName]));
   },
   shopPage: async ({ page, marketName }, use) => {
      await use(new ShopPage(page, markets[marketName]));
   },
   productPage: async ({ page, marketName }, use) => {
      await use(new ProductPage(page, markets[marketName]));
   }
});

export { expect } from '@playwright/test';