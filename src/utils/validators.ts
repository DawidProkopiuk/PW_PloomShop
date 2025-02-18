import { Page, expect, APIResponse, Locator } from '@playwright/test';
import { BasePage } from '../pages/base.page';

interface ImageDimensions {
   width: number;
   height: number;
}

async function getImageDimensions(image: Locator): Promise<ImageDimensions> {
   const imgHandle = await image.elementHandle();
   if (!imgHandle) {
      throw new Error(`Unable to get element handle for the image!`);
   }

   const [naturalWidthHandle, naturalHeightHandle] = await Promise.all([
      imgHandle.getProperty('naturalWidth'),
      imgHandle.getProperty('naturalHeight')
   ]);

   const [naturalWidth, naturalHeight] = await Promise.all([
      naturalWidthHandle.jsonValue() as Promise<number>,
      naturalHeightHandle.jsonValue() as Promise<number>
   ]);

   await imgHandle.dispose();

   return { width: naturalWidth, height: naturalHeight };
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
      timeout: 15_000
   }).toBe(shouldBePresentInMiniCart);
}

export async function validateLinks(page: Page, links: string[]) {
   const uniqueLinks: Set<string> = new Set(links);
   const baseUrl = page.url();

   await Promise.all([...uniqueLinks].map(async (link) => {
      try {
         const absoluteUrl = new URL(link, baseUrl).href;
         
         if (!absoluteUrl.startsWith("http://") && !absoluteUrl.startsWith("https://")) {
            console.warn(`Skipping non-HTTP link: ${absoluteUrl}`);
            return;
         }

         console.log(`Checking link: ${absoluteUrl}`);
         const response: APIResponse = await page.request.get(absoluteUrl);
         await expect.soft(response, `Broken link detected: ${absoluteUrl}`).toBeOK();
      } catch (error) {
         expect.soft(false, `Unexpected error during API response validation for ${link}: ${error}`).toBeTruthy();
      }
   }));
}

export async function validateImages(page: Page, images: string[], checkHiddenImages: boolean = true) {
   const uniqueImages: Set<string> = new Set(images);
   const baseUrl = page.url();

   //Check URLs
   await Promise.all([...uniqueImages].map(async (src) => {
      try {
         const absoluteUrl = new URL(src, baseUrl).href;
         console.log(`Checking API response for: ${absoluteUrl}`);

         const response: APIResponse = await page.request.get(absoluteUrl);
         await expect.soft(response, `Response should be OK, got (${response.status()}) for ${absoluteUrl}`).toBeOK();
      } catch (error) {
         expect.soft(false, `Unexpected error during API response validation for ${src}: ${error}`).toBeTruthy();
      }
   }));

   //Check sizes
   for (const src of images) {
      try {
         console.log(`Checking image: ${src}`);

         const imgElements = page.locator(`img[src="${src}"]`);
         const elements = await imgElements.all();

         for (const imgElement of elements) {
            const isLazyLoaded = await imgElement.getAttribute('loading') === 'lazy';
            if (isLazyLoaded) {
               console.log('Image is lazy-loaded. Scrolling into view...');
               await imgElement.scrollIntoViewIfNeeded({ timeout: 5000 });
            }

            const isVisible = await imgElement.isVisible({ timeout: 5000 });
            if (!isVisible) {
               console.warn(`Hidden Image: ${src}`);
               if (!checkHiddenImages) continue;
            }

            await expect(imgElement).toHaveJSProperty('complete', true);

            const imageDimensions = await getImageDimensions(imgElement);
            const isImageBroken = imageDimensions.width === 0 || imageDimensions.height === 0;
            expect.soft(!isImageBroken, `Image dimensions for ${src} should be higher than 0. Width: ${imageDimensions.width}, Height: ${imageDimensions.height}`).toBeTruthy();
            console.log(`Image dimensions for ${src} should be higher than 0. Width: ${imageDimensions.width}, Height: ${imageDimensions.height}`);
         }
      } catch (error) {
         expect.soft(false, `Unexpected error during validation of image size! Error: ${error}`).toBeTruthy();
      }
   }
}