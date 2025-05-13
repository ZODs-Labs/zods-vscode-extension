/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Range, Uri } from 'vscode';

import { AIChatCommand } from '@common/enums';
import { IAIChatCommandHandler } from '@models/handlers';
import { IAIChatWebViewProvider } from '@models/providers/view';
import {
   IVSCodeService,
   IOutputChannelService,
   INotificationService,
} from '@models/service';
import { Command, MessageCommand } from '@zods/core';

export class AIChatCommandHandler implements IAIChatCommandHandler {
   id = Command.AIChatCommand;

   constructor(
      private vscodeService: IVSCodeService,
      private outputChannelService: IOutputChannelService,
      private aiChatWebviewProvider: IAIChatWebViewProvider,
      private notificationService: INotificationService
   ) {}

   async handle(
      chatCommand: AIChatCommand,
      documentUri: Uri,
      range: Range,
      chatCommandMetadata?: any
   ): Promise<void> {
      if (!documentUri) {
         this.logOutputMessage('No document provided.');
      }

      const methodText = this.vscodeService.getTextFromDocumentRange(
         documentUri,
         range
      );

      if (!methodText) {
         this.notificationService.showWarning('Method is empty.');
         return;
      }

      this.aiChatWebviewProvider.ensureWebViewIsOpen().then(() => {
         this.aiChatWebviewProvider.postMessageToView(
            MessageCommand.AIChatCommand,
            methodText,
            chatCommand,
            chatCommandMetadata
         );
      });
   }

   private logOutputMessage(message: string): void {
      this.outputChannelService.appendLine(
         `[ZODs][AI Chat Command Handler] ${message}`
      );
   }
}
