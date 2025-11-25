// Characters allowed for generating random short codes
const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a random alphanumeric code of a given length.
 *
 * @param {number} length - Length of the code to generate (default: 6).
 * @returns {string} A randomly generated alphanumeric code.
 */
function generateCode(length = 6) {
  let result = '';

  // Loop 'length' times and pick a random character from ALPHANUM each time
  for (let i = 0; i < length; i++) {
    result += ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length));
  }

  return result;
}

// Export the function so it can be used in other modules
module.exports = { generateCode };
