/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Range, Uri } from 'vscode';

import { ISetCodeAIChatContextCommandHandler } from '@models/handlers';
import { IAIChatWebViewProvider } from '@models/providers/view';
import { INotificationService, IVSCodeService } from '@models/service';
import { Command, MessageCommand } from '@zods/core';

export class SetCodeAIChatContextCommandHandler
   implements ISetCodeAIChatContextCommandHandler
{
   id: string;

   constructor(
      private vscodeService: IVSCodeService,
      private aiChatViewProvider: IAIChatWebViewProvider,
      private notificationService: INotificationService
   ) {
      this.id = Command.SetSelectedCodeAsAIChatContext;
   }

   public handle(documentUri?: Uri, range?: Range): void | Promise<void> {
      let code = '';

      if (documentUri && range) {
         // If documentUri and range are provided, get the code from the document.
         // Here the command is triggered from the CodeLens
         code = this.vscodeService.getTextFromDocumentRange(documentUri, range);

         if (!code) {
            this.notificationService.showWarning('Method is empty.');
            return;
         }
      } else {
         // If documentUri and range are not provided, get the code from the
         // selected text in the editor.
         // Here the command is triggered from the context menu or the command palette
         code = this.getSelectedCode();
      }

      this.aiChatViewProvider.ensureWebViewIsOpen();
      this.aiChatViewProvider.postMessageToView(
         MessageCommand.SetCodeAsAIChatContext,
         code
      );
   }

   private getSelectedCode(): string {
      const editor = this.vscodeService.window.activeTextEditor;
      if (editor) {
         const selection = editor.selection;
         const text = editor.document.getText(selection);
         return text;
      }

      return '';
   }
}
