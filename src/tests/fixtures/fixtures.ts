import { test as baseTest } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { ShopPage } from '../../pages/shop.page';
import { ProductPage } from '../../pages/product.page';
import { MarketName, markets } from '../../config/markets';

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