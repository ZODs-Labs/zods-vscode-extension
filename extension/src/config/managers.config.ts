/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { interfaces } from 'inversify';

import { IocSymbols } from '@ioc/symbols';
import { ExtensionManager, UriManager } from '@managers';
import { Class } from '@models/common';

import { TestStormWebViewManager } from 'src/managers/view/test-storm-view.manager';

export const managerInjectables: ReadonlyArray<
   [Class, interfaces.ServiceIdentifier<any>[]]
> = [
   [
      ExtensionManager,
      [
         IocSymbols.IVSCodeService,
         IocSymbols.ICommandRegistrationFactory,
         IocSymbols.IWebViewRegistrationFactory,
         IocSymbols.ICodeLensRegistrationFactory,
         IocSymbols.IUriManager,
         IocSymbols.IAuthService,
         IocSymbols.IOutputChannelService,
      ],
   ],
   [UriManager, [IocSymbols.IIocContainer]],
   [
      TestStormWebViewManager,
      [
         IocSymbols.IWorkspaceService,
         IocSymbols.IAITestStormService,
         IocSymbols.IFileService,
         IocSymbols.IVSCodeService,
         IocSymbols.IOutputChannelService,
         IocSymbols.IHttpService,
      ],
   ],
];
