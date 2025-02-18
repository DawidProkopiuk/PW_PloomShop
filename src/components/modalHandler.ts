import { Page, Locator } from '@playwright/test';

export class ModalHandler {
   private cookieConsentButton: Locator;
   private ageConfirmationButton: Locator;

   constructor(page: Page) {
      this.cookieConsentButton = page.locator('#onetrust-accept-btn-handler');
      this.ageConfirmationButton = page.locator('.ageconfirmation__confirmBtn').getByTestId('customButton');
   }

   async acceptCookies() {
      try {
         await this.cookieConsentButton.waitFor();
         await this.cookieConsentButton.click();
      } catch {
         console.log('Cookie consent modal not found or already accepted.');
      }
   }

   async confirmAge() {
      try {
         await this.ageConfirmationButton.waitFor();
         await this.ageConfirmationButton.click();
      } catch {
         console.log('Age confirmation modal not found or already confirmed.');
      }
   }

   async acceptAllModals() {
      await this.acceptCookies();
      await this.confirmAge();
   }
}