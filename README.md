# Playwright TypeScript E2E Testing Project

## Introduction

This project is a Playwright automation suite written in TypeScript, designed to demonstrate best practices in end-to-end testing. It focuses on scalability, maintainability, and cross-market adaptability, making it easy to extend tests to new country-specific websites.

## Project Overview

The main objective of this project is to design tests that can be easily extended to new markets. For this task, the tests cover the following shops:

[Ploom UK](https://www.ploom.co.uk/en)

[Ploom PL](https://www.ploom.pl/pl)

## Technologies Used

Playwright

TypeScript

## Setup Instructions

npm install

## Running Tests

npx playwright test

## Customization & Scalability

To add a new market, update markets.ts with the relevant data.

Modify playwright.config.ts to include additional markets or browser environments.

## Test Cases

### Test Case 1: Verify if it is possible to add a product to the cart.

Visit the Ploom website: Ploom Website: Buy Heated Tobacco Products, Devices and Kits.

Click on "Shop".

Open the product page by SKU (use'ploom-x-advanced' as an example).

Add the product to the cart.

Check your cart count.

Open the cart.

Check if the product is in the cart.

---

### Test Case 2: Verify if it is possible to remove a product from the cart.

#### Precondition: A product is already in the cart.

Open the cart.

Remove the product from the cart.

Verify that the product is no longer in the cart.

Check if the basket count is updated correctly.

---

### Test Case 3: Verify if there are any broken links or images on the product page.

Visit the Ploom website.

Click on "Shop".

Open the product page using SKU (ploom-x-advanced).

Validate all links are not broken.

Verify all images load correctly.

## Additional Notes

Test Case 3 may occasionally fail due to actual broken links or images on the website, an issue that has occurred at least once before.