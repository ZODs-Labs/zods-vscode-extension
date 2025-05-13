/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { interfaces } from 'inversify';

import { IocSymbols } from '@ioc/symbols';
import { Class } from '@models/common';
import { AIChatWebViewProvider } from '@providers/views/ai-chat-webview/aichat-webview.provider';

export const webViewProviderSymbols = [IocSymbols.IAIChatWebViewProvider];

const viewProvidersInjectables: ReadonlyArray<
   [Class, interfaces.ServiceIdentifier<any>[]]
> = [
   [
      AIChatWebViewProvider,
      [
         IocSymbols.IVSCodeService,
         IocSymbols.IAuthService,
         IocSymbols.IGlobalStateStore,
      ],
   ],
];

export default viewProvidersInjectables;
