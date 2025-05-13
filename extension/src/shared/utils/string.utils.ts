/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

export abstract class StringUtils {
   /**
    * Converts a string to a Uint8Array.
    * @param str The string to be converted.
    * @returns A Uint8Array representing the string.
    */
   static stringToUint8Array(str: string): Uint8Array {
      return new TextEncoder().encode(str);
   }
}
