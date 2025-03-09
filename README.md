# Playwright Tests for Hacker News

This repository contains a Playwright test suite that automates the login and account creation flows for Hacker News. The tests are designed using the Page Object Model and include resilient handling for external rate limiting.

### Key Features

#### Custom Logger
-  The custom Logger provides detailed, colourised output for each test step. It can suppress success messages when rate limiting is detected, ensuring that the test output remains clear and informative. 

#### Rate Limiting Handling
- After login or account creation actions, the suite checks for rate-limiting indicators (e.g., "Validation required", "Sorry, we're not able to serve your requests this quickly", or a reCAPTCHA iframe). If detected, the test logs a warning, sets a flag in the custom logger, and returns early so the test doesn’t continue with a false positive.


### Getting Started
#### Pre-requisites
- NodeJS installed on your machine
- Yarn too

#### Installation
- Clone the repository
- Install deps with `yarn install`
- Set up the following simple env vars (or use a .env file):
  - `WORKING_USERNAME` - a working (i.e. created account) username for HN
  - `DEFAULT_PASSWORD` - a password to use whenever we expect a legitimate password

#### Running the tests
Run the test suite with:
```
yarn playwright test
```

If you wish to run in headed or debug mode (or both), use:
```
yarn playwright test --debug --headed
```

### Notes
#### Choice of Site
If given more time, I would have chosen a less performance-focused site with fewer constraints (e.g. rate limiting). Unfortunately the rate limiting began to appear as I added more and more tests, making it a bit problematic. 
I didn't want to waste the effort I'd already put in so I implemented handling for it, but it's not ideal.

The HN page is not particularly ideal, as there is not a great deal that can be done to test the site without running into rate limiting. It also doesn't utilise a lot of things that would be fun to test (e.g. SSO, MFA, etc).

#### Tests I'd add given more time 
- Handling session expiration
- Handling browser cookie clearing
- Testing keyboard navigation (a11y)
- Testing back button behaviour after login
- Testing direct access to login-required pages without login
- Testing post-login access to protected features (e.g. upvotes)
- Further security tests (e.g. path traversal with ../)
