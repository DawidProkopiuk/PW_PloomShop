import { Page, expect, APIResponse } from "@playwright/test";
import { BasePage } from "../pages/base.page";

export async function checkAmountOfItemsOnMiniCartIcon(page: BasePage, expectedItemsAmount: number) {
   await expect.poll(async () => {
      return await page.getAmountOfItemsOnMiniCartIcon();
    }, {
      message: `The value of items in mini cart is not '${expectedItemsAmount}' or timeout exceeded.`,
      intervals: [2_000, 500],
      timeout: 15_000}
   ).toBe(expectedItemsAmount);
}

export async function checkAmountOfItemsInMiniCart(page: BasePage, expectedItemsAmount: number) {
   await expect.poll(async () => {
      return await page.getAmountOfItemsInMiniCart();
    }, {
      message: `The value of items in mini cart is not '${expectedItemsAmount}' or timeout exceeded.`,
      intervals: [2_000, 500],
      timeout: 15_000}
   ).toBe(expectedItemsAmount);
}

export async function checkIfItemIsPresentInMiniCart(page: BasePage, itemName: string) {
   return await checkItemInMiniCart(page, itemName, 'The item is absent from mini cart or timeout exceeded.');
}

export async function checkIfItemIsAbsentFromMiniCart(page: BasePage, itemName: string) {
   return await checkItemInMiniCart(page, itemName, 'The item is present in mini cart or timeout exceeded.', false);
}

async function checkItemInMiniCart(page: BasePage, itemName: string, errorMessage: string, shouldBePresentInMiniCart: boolean = true) {
   await expect.poll(async () => {
      return await page.isItemInMiniCart(itemName);
    }, {
      message: errorMessage,
      intervals: [2_000, 500],
      timeout: 15_000}
   ).toBe(shouldBePresentInMiniCart);
}

export async function validateLinks(page: Page, links: string[]) {
   const uniqueLinks: Set<string> = new Set(links);
   const baseUrl = await page.url();

   for (const link of uniqueLinks) {
      try {
         const absoluteUrl = new URL(link, baseUrl).href;
         
         if (!absoluteUrl.startsWith("http://") && !absoluteUrl.startsWith("https://")) {
            console.warn(`Skipping non-HTTP link: ${absoluteUrl}`);
            continue;
         }

         console.log(`Checking link: ${absoluteUrl}`);
         const response: APIResponse = await page.request.get(absoluteUrl);

         expect.soft(response, `Broken link detected: ${absoluteUrl}`).toBeOK();
      } catch (error) {
         console.error(`Error encountered during links validation: '${error}'`);
      }
   }
}

export async function validateImages(page: Page, images: string[]) {
   const uniqueImages: Set<string> = new Set(images);
   const baseUrl = await page.url();
 
   for (const src of uniqueImages) {
      try {
         console.log(`Checking src: ${src}`);
         const absoluteUrl = new URL(src, baseUrl).href;
         
         const imgLocator = `img[src="${src}"]:not([loading="lazy"])`;
         const imgElement = page.locator(imgLocator).first();

         if (!(await imgElement.count())) {
            console.log(`Image not found in DOM: ${src}`);
            continue;
         }

         const response: APIResponse = await page.request.get(absoluteUrl);
         expect.soft(response.ok(), `Broken image detected: ${absoluteUrl}`).toBeTruthy();

         const imgHandle = await imgElement.elementHandle();
         if (!imgHandle) {
            throw new Error(`Unable to get element handle for image: ${absoluteUrl}`);
         }

         const [naturalWidthHandle, naturalHeightHandle] = await Promise.all([
            imgHandle.getProperty('naturalWidth'),
            imgHandle.getProperty('naturalHeight')
         ]);
   
         const [naturalWidth, naturalHeight] = await Promise.all([
            naturalWidthHandle.jsonValue(),
            naturalHeightHandle.jsonValue()
         ]);

         await naturalWidthHandle.dispose();
         await naturalHeightHandle.dispose();
         await imgHandle.dispose();
   
         const isImageBroken = naturalWidth === 0 || naturalHeight === 0;
         expect.soft(!isImageBroken, `Broken image detected (natural size 0): ${absoluteUrl}`).toBeTruthy();
      } catch (error) {
         console.error(`Error encountered during images validation: '${error}'`);
      }
   }
}