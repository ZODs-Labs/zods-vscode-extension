/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Disposable, Uri, WebviewView } from 'vscode';

import { AIChatCommand } from '@common/enums';
import { WebViewUtils } from '@common/utils';
import config from '@config/constants';
import { VsCodeConfigKeys } from '@config/vscode-config.constants';
import { EncryptionUtils } from '@core/encryption';
import { AuthService } from '@core/services';
import { AILensInfoDto } from '@models/api/ai-lens.model';
import {
   IAIChatWebViewProvider,
   IWebViewListener,
   WebViewConfig,
} from '@models/providers/view';
import { IAuthService, IVSCodeService } from '@models/service';
import { IGlobalStateStore } from '@models/store';
import { MessageCommand } from '@zods/core';

import { AIChatActiveFileExtensionWebViewListener } from './listeners/ai-chat-active-file-extension.listener';
import { AIChatConfigurationWebViewListener } from './listeners/ai-chat-configuration.listener';

const VIEW_ID = 'zods.webview.ai-chat';

export class AIChatWebViewProvider implements IAIChatWebViewProvider {
   public id: string = VIEW_ID;
   private _view?: WebviewView;
   private readonly extensionUri: Uri;
   private readonly viewListeners: IWebViewListener[];
   private _viewReady: Promise<void> | null = null;
   private _viewReadyResolve: (() => void) | null = null;

   private readonly disposables: Disposable[] = [];

   constructor(
      private vscodeService: IVSCodeService,
      private authService: IAuthService,
      private globalStateStore: IGlobalStateStore
   ) {
      this.extensionUri = this.vscodeService.context.extensionUri;
      this.viewListeners = [
         new AIChatActiveFileExtensionWebViewListener(),
         new AIChatConfigurationWebViewListener(),
      ];
   }

   public resolveWebviewView(webviewView: WebviewView): void {
      this._view = webviewView;
      webviewView.webview.options = {
         // Allow scripts in the webview
         enableScripts: true,
         localResourceRoots: [this.extensionUri],
      };
      webviewView.webview.html = this.getHtmlForWebview();

      webviewView.onDidDispose(() => {
         this.dispose();
      });

      this.initWebviewAuth();
      this.registerListeners(webviewView);

      this.postInitialConfiguration();
   }

   public getConfiguration(): WebViewConfig {
      const webview = this._view?.webview;
      if (!webview) {
         throw new Error('Webview is not initialized');
      }

      const webviewConfig: WebViewConfig = {
         id: VIEW_ID,
         title: 'ZODs AI Chat',
         scriptUri: IS_DEV
            ? 'http://localhost:3000/static/js/bundle.js'
            : webview.asWebviewUri(
                 Uri.joinPath(
                    this.extensionUri,
                    'out/views/web/ai-chat',
                    'index.js'
                 )
              ),
         styleUris: [
            webview.asWebviewUri(
               Uri.joinPath(
                  this.extensionUri,
                  'out/views/web/ai-chat',
                  'index.css'
               )
            ),
            IS_DEV
               ? 'http://localhost:3000/highlight-vs2015.min.css'
               : webview.asWebviewUri(
                    Uri.joinPath(
                       this.extensionUri,
                       'resources/css/highlight-vs2015.min.css'
                    )
                 ),
         ],
         env: {
            ApiUrl: config.API_URL,
            WebUrl: config.WEB_URL,
            RawLogoUrl: this.getWebviewResourceUri('contrast-logo.png'),
            GooglePalmLogoUrl: this.getWebviewResourceUri(
               'google_palm_logo.png'
            ),
            CodeIconUrl: this.getWebviewResourceUri('icons/code-icon.svg'),
            TrashIconUrl: this.getWebviewResourceUri('icons/trash-icon.svg'),
            SendIconUrl: this.getWebviewResourceUri('icons/send-icon.svg'),
            BugIconUrl: this.getWebviewResourceUri('icons/bug-icon.svg'),
            BulbIconUrl: this.getWebviewResourceUri('icons/bulb-icon.svg'),
            StopCircleIconUrl: this.getWebviewResourceUri(
               'icons/stop-circle-icon.svg'
            ),
            MistralAILogoUrl: this.getWebviewResourceUri('mistralai_logo.png'),
         },
      };

      return webviewConfig;
   }

   public ensureWebViewIsOpen(): Promise<void> {
      if (!this._view) {
         this._viewReady = new Promise<void>((resolve) => {
            this._viewReadyResolve = resolve;
         });
         this.vscodeService.commands
            .executeCommand(`${VIEW_ID}.focus`)
            .then(() => {
               // The webview should be focused now, but we're not resolving the promise yet.
               // We're waiting for the webview to send a 'webviewReady' message.
            });
      } else {
         this._view.show();
         if (!this._viewReady) {
            // Webview is already open and should be ready
            return Promise.resolve();
         }
      }
      return this._viewReady;
   }

   private notifyWebViewIsReady() {
      if (this._viewReadyResolve) {
         this._viewReadyResolve();
         this._viewReady = null; // Reset the promise after it's resolved.
         this._viewReadyResolve = null; // Cleanup the resolver function.
      }
   }

   public postMessageToView(
      command: string,
      data: any,
      chatCommand?: AIChatCommand,
      chatCommandMetadata?: any
   ): void {
      this.executeCommand(command, data, chatCommand, chatCommandMetadata);
   }

   private executeCommand(
      command: string,
      data: any,
      chatCommand?: AIChatCommand,
      chatCommandMetadata?: any
   ) {
      this._view?.webview.postMessage({
         command,
         data,
         chatCommand,
         chatCommandMetadata,
      });
   }

   private getHtmlForWebview() {
      const config = this.getConfiguration();
      const rawHtml = WebViewUtils.getRootHtml(config);

      return rawHtml;
   }

   private registerListeners(view: WebviewView): void {
      const listenerDisposables = this.viewListeners.map((listener) =>
         listener.register(view)
      );
      this.disposables.push(...listenerDisposables);

      view.webview.onDidReceiveMessage((message) => {
         const { command, type, data } = message;
         if (type === 'command' && command) {
            this.vscodeService.commands.executeCommand(command, data);

            // Handle OpenAI API key change
            // If the key is set, disable built-in AI lenses
            // If the key is removed, enable built-in AI lenses
            if (VsCodeConfigKeys.OpenAIAPIKey in data) {
               const openAIApiKey = data[VsCodeConfigKeys.OpenAIAPIKey];
               this.globalStateStore.update(
                  config.AI_LENSES_BUILT_IN_DISABLED_STORAGE_KEY,
                  !!openAIApiKey
               );
            }
         } else if (command === 'openUrl') {
            this.vscodeService.env.openExternal(Uri.parse(data));
         }

         if (message.command === 'webviewReady') {
            this.notifyWebViewIsReady();
         }
      });

      // Listen for AI Lens changes and update the webview
      this.globalStateStore.onDidChange(
         config.AI_LENSES_STORAGE_KEY,
         (aiLenses: AILensInfoDto[]) => {
            this.executeCommand(MessageCommand.UpdateConfig, {
               key: 'aiLenses',
               value: aiLenses,
            });
         }
      );
   }

   private getWebviewResourceUri(path: string): Uri | string | undefined {
      let uri;

      if (IS_DEV) {
         uri = 'http://localhost:3000/' + path;
         return uri;
      } else {
         uri = Uri.joinPath(this.extensionUri, 'resources', path);
         return this._view?.webview.asWebviewUri(uri);
      }
   }

   private postInitialConfiguration(): void {
      const aiModelFromConfig = this.vscodeService.workspace.getConfiguration();
      const aiModel = aiModelFromConfig.get(VsCodeConfigKeys.AIModel);
      const maxTokens = aiModelFromConfig.get(VsCodeConfigKeys.MaxAIChatTokens);
      const openAIApiKey = aiModelFromConfig.get(
         VsCodeConfigKeys.OpenAIAPIKey
      ) as string;

      const authToken = this.authService.getToken();
      const aiLenses = this.globalStateStore.get<AILensInfoDto[]>(
         config.AI_LENSES_STORAGE_KEY,
         []
      );

      this.executeCommand(MessageCommand.SetAuthToken, authToken);
      this.executeCommand(MessageCommand.UpdateConfig, {
         key: 'aiModel',
         value: aiModel,
      });
      this.executeCommand(MessageCommand.UpdateConfig, {
         key: 'maxAIChatTokens',
         value: maxTokens,
      });
      this.executeCommand(MessageCommand.UpdateConfig, {
         key: 'aiLenses',
         value: aiLenses,
      });
      this.executeCommand(MessageCommand.UpdateConfig, {
         key: 'openAIApiKey',
         value: EncryptionUtils.decrypt(openAIApiKey),
      });
   }

   private initWebviewAuth(): void {
      AuthService.TokenEventEmitter.event((token) => {
         this.executeCommand(MessageCommand.SetAuthToken, token);
      });
   }

   private dispose(): void {
      this.disposables.forEach((d) => d.dispose());
      this.disposables.length = 0;
   }
}
