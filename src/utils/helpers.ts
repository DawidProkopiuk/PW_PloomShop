import { MarketName, markets } from "../config/markets";

export function getDefaultProductSelector(marketName: MarketName): string {
   return markets[marketName].locators.defaultProductSelector;
}

export function getDefaultProductName(marketName: MarketName): string {
   return markets[marketName].siteContent.defaultProductName;
}

export function extractNumberFromString(input: string | null): number {
   if (!input) return NaN;

   const numbers = input.replace(/\D/g, '');
   return numbers ? parseInt(numbers, 10) : NaN;
}