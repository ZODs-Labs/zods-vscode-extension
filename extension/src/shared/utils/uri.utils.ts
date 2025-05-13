/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Uri } from 'vscode';

export abstract class UriUtils {
   /**
    * Gets the directory URI from a file URI.
    * @param fileUri The URI of the file.
    * @return The URI of the directory containing the file, or null if invalid.
    */
   static getDirectoryUri(fileUri: Uri): Uri | null {
      // Validate the fileUri
      if (!fileUri || !fileUri.path) {
         return null;
      }

      // Handle Windows file paths
      const pathSeparator = fileUri.path.includes('\\') ? '\\' : '/';

      // Check if the file is in the root directory
      if (fileUri.path.lastIndexOf(pathSeparator) === 0) {
         // Return root directory URI
         return fileUri.with({ path: pathSeparator });
      }

      // Extract the directory path
      const directoryPath = fileUri.path.substring(
         0,
         fileUri.path.lastIndexOf(pathSeparator)
      );

      // Return the directory URI
      return Uri.file(directoryPath);
   }

   /**
    * Prepends a value to the extension of a file name in a URI.
    * @param uri The URI of the file to be modified.
    * @param prependValue The value to prepend to the file extension.
    * @return The URI with the modified file name.
    **/
   static prependExtensionWith(uri: Uri, prependValue: string): Uri {
      if (!uri || !uri.path) {
         throw new Error('Invalid URI provided');
      }

      const modifiedPath = uri.path.replace(
         /(\.[\w\d_-]+)$/i,
         `${prependValue}$1`
      );
      return uri.with({ path: modifiedPath });
   }

   /**
    * Gets the last path segment of a URI.
    * @param uri The URI to extract the last path segment from.
    * @return The last path segment of the URI.
    */
   static getLastPathSegment(uri: Uri): string {
      if (!uri || !uri.path) {
         throw new Error('Invalid URI provided');
      }

      const pathSegments = uri.path.split('/');
      return pathSegments[pathSegments.length - 1];
   }
}
