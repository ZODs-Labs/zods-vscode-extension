/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import * as vscode from 'vscode';

import { Container, decorate, inject, injectable, interfaces } from 'inversify';
import 'reflect-metadata';

import codeLensProvidersInjectables from '@config/code-lens.config';
import { commandHandlerInjectables } from '@config/commands.config';
import { dataServiceInjectables } from '@config/data-services.config';
import { factoryInjectables } from '@config/factories.config';
import { managerInjectables } from '@config/managers.config';
import { serviceInjectables } from '@config/services.config';
import { storeInjectables } from '@config/store.config';
import { uriHandlersInjectables } from '@config/uri-handlers.config';
import viewProvidersInjectables from '@config/view-providers.config';
import { SnippetsDataService } from '@data-services';
import { CommandRegistrationFactory, SymbolMatcherFactory } from '@factory';
import {
   SyncSnippetsCommandHandler,
   LoginCommandHandler,
   UpdateConfigCommandHandler,
   ShowTestStormViewCommandHandler,
} from '@handlers/command';
import { AIChatCommandHandler } from '@handlers/command/ai-chat-command.handler';
import { LogoutCommandHandler } from '@handlers/command/logout-command.handler';
import { SetCodeAIChatContextCommandHandler } from '@handlers/command/set-code-ai-chat-context-command.handler';
import { SetIsAILensEnabledCommandHandler } from '@handlers/command/set-is-ai-lens-enabled-command.handler';
import { SyncAILensesCommandHandler } from '@handlers/command/sync-ai-lenses-command.handler';
import { AuthenticationUriHandler } from '@handlers/uri';
import { IocSymbols } from '@ioc/symbols';
import { ExtensionManager, UriManager } from '@managers';
import {
   IAIFeaturesCodeLensProvider,
   ICommonCodeLensProvider,
} from '@models/code-lens';
import { Class } from '@models/common';
import {
   IAILensDataService,
   ISnippetsDataService,
} from '@models/data-services';
import {
   ICodeLensRegistrationFactory,
   ICommandRegistrationFactory,
   ISymbolMatcherFactory,
   IWebViewRegistrationFactory,
} from '@models/factory';
import {
   IAIChatCommandHandler,
   IAuthenticationUriHandler,
   ILoginCommandHandler,
   ILogoutCommandHandler,
   ISetCodeAIChatContextCommandHandler,
   ISetIsAILensEnabledCommandHandler,
   IShowTestStormViewCommandHandler,
   ISyncAILensesCommandHandler,
   ISyncSnippetsCommandHandler,
   IUpdateConfigCommandHandler,
} from '@models/handlers';
import { IIocContainer } from '@models/ioc';
import {
   IExtensionManager,
   ITestStormWebViewManager,
   IUriManager,
} from '@models/managers';
import { IAIChatWebViewProvider } from '@models/providers/view';
import {
   IAILensSyncService,
   IAITestStormService,
   IAuthService,
   ICompletionItemService,
   IFileService,
   IHttpService,
   INotificationService,
   IOutputChannelService,
   IRootService,
   ISnippetSyncService,
   IVSCodeService,
   IWorkspaceService,
} from '@models/service';
import { IGlobalStateStore } from '@models/store';
import { IVSCode, IVSCodeExtensionContext } from '@models/vscode';
import { CommonCodeLensProvider } from '@providers/code-lens';
import { AIFeaturesCodeLensProvider } from '@providers/code-lens/ai-features-code-lens.provider';
import { AIChatWebViewProvider } from '@providers/views/ai-chat-webview/aichat-webview.provider';
import {
   AITestStormService,
   CompletionItemsService,
   HttpService,
   NotificationService,
   OutputChannelService,
   SnippetSyncService,
} from '@services';

import AuthService from './auth.service';
import { FileService } from './file.service';
import VSCodeService from './vscode.service';
import { WorkspaceService } from './workspace.service';
import { AILensDataService } from 'src/data-services/ai-lens.dataservice';
import { CodeLensRegistrationFactory } from 'src/factory/code-lens-registration.factory';
import { WebViewRegistrationFactory } from 'src/factory/web-view-registration.factory';
import { TestStormWebViewManager } from 'src/managers/view';
import { AILensSyncService } from 'src/services/ai-lens-sync.service';
import { GlobalStateStore } from 'src/stores/global.store';

export class RootService implements IRootService {
   private readonly container: Container;
   private injectables: ReadonlyArray<
      [Class, interfaces.ServiceIdentifier<any>[]]
   >;

   constructor(private context: IVSCodeExtensionContext) {
      this.container = new Container({
         defaultScope: 'Singleton',
         skipBaseClassChecks: true,
      });
      this.injectables = [];
      this.init();
      this.initDecorations();
      this.initBindings();
   }

   public get<T>(identifier: interfaces.ServiceIdentifier<T>): T {
      return this.container.get<T>(identifier);
   }

   public init(): void {
      this.injectables = [
         ...serviceInjectables,
         ...managerInjectables,
         ...commandHandlerInjectables,
         ...uriHandlersInjectables,
         ...dataServiceInjectables,
         ...viewProvidersInjectables,
         ...factoryInjectables,
         ...codeLensProvidersInjectables,
         ...storeInjectables,
      ];
   }

   public dispose(): void {}

   public initDecorations(): void {
      this.injectables.forEach(
         (injectableClass: [Class, interfaces.ServiceIdentifier<any>[]]) => {
            // Declare classes as injectables
            const cls: Class = injectableClass[0];
            decorate(injectable(), cls);
            // Declare injectable parameters
            const params: interfaces.ServiceIdentifier<any>[] =
               injectableClass[1];
            params.forEach(
               (identifier: interfaces.ServiceIdentifier<any>, index: number) =>
                  decorate(inject(identifier), cls, index)
            );
         }
      );
   }

   private initBindings(): void {
      const bind = <T>(
         identifier: interfaces.ServiceIdentifier<T>
      ): interfaces.BindingToSyntax<T> => this.container.bind<T>(identifier);

      bind<IVSCode>(IocSymbols.IVSCode).toConstantValue(vscode);
      bind<IVSCodeExtensionContext>(
         IocSymbols.IVSCodeExtensionContext
      ).toConstantValue(this.context);

      // Managers
      bind<IExtensionManager>(IocSymbols.IExtensionManager).to(
         ExtensionManager
      );
      bind<IUriManager>(IocSymbols.IUriManager).to(UriManager);
      bind<ITestStormWebViewManager>(IocSymbols.ITestStormWebViewManager).to(
         TestStormWebViewManager
      );

      // Stores
      bind<IGlobalStateStore>(IocSymbols.IGlobalStateStore).to(
         GlobalStateStore
      );

      // Services
      bind<IHttpService>(IocSymbols.IHttpService).to(HttpService);
      bind<IAuthService>(IocSymbols.IAuthService).to(AuthService);
      bind<IVSCodeService>(IocSymbols.IVSCodeService).to(VSCodeService);
      bind<IWorkspaceService>(IocSymbols.IWorkspaceService).to(
         WorkspaceService
      );
      bind<IFileService>(IocSymbols.IFileService).to(FileService);

      bind<INotificationService>(IocSymbols.INotificationService).to(
         NotificationService
      );
      bind<ICompletionItemService>(IocSymbols.ICompletionItemService).to(
         CompletionItemsService
      );
      bind<IOutputChannelService>(IocSymbols.IOutputChannelService).to(
         OutputChannelService
      );
      bind<ISnippetSyncService>(IocSymbols.ISnippetSyncService).to(
         SnippetSyncService
      );
      bind<IAILensSyncService>(IocSymbols.IAILensSyncService).to(
         AILensSyncService
      );
      bind<IAITestStormService>(IocSymbols.IAITestStormService).to(
         AITestStormService
      );

      // Data services
      bind<ISnippetsDataService>(IocSymbols.ISnippetsDataService).to(
         SnippetsDataService
      );
      bind<IAILensDataService>(IocSymbols.IAILensDataService).to(
         AILensDataService
      );

      // Factories
      bind<ICommandRegistrationFactory>(
         IocSymbols.ICommandRegistrationFactory
      ).to(CommandRegistrationFactory);
      bind<IWebViewRegistrationFactory>(
         IocSymbols.IWebViewRegistrationFactory
      ).to(WebViewRegistrationFactory);
      bind<ICodeLensRegistrationFactory>(
         IocSymbols.ICodeLensRegistrationFactory
      ).to(CodeLensRegistrationFactory);
      bind<ISymbolMatcherFactory>(IocSymbols.ISymbolMatcherFactory).to(
         SymbolMatcherFactory
      );

      // Command handlers
      bind<ILoginCommandHandler>(IocSymbols.ILoginCommandHandler).to(
         LoginCommandHandler
      );
      bind<ILogoutCommandHandler>(IocSymbols.ILogoutCommandHandler).to(
         LogoutCommandHandler
      );
      bind<ISyncSnippetsCommandHandler>(
         IocSymbols.ISyncSnippetsCommandHandler
      ).to(SyncSnippetsCommandHandler);
      bind<ISetCodeAIChatContextCommandHandler>(
         IocSymbols.ISetCodeAIChatContextCommandHandler
      ).to(SetCodeAIChatContextCommandHandler);
      bind<IUpdateConfigCommandHandler>(
         IocSymbols.IUpdateConfigCommandHandler
      ).to(UpdateConfigCommandHandler);
      bind<IAIChatCommandHandler>(IocSymbols.IAIChatCommandHandler).to(
         AIChatCommandHandler
      );
      bind<ISetIsAILensEnabledCommandHandler>(
         IocSymbols.ISetIsAILensEnabledCommandHandler
      ).to(SetIsAILensEnabledCommandHandler);
      bind<ISyncAILensesCommandHandler>(
         IocSymbols.ISyncAILensesCommandHandler
      ).to(SyncAILensesCommandHandler);
      bind<IShowTestStormViewCommandHandler>(
         IocSymbols.IShowTestStormViewCommandHandler
      ).to(ShowTestStormViewCommandHandler);

      // Uri handlers
      bind<IAuthenticationUriHandler>(IocSymbols.IAuthenticationUriHandler).to(
         AuthenticationUriHandler
      );

      bind<IIocContainer>(IocSymbols.IIocContainer).toConstantValue(
         this.container
      );

      // View Providers
      bind<IAIChatWebViewProvider>(IocSymbols.IAIChatWebViewProvider).to(
         AIChatWebViewProvider
      );

      // Code Lens Providers
      bind<IAIFeaturesCodeLensProvider>(
         IocSymbols.IAIFeaturesCodeLensProvider
      ).to(AIFeaturesCodeLensProvider);
      bind<ICommonCodeLensProvider>(IocSymbols.ICommonCodeLensProvider).to(
         CommonCodeLensProvider
      );
   }
}

export default RootService;
