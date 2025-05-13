/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Disposable, WebviewView } from 'vscode';
import * as vscode from 'vscode';

import { VsCodeConfigKeys } from '@config/vscode-config.constants';
import { EncryptionUtils } from '@core/encryption';
import { IWebViewListener } from '@models/providers/view';
import { MessageCommand } from '@zods/core';

export class AIChatConfigurationWebViewListener implements IWebViewListener {
   register(view: WebviewView): Disposable {
      return vscode.workspace.onDidChangeConfiguration(
         (event: vscode.ConfigurationChangeEvent) => {
            if (event.affectsConfiguration(VsCodeConfigKeys.AIModel)) {
               const aiModel = vscode.workspace
                  .getConfiguration()
                  .get(VsCodeConfigKeys.AIModel);

               view.webview.postMessage({
                  command: MessageCommand.UpdateConfig,
                  data: {
                     key: 'aiModel',
                     value: aiModel,
                  },
               });
            } else if (
               event.affectsConfiguration(VsCodeConfigKeys.MaxAIChatTokens)
            ) {
               const maxTokens = vscode.workspace
                  .getConfiguration()
                  .get(VsCodeConfigKeys.MaxAIChatTokens);

               view.webview.postMessage({
                  command: MessageCommand.UpdateConfig,
                  data: {
                     key: 'maxAIChatTokens',
                     value: maxTokens,
                  },
               });
            } else if (
               event.affectsConfiguration(VsCodeConfigKeys.OpenAIAPIKey)
            ) {
               const openAIKey = vscode.workspace
                  .getConfiguration()
                  .get(VsCodeConfigKeys.OpenAIAPIKey) as string;

               view.webview.postMessage({
                  command: MessageCommand.UpdateConfig,
                  data: {
                     key: 'openAIApiKey',
                     value: EncryptionUtils.decrypt(openAIKey),
                  },
               });
            }
         }
      );
   }

   private getFileExtension(fileName?: string): string {
      return fileName?.split('.').pop() || '';
   }
}
