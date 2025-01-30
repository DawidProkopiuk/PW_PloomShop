import { Page } from '@playwright/test';
import { TopMenu } from '../components/topMenu';
import { ModalHandler } from '../components/modalHandler';
import { MarketData } from '../config/markets';

export class BasePage {
   protected readonly page: Page;
   private readonly topMenu: TopMenu;
   private readonly baseUrl: string;
   private readonly modalHandler: ModalHandler;

   constructor(page: Page, marketData: MarketData) {
      this.page = page;
      this.baseUrl = marketData.baseURL;
      this.topMenu = new TopMenu(page, marketData.locators.shopSelector);
      this.modalHandler = new ModalHandler(page);
   }

   async navigate() {
      await this.page.goto(this.baseUrl);
   }

   async navigateToShop() {
      await this.topMenu.openShop();
   }

   async handleModals() {
      await this.modalHandler.acceptAllModals();
   }

   async getTitle(): Promise<string> {
      return this.page.title();
   }

   async getAmountOfItemsOnMiniCartIcon() {
      return await this.topMenu.getMiniCartIconCounter();
   }

   async getAmountOfItemsInMiniCart() {
      return await this.topMenu.getMiniCartItemsAmount();
   }

   async isItemInMiniCart(itemName: string) : Promise<boolean> {
      return await this.topMenu.isItemInMiniCart(itemName);
   }

   async removeItemFromMiniCart(itemName: string) {
      await this.topMenu.removeItemFromMiniCart(itemName);
   }

   async waitForMiniCartListToRefresh() {
      await this.topMenu.waitForMiniCartListToRefresh();
   }

   //Sometimes needed to collapse expanded menus etc.
   async resetState() {
      await this.topMenu.hoverOverMiniCartIcon();
   }

   async getAllLinksFromPage(): Promise<string[]> {
      const hrefs = await this.getAttributesFromElements("a", "href");
      return hrefs.filter((href): href is string => href !== null && href !== undefined);
   }

   async getAllImageSourcesFromPage(): Promise<string[]> {
      const srcs = await this.getAttributesFromElements("img", "src");
      return srcs.filter((src): src is string => src !== null && src !== undefined && src.trim() !== "");
   }

   private async getAttributesFromElements(selector: string, attribute: string): Promise<(string | null)[]> {
      const elements = this.page.locator(selector);
      const allElements = await elements.all();

      return Promise.all(allElements.map((el) => el.getAttribute(attribute)));
   }
}