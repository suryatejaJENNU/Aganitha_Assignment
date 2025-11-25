// Regular expression to validate codes consisting of 6–8 alphanumeric characters
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

/**
 * Validate whether a given code matches the required 6–8 character alphanumeric format.
 *
 * @param {string} code - The code to be validated.
 * @returns {boolean} True if the code is valid, otherwise false.
 */
function isValidCode(code) {
  return CODE_REGEX.test(code);
}

/**
 * Validate whether a given string is a properly formatted HTTP/HTTPS URL.
 *
 * @param {string} url - The URL to validate.
 * @returns {boolean} True if the URL is valid and uses http/https, otherwise false.
 */
function isValidUrl(url) {
  try {
    // Attempt to construct a URL object — this will throw an error if the URL is invalid
    const parsed = new URL(url);

    // Allow only http and https protocols
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    // If URL parsing failed, it's not valid
    return false;
  }
}

// Export validation functions for use in other modules
module.exports = { isValidCode, isValidUrl };
