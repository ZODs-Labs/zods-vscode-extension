/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
   ConfigurationTarget,
   Disposable,
   StatusBarAlignment,
   ThemeColor,
} from 'vscode';

import config from '@config/constants';
import { VsCodeConfigKeys } from '@config/vscode-config.constants';
import { AuthService } from '@core/services';
import {
   ICodeLensRegistrationFactory,
   ICommandRegistrationFactory,
   IWebViewRegistrationFactory,
} from '@models/factory';
import { IExtensionManager, IUriManager } from '@models/managers';
import {
   IAuthService,
   IOutputChannelService,
   IVSCodeService,
} from '@models/service';
import { ZodsAuthenticationProvider } from '@providers/zods-authentication.provider';

export class ExtensionManager implements IExtensionManager {
   constructor(
      private vscodeService: IVSCodeService,
      private commandRegistrationFactory: ICommandRegistrationFactory,
      private webViewRegistrationFactory: IWebViewRegistrationFactory,
      private codeLensRegistrationFactory: ICodeLensRegistrationFactory,
      private uriManager: IUriManager,
      private authService: IAuthService,
      private outputChannelService: IOutputChannelService
   ) {}

   public async activate(): Promise<void> {
      this.registerUriHandlers();
      this.registerCommands();
      this.registerAuth();
      this.registerWebViews();
      this.registerCodeLensProviders();
      this.addStatusIconOnStatusBar();
      this.setInitialWorkspaceConfiguration();
   }

   private registerUriHandlers(): void {
      const handler = this.vscodeService.window.registerUriHandler({
         handleUri: (uri) => this.uriManager.handleUri(uri),
      });

      this.addDisposable(handler);
   }

   private registerCommands(): void {
      this.commandRegistrationFactory.registerCommands();
   }

   private registerAuth(): void {
      const shAuthProvider = new ZodsAuthenticationProvider(
         this.authService,
         this.outputChannelService,
         this.vscodeService
      );
      const disposable =
         this.vscodeService.authentication.registerAuthenticationProvider(
            config.ZODS_X_AUTH_PROVIDER_ID,
            'ZODs',
            shAuthProvider
         );

      this.addDisposable(disposable);
   }

   private registerWebViews(): void {
      this.webViewRegistrationFactory.registerWebViewProviders();
   }

   private registerCodeLensProviders(): void {
      this.codeLensRegistrationFactory.registerCodeLensProviders();
   }

   private addDisposable(disposable: Disposable): void {
      this.vscodeService.context.subscriptions.push(disposable);
   }

   private addStatusIconOnStatusBar(): void {
      const statusBarItem = this.vscodeService.window.createStatusBarItem(
         'ZODs',
         StatusBarAlignment.Right,
         100
      );

      statusBarItem.text = '$(zods-contrast-logo) ZODs Lens AI';
      statusBarItem.tooltip = 'Click to open AI Chat';
      statusBarItem.accessibilityInformation = {
         label: 'ZODs Lens AI - Click to open AI Chat',
      };

      statusBarItem.show();
      statusBarItem;
      this.addDisposable(statusBarItem);

      statusBarItem.command = 'zods.webview.ai-chat.focus';

      AuthService.TokenEventEmitter.event((token) => {
         if (token) {
            statusBarItem.backgroundColor = new ThemeColor('statusBarItem.background');
         } else {
            statusBarItem.backgroundColor = new ThemeColor(
               'statusBarItem.warningBackground'
            );
         }
      });
   }

   private setInitialWorkspaceConfiguration(): void {
      const isLensConfigOverrideDisabled = this.vscodeService.workspace
         .getConfiguration()
         .get(VsCodeConfigKeys.DisableJSTSLensConfigOverride);

      if (isLensConfigOverrideDisabled) {
         // If user has disabled the override, then do not override the config
         return;
      }

      const tsConfig =
         this.vscodeService.workspace.getConfiguration('typescript');

      tsConfig.update(
         'referencesCodeLens.enabled',
         true,
         ConfigurationTarget.Global
      );
      tsConfig.update(
         'referencesCodeLens.showOnAllFunctions',
         true,
         ConfigurationTarget.Global
      );

      const jsConfig =
         this.vscodeService.workspace.getConfiguration('javascript');

      jsConfig.update(
         'referencesCodeLens.enabled',
         true,
         ConfigurationTarget.Global
      );
      jsConfig.update(
         'referencesCodeLens.showOnAllFunctions',
         true,
         ConfigurationTarget.Global
      );
   }
}
