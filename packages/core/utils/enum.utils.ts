export abstract class EnumUtils {
   static formatNumericEnumValueToLabel(
      enumObj: any,
      enumValue: number
   ): string {
      const enumString = enumObj[enumValue] as any as string;

      // Edge case: Undefined enum string
      if (typeof enumString !== 'string') {
         return '';
      }

      // Insert a space before each uppercase letter that is either followed by a lowercase letter or preceded by another uppercase letter
      return (
         enumString
            .replace(
               /([A-Z])(?=[a-z])|(?<=[A-Z])([A-Z])(?=[A-Z][a-z])/g,
               ' $1$2'
            )
            // Trim any leading space and ensure the first character is uppercase
            .trim()
            .replace(/^./, (match) => match.toUpperCase())
      );
   }
}
