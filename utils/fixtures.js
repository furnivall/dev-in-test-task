import { test as base } from '@playwright/test';
import Logger from './logger.js';
import { simpleHash } from './test-helper.js';

// Predefined colours to cycle through for different tests - deliberately avoiding blue & green here
const colours = ['blue', 'magenta', 'cyan', 'yellow', 'blueBright', 'magentaBright', 'cyanBright'];

// Extend the base playwright test object with our custom logger fixture
export const test = base.extend({
    // Add a logger fixture that's automatically available in all tests
    logger: [async ({ page }, use, testInfo) => {
        // Get a consistent colour based on the test name hash
        const testName = testInfo.title;
        const colourIndex = simpleHash(testName) % colours.length;
        const colour = colours[colourIndex];

        // Determine source file
        const fileName = testInfo.file.split('/').pop();

        // Create the logger
        const logger = new Logger(testName, colour, fileName);

        // Use the logger in the test
        await use(logger);

        // Log the test end with appropriate status
        if (testInfo.status === 'passed') {
            logger.success('Test passed');
        } else if (testInfo.status === 'failed') {
            logger.error(`Test failed: ${testInfo.error?.message || 'Unknown error'}`);
        } else {
            logger.warning(`Test ${testInfo.status}`);
        }
    }, { scope: 'test' }]
});

// Re-export expect so tests don't need to import from multiple places
export { expect } from '@playwright/test';
