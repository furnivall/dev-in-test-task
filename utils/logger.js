import chalk from 'chalk';

class Logger {
    constructor(testName, colour, source = 'unknown') {
        this.testName = testName;
        this.colour = colour || 'white';
        this.source = source;

        this.chalkColours = {
            red: chalk.red.bold,
            green: chalk.green.bold,
            blue: chalk.blue.bold,
            yellow: chalk.yellow.bold,
            magenta: chalk.magenta.bold,
            cyan: chalk.cyan.bold,
            white: chalk.white,
            gray: chalk.gray,
            blueBright: chalk.blueBright.bold,
            magentaBright: chalk.magentaBright.bold,
            cyanBright: chalk.cyanBright.bold
        };
    }

    log(message) {
        const colourFn = this.chalkColours[this.colour] || chalk.white;
        console.log(colourFn(`[${this.source}] [${this.testName}] ${message}`));
    }

    info(message) {
        const colourFn = this.chalkColours[this.colour] || chalk.white;
        console.log(colourFn(`ℹ [${this.source}] [${this.testName}] ${message}`));
    }

    success(message) {
        // Only log success if not rate limited.
        if (!this.isRateLimited) {
            console.log(chalk.green.bold(`✓ [${this.source}] [${this.testName}] ${message}`));
        }
    }

    warning(message) {
        console.log(chalk.yellow.bold(`⚠ [${this.source}] [${this.testName}] ${message}`));
    }

    error(message) {
        console.log(chalk.red.bold(`✗ [${this.source}] [${this.testName}] ${message}`));
    }

    step(stepName, message) {
        const colourFn = this.chalkColours[this.colour] || chalk.white;
        console.log(colourFn(`[${this.source}] [${this.testName}] [${stepName}] ${message || ''}`));
    }
}

export default Logger;
