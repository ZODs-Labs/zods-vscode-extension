/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Disposable, TextEditor, WebviewView } from 'vscode';
import * as vscode from 'vscode';

import { IWebViewListener } from '@models/providers/view';
import { MessageCommand } from '@zods/core';

export class AIChatActiveFileExtensionWebViewListener
   implements IWebViewListener
{
   register(view: WebviewView): Disposable {
      return vscode.window.onDidChangeActiveTextEditor(
         (editor?: TextEditor) => {
            if (editor) {
               const fileExtension = this.getFileExtension(
                  editor.document.fileName
               );

               // Send file extension to webview
               view?.webview.postMessage({
                  command: MessageCommand.SetFileExtension,
                  data: fileExtension,
               });
            }
         }
      );
   }

   private getFileExtension(fileName?: string): string {
      return fileName?.split('.').pop() || '';
   }
}
