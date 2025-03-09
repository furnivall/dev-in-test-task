import { test, expect } from '../utils/fixtures.js';
import { LoginPage } from '../pages/login-page.js';
import {generateUniqueUsername, generateUniqueUsernameThatFails} from "../utils/test-helper.js";

test('Create account with excessively long username should show error', async ({ page, logger }) => {
    logger.step('Setup', 'Generating an invalid username that breaks the length constraints');
    const invalidUsername = generateUniqueUsernameThatFails()

    logger.step('Navigation', 'Navigating to the login page');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.createAccountForm).toBeVisible();

    logger.step('Action', 'Attempting to create an account with invalid long username');
    const createAccountResult = await loginPage.createAccount(invalidUsername, 'password123', logger);
    if (createAccountResult === 'rateLimited') {
        logger.warning("Test skipped due to rate limiting");
        // Return early so the test passes without further assertions.
        return;
    }
    logger.step('Verification', 'Ensuring the appropriate error message is visible');
    await expect(
        page.locator('text=Usernames can only contain letters, digits, dashes and underscores')
    ).toBeVisible();
});

test('Create account with unique username', async ({ page, logger }) => {
    logger.step('Generate unique username', 'Generating a unique username using uuid');
    const uniqueUsername = generateUniqueUsername();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.createAccountForm).toBeVisible();
    const createAccountResult = await loginPage.createAccount(uniqueUsername, process.env.DEFAULT_PASSWORD, logger);
    if (createAccountResult === 'rateLimited') {
        logger.warning("Test skipped due to rate limiting");
        // Return early so the test passes without further assertions.
        return;
    }
    // After account creation, check that the user is logged in by verifying a welcome message or logout button
    logger.step('Verification', 'Checking that the user is logged in after account creation');
    await expect(page.locator('text=Logout')).toBeVisible();
    await expect(page).toHaveURL('https://news.ycombinator.com/');
});
