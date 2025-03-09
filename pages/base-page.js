export class BasePage {
    constructor(page) {
        this.page = page;
        this.url = 'https://news.ycombinator.com/';
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async logout() {
        const logoutButton = await this.page.$('#logout');
        if (logoutButton) {
            await this.page.click('#logout');
        }
    }

    async getTitle() {
        return this.page.title();
    }

    loginButton() {
        // using the accessible name for the login link
        return this.page.getByRole('link', { name: 'login' });
    }

    async login() {
        await this.page.getByRole('link', { name: 'login' }).click();
    }

    async getLoggedInUsername() {
        const meLocator = this.page.locator('#me');
        const isVisible = await meLocator.isVisible();
        if (isVisible) {
            return meLocator.innerText();
        }
        return null;
    }

    async goToRandomCommentsPage() {
        await this.waitForLoad();
        const commentLinks = this.page.locator('a[href^="item?id="]:has-text("comments")');
        const count = await commentLinks.count();
        if (count === 0) {
            throw new Error('No comment links found on the page.');
        }
        const randomIndex = Math.floor(Math.random() * count);
        const selectedLink = commentLinks.nth(randomIndex);

        // Get the href attribute, then resolve it to a full URL.
        const href = await selectedLink.getAttribute('href');
        const commentPageUrl = new URL(href, this.url).toString();

        await Promise.all([
            this.page.waitForNavigation(),
            selectedLink.click()
        ]);

        return commentPageUrl;
    }

    async waitForLoad() {
        await this.page.waitForLoadState('domcontentloaded');
    }
}

