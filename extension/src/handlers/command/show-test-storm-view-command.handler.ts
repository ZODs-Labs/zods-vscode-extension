/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DocumentSymbol, Uri } from 'vscode';

import { IShowTestStormViewCommandHandler } from '@models/handlers';
import {
   ITestStormWebViewManager,
   TestStormWebViewPanelMetadata,
} from '@models/managers';
import { INotificationService, IVSCodeService } from '@models/service';
import { Command, TestStormWebViewMessageCommand } from '@zods/core';

import path = require('path');

export class ShowTestStormViewCommandHandler
   implements IShowTestStormViewCommandHandler
{
   id: string;

   constructor(
      private vscodeService: IVSCodeService,
      private testStormWebViewManager: ITestStormWebViewManager,
      private notificationService: INotificationService
   ) {
      this.id = Command.ShowTestStormView;
   }

   public handle(
      documentUri: Uri,
      symbol: DocumentSymbol
   ): void | Promise<void> {
      const workspaceFolders = this.vscodeService.workspace.workspaceFolders;
      const workspaceFolder = workspaceFolders?.length
         ? workspaceFolders[0]
         : null;
      let relativePath = documentUri.path;
      const fileName = path.basename(documentUri.path);

      if (workspaceFolder) {
         const workspaceRoot = workspaceFolder.uri;
         relativePath = path.relative(workspaceRoot.path, documentUri.path);
      }

      const methodCode = this.vscodeService.getTextFromDocumentRange(
         documentUri,
         symbol.range
      );

      const fileExtension = path.extname(relativePath).replace('.', '');

      if (!methodCode) {
         this.notificationService.showWarning('Method is empty.');
         return;
      }

      const webviewId = `${symbol.name} - ${fileName}`;
      const metadata: TestStormWebViewPanelMetadata = {
         testMethodFileUri: documentUri,
      };

      const webview = this.testStormWebViewManager.createWebviewPanel(
         webviewId,
         metadata
      );

      webview.postMessage({
         command: TestStormWebViewMessageCommand.SetContextCode,
         data: methodCode,
      });

      webview.postMessage({
         command: TestStormWebViewMessageCommand.SetFileExtension,
         data: fileExtension,
      });
   }
}
