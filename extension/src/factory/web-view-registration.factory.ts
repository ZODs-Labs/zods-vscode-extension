/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { webViewProviderSymbols } from '@config/view-providers.config';
import { IWebViewRegistrationFactory } from '@models/factory';
import { IIocContainer } from '@models/ioc/container.model';
import { IWebViewProvider } from '@models/providers/view/view-provider.model';
import { IVSCodeService } from '@models/service';

export class WebViewRegistrationFactory implements IWebViewRegistrationFactory {
   constructor(
      private vscodeService: IVSCodeService,
      private container: IIocContainer
   ) {}

   public registerWebViewProviders(): void {
      const subscriptions = [];

      for (const providerSymbol of webViewProviderSymbols) {
         const provider = this.container.get<IWebViewProvider>(providerSymbol);
         const providerRegistration = this.vscodeService.window.registerWebviewViewProvider(
            provider.id,
            provider,
            {
               webviewOptions: {
                  retainContextWhenHidden: true,
               },
            }
         );

         subscriptions.push(providerRegistration);
      }

      this.vscodeService.context.subscriptions.push(...subscriptions);
   }
}
