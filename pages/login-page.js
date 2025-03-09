export class LoginPage {
    constructor(page) {
        this.page = page;
        this.url = 'https://news.ycombinator.com/login';
        // Locate the login form by looking for the submit button with value "login"
        this.loginForm = this.page.locator('form:has(input[value="login"])');
    }

    async goto() {
        await this.page.goto(this.url);
    }

    // Add a getter to capture the error message after a failed login.
    get badLoginErrorMessage() {
        // This locator matches the text "Bad login." anywhere on the page.
        return this.page.locator('text=Bad login.');
    }

    get usernameField() {
        return this.loginForm.locator('input[name="acct"]');
    }

    get passwordField() {
        return this.loginForm.locator('input[name="pw"]');
    }

    get loginButton() {
        return this.loginForm.locator('input[type="submit"][value="login"]');
    }

    async login(username, password, logger) {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);

        // Click the login button and optionally wait for navigation if needed.
        await this.loginButton.click();

        // Wait for either a successful login (#me) or the error message ("Bad login.")
        const errorLocator = this.page.locator('text=Bad login.');
        const successLocator = this.page.locator('#me');

        // Wait up to 3 seconds for either outcome.
        try {
            await Promise.race([
                errorLocator.waitFor({ state: 'visible', timeout: 3000 }),
                successLocator.waitFor({ state: 'visible', timeout: 3000 })
            ]);
        } catch (e) {
            // Neither appeared within the timeout. You might want to log or handle this case.
        }

        // Check for rate limiting indicators
        const validationRequiredVisible = await this.page.locator('text=Validation required').isVisible();
        const tooManyRequestsVisible = await this.page.locator("text=Sorry, we're not able to serve your requests this quickly").isVisible();
        const recaptchaVisible = await this.page.locator('iframe[title="reCAPTCHA"]').isVisible();

        if (validationRequiredVisible || tooManyRequestsVisible || recaptchaVisible) {
            logger.warning("Rate limiting detected in login");
            logger.isRateLimited = true; // set flag so success messages are suppressed
            return 'rateLimited';
        }

        // If the error message is visible, return a flag indicating a bad login.
        if (await errorLocator.isVisible()) {
            return 'badLogin';
        }
        // Otherwise, assume login succeeded.
        return 'ok';
    }

    get createAccountForm() {
        return this.page.locator('form:has(input[value="create account"])');
    }

    get createAccountUsernameField() {
        return this.createAccountForm.locator('input[name="acct"]');
    }

    get createAccountPasswordField() {
        return this.createAccountForm.locator('input[name="pw"]');
    }

    get createAccountButton() {
        return this.createAccountForm.locator('input[type="submit"][value="create account"]');
    }

    async createAccount(username, password, logger) {
        await this.createAccountUsernameField.fill(username);
        await this.createAccountPasswordField.fill(password);
        // Wait for navigation or significant DOM update when clicking the create account button.
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 5000 }),
            this.createAccountButton.click()
        ]);
        // Check for rate limiting indicators:
        const validationRequiredVisible = await this.page.locator('text=Validation required').isVisible();
        const tooManyRequestsVisible = await this.page.locator("text=Sorry, we're not able to serve your requests this quickly").isVisible();
        const recaptchaVisible = await this.page.locator('iframe[title="reCAPTCHA"]').isVisible();

        if (validationRequiredVisible || tooManyRequestsVisible || recaptchaVisible) {
            logger.warning("Rate limiting detected in createAccount");
            logger.isRateLimited = true;
            return 'rateLimited';
        }

        // Otherwise, assume account creation succeeded.
        return 'ok';
    }


    async waitForLoad() {
        await this.loginForm.waitFor();
    }
}
