import { test, expect } from '../fixtures/fixtures';
import { MarketName, markets } from '../../config/markets';
import { getDefaultProductSelector, getDefaultProductName } from '../../utils/helpers';
import {
   checkAmountOfItemsOnMiniCartIcon,
   checkAmountOfItemsInMiniCart
} from '../../utils/validators';


test('TC1: Verify if it is possible to add a product to the cart.', async ({ homePage, shopPage, productPage, marketName }) => {
   const getExpectedTitle = (marketName: MarketName): string => {
      return markets[marketName].siteContent.homePageTitle;
   };

   await homePage.navigate();
   await homePage.handleModals();

   const title = await homePage.getTitle();
   expect(title).toBe(getExpectedTitle(marketName));

   await homePage.navigateToShop();

   await shopPage.resetState();
   await shopPage.openProductPage(getDefaultProductSelector(marketName));

   await productPage.addProductToCart();
   await checkAmountOfItemsOnMiniCartIcon(productPage, 1);
   await checkAmountOfItemsInMiniCart(productPage, 1);
   expect(await productPage.isItemInMiniCart(getDefaultProductName(marketName))).toBe(true);
});
