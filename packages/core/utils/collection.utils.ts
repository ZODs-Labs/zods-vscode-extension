export abstract class CollectionUtils {
   static merge<T extends { id?: string }>(arr1: T[], arr2: T[]): T[] {
      arr1 = arr1 || [];
      arr2 = arr2 || [];

      // Create a map for quick access to items in arr1 by id
      const map = new Map<string, T>(arr1.map((item) => [item.id, item]));

      // Iterate over arr2 and merge or add items
      arr2.forEach((item) => {
         if (map.has(item.id)) {
            // If item exists in arr1, merge it
            map.set(item.id, { ...map.get(item.id), ...item });
         } else {
            // If item doesn't exist in arr1, add it
            map.set(item.id, item);
         }
      });

      // Convert the map back to an array
      return Array.from(map.values());
   }
}
