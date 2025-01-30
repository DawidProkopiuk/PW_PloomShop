import { test, expect } from '../fixtures/fixtures';
import { getDefaultProductSelector } from '../../utils/helpers';
import { validateLinks, validateImages } from '../../utils/validators';

test('TC3: Verify if there are any broken links or images on the product page.', async ({ page, homePage, shopPage, productPage, marketName }) => {
   await homePage.navigate();
   await homePage.handleModals();
   await homePage.navigateToShop();

   await shopPage.resetState();
   await shopPage.openProductPage(getDefaultProductSelector(marketName));

   const images = await productPage.getAllImageSourcesFromPage();
   expect.soft(images.length, "No valid images found on the page!").toBeGreaterThan(0);
   await validateImages(page, images);

   const links = await productPage.getAllLinksFromPage();
   expect.soft(links.length, "No valid links found on the page!").toBeGreaterThan(0);
   await validateLinks(page, links);

   expect(test.info().errors).toHaveLength(0);
});
