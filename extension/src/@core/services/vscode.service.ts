/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Uri } from 'vscode';

import { IVSCodeService } from '@models/service';
import {
   IVSCode,
   IVSCodeEnv,
   IVSCodeWorkspace,
   IVSCodeWindow,
   IVSCodeCommands,
   IVSCodeLanguages,
   IVSCodeAuthentication,
   IVSCodeExtensionContext,
} from '@models/vscode';

export class VSCodeService implements IVSCodeService {
   constructor(
      private vscode: IVSCode,
      private vscContext: IVSCodeExtensionContext
   ) {
      if (!vscode) {
         throw new Error('You must provide a valid IVSCode instance');
      }

      if (!vscContext) {
         throw new Error(
            'You must provide a valid IVSCodeExtensionContext instance'
         );
      }
   }

   public get context(): IVSCodeExtensionContext {
      return this.vscContext;
   }

   public get env(): IVSCodeEnv {
      return this.vscode.env;
   }

   public get version(): string {
      return this.vscode.version;
   }

   public get workspace(): IVSCodeWorkspace {
      return this.vscode.workspace;
   }

   public get window(): IVSCodeWindow {
      return this.vscode.window;
   }

   public get commands(): IVSCodeCommands {
      return this.vscode.commands;
   }

   public get languages(): IVSCodeLanguages {
      return this.vscode.languages;
   }

   public get authentication(): IVSCodeAuthentication {
      return this.vscode.authentication;
   }

   public getTextFromDocumentRange(documentUri: Uri, range: any): string {
      if (!documentUri || !range) {
         return '';
      }

      const editor = this.window.activeTextEditor;

      if (editor && editor.document.uri.toString() === documentUri.toString()) {
         return editor.document.getText(range);
      }

      return '';
   }
}

export default VSCodeService;
