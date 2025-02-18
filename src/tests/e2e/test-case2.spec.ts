import { test, expect } from '../fixtures/fixtures';
import { getDefaultProductSelector, getDefaultProductName } from '../../utils/helpers';
import {
   checkIfItemIsAbsentFromMiniCart
} from '../../utils/validators';

test.beforeEach('Setup: A product is already in the cart.', async ({ homePage, shopPage, productPage, marketName}) => {
   await homePage.navigate();
   await homePage.handleModals();

   await homePage.navigateToShop();

   await shopPage.resetState();
   await shopPage.openProductPage(getDefaultProductSelector(marketName));
   await productPage.addProductToCart();
});

test('TC2: Verify if it is possible to remove a product from the cart.', async ({ productPage, marketName }) => {
   await productPage.removeItemFromMiniCart(getDefaultProductName(marketName));
   await checkIfItemIsAbsentFromMiniCart(productPage, getDefaultProductName(marketName));
   expect(await productPage.getAmountOfItemsOnMiniCartIcon()).toBe(0);
   expect(await productPage.getAmountOfItemsInMiniCart()).toBe(0);
});