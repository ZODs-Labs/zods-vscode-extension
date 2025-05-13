/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

abstract class DateUtils {
   static convertToFullDateTimeLocaleString(date: Date): string {
      if (!date || !(date instanceof Date)) {
         return '';
      }

      return (
         date.toLocaleDateString(
            'en-US',
            date.getFullYear() !== new Date().getFullYear()
               ? {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                 }
               : {
                    month: 'short',
                    day: '2-digit',
                 }
         ) +
         ' at ' +
         date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
         })
      );
   }

   static isISODateString(value: any): boolean {
      return (
         typeof value === 'string' &&
         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/.test(value)
      );
   }
}

export default DateUtils;
