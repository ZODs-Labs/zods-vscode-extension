/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Uri } from 'vscode';

export abstract class UriUtils {
   static getRawQueryParam(uri: Uri, queryParam: string): string {
      if (!uri.query || !queryParam) {
         return '';
      }

      const rawQueryParams = uri.query.split('&');
      const rawQueryParam = rawQueryParams.find((param) =>
         param.startsWith(`${queryParam}=`)
      );

      if (!rawQueryParam) {
         return '';
      }

      return rawQueryParam.split('=')[1];
   }
}
