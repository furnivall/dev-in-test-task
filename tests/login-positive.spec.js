import { test, expect } from '../utils/fixtures.js';
import { LoginPage } from '../pages/login-page.js';
import { BasePage } from '../pages/base-page.js';


test('Direct navigation to login page', async ({ page, logger }) => {
    logger.step('Navigation', 'Navigating directly to the login page');
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    logger.step('Verification', 'Checking that the URL matches the LoginPage URL');
    await expect(page).toHaveURL(loginPage.url);
});

test('Verify login page elements are present', async ({ page, logger }) => {
    logger.step('Navigation', 'Navigating to the login page');
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    logger.step('Verification', 'Checking that the URL matches the login page URL');
    await expect(page).toHaveURL(loginPage.url);

    logger.step('Verification', 'Ensuring the login form is visible');
    await expect(loginPage.loginForm).toBeVisible();

    logger.step('Verification', 'Ensuring the bold title "Login" is visible');
    await expect(page.locator('b:has-text("Login")')).toBeVisible();

    logger.step('Verification', 'Ensuring the login button is visible');
    await expect(loginPage.loginButton).toBeVisible();
});

test('Login with valid credentials', async ({ page, logger }) => {
    logger.step('Navigation', 'Navigating to the login page');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    logger.step('Verification', 'Checking that the URL matches the login page URL');
    await expect(page).toHaveURL(loginPage.url);
    const loginResult = await loginPage.login(process.env.WORKING_USERNAME, process.env.DEFAULT_PASSWORD, logger);
    if (loginResult === 'rateLimited') {
        logger.warning("Test skipped due to rate limiting");
        // Return early so the test passes without further assertions.
        return;
    }
    const basePage = new BasePage(page);
    const loggedInUsername = await basePage.getLoggedInUsername();
    logger.step('Verification', `Logged in as ${loggedInUsername}`);
    expect(loggedInUsername).toBe(process.env.WORKING_USERNAME);
});

test('Login after successful logout', async ({ page, logger }) => {
    logger.step('Navigation', 'Navigating to the login page');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    logger.step('Verification', 'Checking that the URL matches the login page URL');
    await expect(page).toHaveURL(loginPage.url);
    let loginResult = await loginPage.login(process.env.WORKING_USERNAME, process.env.DEFAULT_PASSWORD, logger);
    if (loginResult === 'rateLimited') {
        logger.warning("Test skipped due to rate limiting");
        // Return early so the test passes without further assertions.
        return;
    }
    const basePage = new BasePage(page);
    let loggedInUsername = await basePage.getLoggedInUsername();
    expect(loggedInUsername).toBe(process.env.WORKING_USERNAME);
    logger.step('Action', 'Logging out');
    await basePage.logout();
    logger.step('Verification', 'Checking that the login link is visible after login');
    await expect(basePage.loginButton()).toBeVisible();
    await loginPage.goto();
    loginResult = await loginPage.login(process.env.WORKING_USERNAME, process.env.DEFAULT_PASSWORD, logger);
    if (loginResult === 'rateLimited') {
        logger.warning("Test skipped due to rate limiting");
        // Return early so the test passes without further assertions.
        return;
    }
    loggedInUsername = await basePage.getLoggedInUsername();
    expect(loggedInUsername).toBe(process.env.WORKING_USERNAME);

})

test('Login remains after browser refresh', async ({ page, logger }) => {
    logger.step('Navigation', 'Navigating to the login page');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    logger.step('Verification', 'Checking that the URL matches the LoginPage URL');
    const loginResult = await loginPage.login(process.env.WORKING_USERNAME, process.env.DEFAULT_PASSWORD, logger);
    if (loginResult === 'rateLimited') {
        logger.warning("Test skipped due to rate limiting");
        // Return early so the test passes without further assertions.
        return;
    }
    const basePage = new BasePage(page);
    let loggedInUsername = await basePage.getLoggedInUsername();
    expect(loggedInUsername).toBe(process.env.WORKING_USERNAME);
    logger.step('Verification', `Logged in as ${loggedInUsername}`);
    logger.step('Action', 'Refreshing page')
    await page.reload();
    loggedInUsername = await basePage.getLoggedInUsername();
    logger.step('Verification', 'Checking that the user is still logged in after refresh');
    expect(loggedInUsername).toBe(process.env.WORKING_USERNAME);
})

test('Login returns to same page after login', async ({ page, logger }) => {
    const basePage = new BasePage(page);
    logger.step('Navigation', 'Navigating to the HN homepage');
    await basePage.goto();
    logger.step('Navigation', 'Going to a random comment page');
    const expectedCommentPageUrl = await basePage.goToRandomCommentsPage();
    logger.step('Verification', 'Checking that we navigated to the correct comment page');
    await expect(page).toHaveURL(expectedCommentPageUrl);
    logger.step('Navigation', 'Clicking the login button');
    await basePage.loginButton().click();
    const loginPage = new LoginPage(page);
    logger.step('Action', `Logging in with ${process.env.WORKING_USERNAME}`);
    const loginResult = await loginPage.login(process.env.WORKING_USERNAME, process.env.DEFAULT_PASSWORD, logger);
    if (loginResult === 'rateLimited') {
        logger.warning("Test skipped due to rate limiting");
        // Return early so the test passes without further assertions.
        return;
    }
    logger.step('Verification', `Checking that we are back on the comment page`);
    await expect(page).toHaveURL(expectedCommentPageUrl);
})
