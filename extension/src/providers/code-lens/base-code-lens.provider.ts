/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
   CancellationToken,
   CodeLens,
   Event,
   EventEmitter,
   ProgressLocation,
   ProviderResult,
   TextDocument,
} from 'vscode';

import { ICodeLensProvider } from '@models/code-lens';
import { IOutputChannelService, IVSCodeService } from '@models/service';

abstract class BaseAbstractLensCodeProvider implements ICodeLensProvider {
   languages: string[] = [];
   aiLenses: any[] = [];
   loadingLensMessage = 'ZODs: Loading CodeLens';

   protected onDidChangeCodeLensesEmitter: EventEmitter<void> =
      new EventEmitter<void>();
   public readonly onDidChangeCodeLenses: Event<void> =
      this.onDidChangeCodeLensesEmitter.event;

   constructor(
      protected outputChannelService: IOutputChannelService,
      protected vscodeService: IVSCodeService
   ) {
      this.provideCodeLenses = this.provideCodeLenses.bind(this);
   }

   abstract loadLenses(): void;
   abstract createCodeLenses(document: TextDocument): Promise<CodeLens[]>;
   abstract refreshCodeLenses(): Promise<void>;

   provideCodeLenses(
      document: TextDocument,
      token: CancellationToken
   ): Thenable<any> {
      this.loadLenses();

      return this.vscodeService.window.withProgress(
         {
            location: ProgressLocation.Window,
            cancellable: false,
            title: 'ZODs: Loading CodeLens',
         },
         async (progress) => {
            // Check if cancellation has been requested
            if (token.isCancellationRequested) {
               return [];
            }

            progress.report({ increment: 0 });
            const aiCodeLenses = await this.createCodeLenses(document);
            progress.report({ increment: 100 });

            // Again, check for cancellation
            if (token.isCancellationRequested) {
               return [];
            }

            return [...aiCodeLenses];
         }
      );
   }

   resolveCodeLens?(
      codeLens: CodeLens,
      token: CancellationToken
   ): ProviderResult<CodeLens> {
      if (token.isCancellationRequested) {
         return null;
      }

      return codeLens;
   }

   protected logOutputMessage(message: string): void {
      this.outputChannelService.appendLine(`[ZODs][CodeLens] ${message}`);
   }
}

export default BaseAbstractLensCodeProvider;
