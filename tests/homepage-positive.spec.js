import { test, expect } from '../utils/fixtures.js';
import { BasePage } from '../pages/base-page.js';

test('home page loads with correct URL', async ({ page, logger }) => {
    logger.step('Navigation', 'Navigating to the HN homepage');
    const basePage = new BasePage(page);
    await basePage.goto();

    logger.step('Verification', 'Checking that the URL matches the BasePage URL');
    await expect(page).toHaveURL(basePage.url);
});

test('login link is visible when not logged in', async ({ page, logger }) => {
    logger.step('Navigation', 'Navigating to the HN homepage');
    const basePage = new BasePage(page);
    await basePage.goto();
    logger.step('Verification', 'Checking that the login link is visible');
    await expect(basePage.loginButton()).toBeVisible();
});

test('title is correct', async ({ page, logger }) => {
    logger.step('Navigation', 'Navigating to the HN homepage');
    const basePage = new BasePage(page);
    await basePage.goto();
    logger.step('Verification', 'Checking that the title is correct');
    const titleText = await basePage.getTitle();
    await expect(titleText).toContain('Hacker News');
})

test('login link takes me to login page', async ({ page, logger }) => {
    logger.step('Navigation', 'Navigating to the HN homepage');
    const basePage = new BasePage(page);
    await basePage.goto();
    logger.step('Navigation', 'Clicking login link');
    await basePage.loginButton().click();
    logger.step('Verification', 'Checking that we have moved to the login page');
})

