/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Uri, Webview } from 'vscode';

import {
   IAbstractWebViewManager,
   IWebViewPanelMetadata,
   WebviewPanelMap,
} from '@models/managers';
import {
   IHttpService,
   IOutputChannelService,
   IVSCodeService,
} from '@models/service';
import { ApiRequestWebviewMessage } from '@zods/core';

export abstract class AbstractWebViewManager
   implements IAbstractWebViewManager
{
   protected abstract webviewPanels: WebviewPanelMap;

   protected abstract webviewName: string;

   protected extensionUri: Uri;

   constructor(
      protected vscodeService: IVSCodeService,
      protected outputChannelService: IOutputChannelService,
      protected httpService: IHttpService
   ) {
      this.extensionUri = this.vscodeService.context.extensionUri;
   }

   public abstract createWebviewPanel(
      webviewId: string,
      metadata: IWebViewPanelMetadata
   ): Webview;

   public disposeWebviewPanel(webviewId: string): void {
      // Dispose of any existing webview panels
      this.webviewPanels
         .get(webviewId)
         ?.disposables.forEach((d) => d.dispose());

      // Remove from map
      this.webviewPanels.delete(webviewId);
   }

   protected handleWebviewApiRequest(
      message: ApiRequestWebviewMessage
   ): Promise<any> {
      const { route, method, data } = message;
      if (!route || !method) {
         return Promise.reject(
            'Invalid API request. Route and method are required.'
         );
      }

      return this.httpService.request(route, method, data);
   }

   protected postWebviewPanelMessage(webviewId: string, message: any) {
      const webviewPanel = this.webviewPanels.get(webviewId)?.panel;
      webviewPanel?.webview.postMessage(message);
   }

   protected logOutput(message: string): void {
      const formattedMessage = `[ZODs][${this.webviewName}] ${message}`;
      this.outputChannelService.appendLine(formattedMessage);
   }
}
