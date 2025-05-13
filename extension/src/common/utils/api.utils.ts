/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

export abstract class ApiUtils {
   /**
    * Formats a given route template with provided route parameters.
    *
    * @example
    * formatRoute('/snippets/{userId}/all/{secondUserId}/them', {userId: 123, secondUserId: 555})
    * // returns '/snippets/123/all/555/them'
    *
    * @param {string} routeTemplate - The route template containing placeholders.
    * @param {Record<string, any>} routeParams - An object containing key-value pairs to replace placeholders.
    * @returns {string} - The formatted route string.
    */
   static formatRoute(
      routeTemplate: string,
      routeParams: Record<string, any> = {}
   ): string {
      let formattedRoute = routeTemplate;

      for (const [key, value] of Object.entries(routeParams)) {
         const placeholder = `{${key}}`;
         formattedRoute = formattedRoute.replace(placeholder, value.toString());
      }

      return formattedRoute;
   }
}
