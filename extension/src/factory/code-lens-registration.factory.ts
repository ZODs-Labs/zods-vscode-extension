/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { codeLensProviderSymbols } from '@config/code-lens.config';
import { ICodeLensProvider } from '@models/code-lens';
import { ICodeLensRegistrationFactory } from '@models/factory';
import { IIocContainer } from '@models/ioc';
import { IVSCodeService } from '@models/service';

export class CodeLensRegistrationFactory
   implements ICodeLensRegistrationFactory
{
   constructor(
      private vscodeService: IVSCodeService,
      private container: IIocContainer
   ) {}

   public registerCodeLensProviders(): void {
      const subscriptions = [];

      for (const providerSymbol of codeLensProviderSymbols) {
         const provider = this.container.get<ICodeLensProvider>(providerSymbol);

         this.validateProvider(provider, providerSymbol);

         const sub = this.vscodeService.languages.registerCodeLensProvider(
            provider.languages,
            provider
         );

         subscriptions.push(sub);
      }

      this.vscodeService.context.subscriptions.push(...subscriptions);
   }

   private validateProvider(provider: ICodeLensProvider, symbol: symbol): void {
      if (!provider) {
         throw new Error(`CodeLensProvider not found for ${symbol.toString()}`);
      }

      if (provider.languages?.length === 0) {
         throw new Error(
            `CodeLensProvider languages not found for ${provider.toString()}`
         );
      }
   }
}
