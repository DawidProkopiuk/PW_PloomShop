export type MarketName = 'uk' | 'pl';

export type MarketData = {
   baseURL: string;
   locators: {
      shopSelector: string;
      defaultProductSelector: string;
   };
   siteContent: {
      homePageTitle: string;
      defaultProductName: string;
   }
};

export const markets: Record<MarketName, MarketData> = {
   uk: {
      baseURL: 'https://www.ploom.co.uk/en',
      locators: {
         shopSelector: '[data-testid="headerItem-0"]',
         defaultProductSelector: '[data-sku="ploom-x-advanced"]'
      },
      siteContent: {
         homePageTitle: 'Ploom UK: Buy Heated Tobacco Products, Devices and Kits',
         defaultProductName: 'Ploom X Advance Rose Shimmer Limited Edition'
      }
   },
   pl: {
      baseURL: 'https://www.ploom.pl/pl',
      locators: {
         shopSelector: '[data-testid="headerItem-1"]',
         defaultProductSelector: '[data-sku="15108712"]'
      },
      siteContent: {
         homePageTitle: 'Nowość na rynku! Podgrzewacz tytoniu Ploom',
         defaultProductName: 'Ploom X Advanced srebrny'
      }
   }
};