import { v4 as uuidv4 } from 'uuid';

/**
 * Simple hash function to get a consistent number from a string
 * @param {string} str - String to hash
 * @returns {number} - Hash code
 */
export function simpleHash(str) { // documentation here: https://stackoverflow.com/a/7616484/13238134
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // cool trick to convert to 32 bit integer
    }
    return Math.abs(hash);
}


export function generateUniqueUsernameThatFails(prefix = 'testuser') {
    return `${prefix}${uuidv4()}`;
}

export function generateUniqueUsername(prefix = 'testuser') {
    const suffix = uuidv4().split('-')[0]; // 8 chars
    const candidate = `${prefix}_${suffix}`;
    // ensure total length <= 15
    return candidate.slice(0, 15);
}
