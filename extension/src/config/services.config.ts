/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { interfaces } from 'inversify';

import { VSCodeService } from '@core/services';
import { FileService } from '@core/services/file.service';
import { WorkspaceService } from '@core/services/workspace.service';
import { IocSymbols } from '@ioc/symbols';
import { Class } from '@models/common';
import {
   AITestStormService,
   CompletionItemsService,
   HttpService,
   NotificationService,
   OutputChannelService,
   SnippetSyncService,
} from '@services';

import AuthService from 'src/@core/services/auth.service';
import { AILensSyncService } from 'src/services/ai-lens-sync.service';

export const serviceInjectables: ReadonlyArray<
   [Class, interfaces.ServiceIdentifier<any>[]]
> = [
   [
      AuthService,
      [
         IocSymbols.IVSCodeService,
         IocSymbols.IHttpService,
         IocSymbols.INotificationService,
         IocSymbols.IOutputChannelService,
      ],
   ],
   [HttpService, [IocSymbols.IVSCodeService]],
   [VSCodeService, [IocSymbols.IVSCode, IocSymbols.IVSCodeExtensionContext]],
   [WorkspaceService, [IocSymbols.IVSCode]],
   [
      FileService,
      [
         IocSymbols.IVSCodeService,
         IocSymbols.INotificationService,
         IocSymbols.IOutputChannelService,
      ],
   ],
   [NotificationService, [IocSymbols.IVSCodeService]],
   [CompletionItemsService, [IocSymbols.IVSCodeService]],
   [OutputChannelService, [IocSymbols.IVSCodeService]],
   [
      SnippetSyncService,
      [
         IocSymbols.IAuthService,
         IocSymbols.ISnippetsDataService,
         IocSymbols.IVSCodeService,
         IocSymbols.ICompletionItemService,
         IocSymbols.IOutputChannelService,
         IocSymbols.IGlobalStateStore,
      ],
   ],
   [
      AILensSyncService,
      [
         IocSymbols.IAuthService,
         IocSymbols.IAILensDataService,
         IocSymbols.IVSCodeService,
         IocSymbols.IOutputChannelService,
         IocSymbols.IGlobalStateStore,
         IocSymbols.INotificationService,
      ],
   ],
   [
      AITestStormService,
      [
         IocSymbols.IAuthService,
         IocSymbols.IHttpService,
         IocSymbols.IOutputChannelService,
      ],
   ],
];
