/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

/**
 * Builds a URL with the provided base URL and tokens for authentication.
 *
 * @param {string} baseUrl - The base URL to which the authentication tokens will be appended.
 * @param {string} idToken - The ID token for authentication.
 * @param {string} refreshToken - The refresh token for authentication.
 * @returns {string} - The complete URL containing the base URL and the authentication tokens.
 */
export const buildRedirectUrl = (
   baseUrl: string,
   idToken: string,
   refreshToken: string
) => {
   return `${baseUrl}?token=${encodeURIComponent(
      idToken
   )}&refreshToken=${encodeURIComponent(refreshToken)}`;
};

/**
 * Decodes a JWT token and retrieves its claims.
 *
 * @param token - The JWT token to decode.
 * @returns The claims from the decoded JWT token, or null if the token is invalid.
 *
 * @remarks
 * - This function only decodes the token. It does NOT validate the signature of the token.
 * - Always treat data decoded on the client side as untrusted.
 */
export function decodeJWTClaims(token: string): Record<string, any> | null {
   try {
      // Split the token into its sections
      const tokenParts = token.split('.');

      // Ensure the token has three parts: header, payload, and signature
      if (tokenParts.length !== 3) {
         return null;
      }

      // Get the payload part of the token, which is the middle part
      const payload = tokenParts[1];

      // Base64 decode the payload and parse it as JSON
      const claims = JSON.parse(atob(payload));

      return claims;
   } catch (error) {
      // If any errors occur (e.g., invalid base64 string, invalid JSON), return null
      return null;
   }
}
