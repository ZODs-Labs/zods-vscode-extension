/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Range, Selection, Uri } from 'vscode';

import {
   IFileService,
   INotificationService,
   IOutputChannelService,
   IVSCodeService,
} from '@models/service';
import { StringUtils } from '@shared/utils';

export class FileService implements IFileService {
   constructor(
      private vscodeService: IVSCodeService,
      private notificationService: INotificationService,
      private outputChannelService: IOutputChannelService
   ) {}

   public async writeFile(
      fileUri: Uri,
      content: string,
      options?: {
         openFile: boolean;
      }
   ): Promise<void> {
      try {
         const uint8Array = StringUtils.stringToUint8Array(content);
         await this.vscodeService.workspace.fs.writeFile(fileUri, uint8Array);

         if (options?.openFile) {
            await this.openFile(fileUri.path);
         }
      } catch (err) {
         this.notificationService.showError(
            'Error creating file ',
            JSON.stringify(err)
         );
         this.logError('Error creating file ', err);
         throw new Error(`Error creating file: ${err}`);
      }
   }

   public async appendToFile(
      uri: Uri,
      content: string,
      options?: { openFile: boolean; selectAppendedContent: boolean }
   ): Promise<void> {
      try {
         const oldContent = await this.vscodeService.workspace.fs.readFile(uri);
         const newContent = new TextEncoder().encode(
            new TextDecoder().decode(oldContent) + content
         );
         await this.vscodeService.workspace.fs.writeFile(uri, newContent);

         if (options?.openFile) {
            const document =
               await this.vscodeService.workspace.openTextDocument(uri);
            const editor = await this.vscodeService.window.showTextDocument(
               document
            );

            if (options.selectAppendedContent) {
               const startPos = document.positionAt(oldContent.length);
               const endPos = document.positionAt(
                  oldContent.length + content.length
               );
               editor.selection = new Selection(startPos, endPos);
               editor.revealRange(new Range(startPos, endPos));
            }
         }
      } catch (err) {
         this.notificationService.showError(
            'Error appending to file ',
            JSON.stringify(err)
         );
         this.logError('Error appending to file ', err);
         throw err;
      }
   }

   public openFile(filePath: string): Promise<void> {
      return new Promise((resolve, reject) => {
         const fileUri = Uri.file(filePath);

         this.vscodeService.workspace.openTextDocument(fileUri).then(
            (document) => {
               this.vscodeService.window.showTextDocument(document).then(
                  () => resolve(),
                  (err) => reject(`Error showing file: ${err}`)
               );
            },
            (err) => reject(`Error opening file: ${err}`)
         );
      });
   }

   public async readFileContent(uri: Uri): Promise<string> {
      try {
         const buffer = await this.vscodeService.workspace.fs.readFile(uri);
         return new TextDecoder('utf-8').decode(buffer);
      } catch (err) {
         this.notificationService.showError(
            'Error reading file ',
            JSON.stringify(err)
         );
         this.logError('Error reading file ', err);
         throw new Error(`Error reading file: ${err}`);
      }
   }

   private logError(message: string, error: any): void {
      this.outputChannelService.appendLine(
         `[ZODs] ${message} ${JSON.stringify(error)}`
      );
   }
}
