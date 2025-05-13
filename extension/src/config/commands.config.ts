/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { interfaces } from 'inversify';

import { UpdateConfigCommandHandler } from '@handlers/command';
import { AIChatCommandHandler } from '@handlers/command/ai-chat-command.handler';
import { LoginCommandHandler } from '@handlers/command/login-command.handler';
import { LogoutCommandHandler } from '@handlers/command/logout-command.handler';
import { SetCodeAIChatContextCommandHandler } from '@handlers/command/set-code-ai-chat-context-command.handler';
import { ShowTestStormViewCommandHandler } from '@handlers/command/show-test-storm-view-command.handler';
import { SyncAILensesCommandHandler } from '@handlers/command/sync-ai-lenses-command.handler';
import { SyncSnippetsCommandHandler } from '@handlers/command/sync-snippets-command.handler';
import { IocSymbols } from '@ioc/symbols';
import { Class } from '@models/common';
import { Command } from '@zods/core';

import { SetIsAILensEnabledCommandHandler } from './../handlers/command/set-is-ai-lens-enabled-command.handler';

const commandHandlersConfig = new Map<string, symbol>([
   [Command.Login, IocSymbols.ILoginCommandHandler],
   [Command.Logout, IocSymbols.ILogoutCommandHandler],
   [Command.SyncSnippets, IocSymbols.ISyncSnippetsCommandHandler],
   [
      Command.SetSelectedCodeAsAIChatContext,
      IocSymbols.ISetCodeAIChatContextCommandHandler,
   ],
   [Command.UpdateConfig, IocSymbols.IUpdateConfigCommandHandler],
   [Command.AIChatCommand, IocSymbols.IAIChatCommandHandler],
   [Command.SetIsAILensEnabled, IocSymbols.ISetIsAILensEnabledCommandHandler],
   [Command.SyncAILensesCommand, IocSymbols.ISyncAILensesCommandHandler],
   [Command.ShowTestStormView, IocSymbols.IShowTestStormViewCommandHandler],
]);

export const commandHandlerInjectables: ReadonlyArray<
   [Class, interfaces.ServiceIdentifier<any>[]]
> = [
   [LoginCommandHandler, [IocSymbols.IVSCodeService]],
   [LogoutCommandHandler, [IocSymbols.IAuthService]],
   [
      SyncSnippetsCommandHandler,
      [IocSymbols.ISnippetSyncService, IocSymbols.INotificationService],
   ],
   [
      SetCodeAIChatContextCommandHandler,
      [
         IocSymbols.IVSCodeService,
         IocSymbols.IAIChatWebViewProvider,
         IocSymbols.INotificationService,
      ],
   ],
   [
      UpdateConfigCommandHandler,
      [IocSymbols.IVSCodeService, IocSymbols.IOutputChannelService],
   ],
   [
      AIChatCommandHandler,
      [
         IocSymbols.IVSCodeService,
         IocSymbols.IOutputChannelService,
         IocSymbols.IAIChatWebViewProvider,
         IocSymbols.INotificationService,
      ],
   ],
   [
      SetIsAILensEnabledCommandHandler,
      [
         IocSymbols.IGlobalStateStore,
         IocSymbols.IOutputChannelService,
         IocSymbols.IAILensDataService,
         IocSymbols.IAuthService,
      ],
   ],
   [SyncAILensesCommandHandler, [IocSymbols.IAILensSyncService]],
   [
      ShowTestStormViewCommandHandler,
      [
         IocSymbols.IVSCodeService,
         IocSymbols.ITestStormWebViewManager,
         IocSymbols.INotificationService,
      ],
   ],
];

export default commandHandlersConfig;
