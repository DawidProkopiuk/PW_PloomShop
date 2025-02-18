import { test, expect } from '../fixtures/fixtures';
import { getDefaultProductSelector } from '../../utils/helpers';
import { validateLinks, validateImages } from '../../utils/validators';

test('TC3: Verify if there are any broken links or images on the product page.', async ({ page, homePage, shopPage, productPage, marketName }) => {
   await homePage.navigate();
   await homePage.handleModals();
   await homePage.navigateToShop();

   await shopPage.resetState();
   await shopPage.openProductPage(getDefaultProductSelector(marketName));

   //We need to ensure everything we needed is loaded, but we want to avoid using 'networkidle'
   await productPage.waitForScriptLoad('js_includes_sp_tinymce');

   const links = await productPage.getAllLinksFromPage();
   expect.soft(links.length, "At least one valid link should be present on the page.").toBeGreaterThan(0);
   await validateLinks(page, links);

   const images = await productPage.getAllImageSourcesFromPage();
   expect.soft(images.length, "At least one valid image should be present on the page.").toBeGreaterThan(0);
   await validateImages(page, images);

   expect(test.info().errors).toHaveLength(0);
});
