/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { IUriHandler } from '@models/handlers';
import { Uri } from 'vscode';

import { uriHandlerSymbols } from '@config/uri-handlers.config';
import { IIocContainer } from '@models/ioc';

import { IUriManager } from '@models/managers';

export class UriManager implements IUriManager {
   private readonly uriHandlers: IUriHandler[] = [];

   constructor(private iocContainer: IIocContainer) {
      this.initHandlers();
   }

   handleUri(uri: Uri): void {
      const handler = this.uriHandlers.find((h: IUriHandler) =>
         h.canHandle(uri)
      );
      handler?.handle(uri);
   }

   private initHandlers(): void {
      for (const handlerSymbol of uriHandlerSymbols) {
         const handler = this.iocContainer.get<IUriHandler>(handlerSymbol);
         this.uriHandlers.push(handler);
      }
   }
}
