import { test, expect } from '../utils/fixtures.js';

// I left this in just to use it to test the coloured strings but figured why not just leave it here.

test('has title', async ({ page, logger }) => {
  await page.goto('https://playwright.dev/');

  logger.step('Verification', 'Checking for page title');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page, logger }) => {
  logger.step('Navigation', 'Starting get started test');
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  logger.step('Interaction', 'Clicking get started link');
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  logger.step('Verification', 'Checking for Installation heading');
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
