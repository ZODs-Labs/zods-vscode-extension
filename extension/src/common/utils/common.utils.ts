/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import DateUtils from './date.utils';

/**
 * debounce
 *
 * Creates and returns a new debounced version of the passed function
 * that will postpone its execution until after 'wait' milliseconds have elapsed
 * since the last time it was invoked.
 *
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @param immediate - Call func on the leading edge instead of the trailing.
 * @returns A debounced function.
 */
export function debounce<F extends (...args: any[]) => any>(
   func: F,
   wait: number,
   immediate = false
): (...args: Parameters<F>) => void {
   let timeout: ReturnType<typeof setTimeout> | null = null;

   return function executedFunction(...args: Parameters<F>) {
      // Function to be called after debounce time is over
      const later = () => {
         timeout = null;
         if (!immediate) func(...args);
      };

      // Determine whether to execute the function immediately or later
      const callNow = immediate && !timeout;

      // Clear the timeout if it exists
      if (timeout) {
         clearTimeout(timeout);
      }

      // Set up the new timeout
      timeout = setTimeout(later, wait);

      // If immediate flag is true and no timeout is set, execute the function
      if (callNow) {
         func(...args);
      }
   };
}

export function isNullOrUndefined(value: any): boolean {
   return value === null || value === undefined;
}

export function isEmpty(value: any): boolean {
   return (
      !value || (typeof value === 'object' && Object.keys(value).length === 0)
   );
}

export function deepEqual(obj1: any, obj2: any) {
   if (obj1 === obj2) {
      return true;
   }

   if (isEmpty(obj1) && isEmpty(obj2)) {
      return true;
   }

   if (
      typeof obj1 !== 'object' ||
      obj1 === null ||
      typeof obj2 !== 'object' ||
      obj2 === null
   ) {
      return false;
   }

   const keys1 = Object.keys(obj1);
   const keys2 = Object.keys(obj2);

   if (keys1.length !== keys2.length) {
      return false;
   }

   for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!deepEqual(obj1[key], obj2[key])) return false;
   }

   return true;
}

export function recursivelyTransformDateTimeStringsToDate(obj: any): any {
   if (obj === null || typeof obj !== 'object') {
      return DateUtils.isISODateString(obj) ? new Date(obj) : obj;
   }

   if (Array.isArray(obj)) {
      return obj.map(recursivelyTransformDateTimeStringsToDate);
   }

   // Create a new object if it's a non-array object
   const newObj: any = {};
   for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      let value = obj[key];
      if (typeof value === 'object') {
         newObj[key] = recursivelyTransformDateTimeStringsToDate(value);
      } else {
         newObj[key] = DateUtils.isISODateString(value)
            ? new Date(value)
            : value;
      }
   }
   return newObj;
}

export function safeCast<T>(value: unknown, type: string): T | null {
   if (value === undefined || value === null) return null;

   switch (type) {
      case 'boolean':
         if (value === 'true') return (true as unknown) as T;
         if (value === 'false') return (false as unknown) as T;
         return null;
      case 'number':
         const numValue = parseFloat(value as string);
         if (!isNaN(numValue)) return (numValue as unknown) as T;
         return null;
      case 'string':
         if (typeof value === 'string') return value as T;
         return null;
      default:
         return null;
   }
}
