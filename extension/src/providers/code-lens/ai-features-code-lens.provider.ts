/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { CodeLens, DocumentSymbol, SymbolKind, TextDocument } from 'vscode';

import aiLensTargetKindMapToSymbolKinds from '@common/constants/ai-lens-target-kind.map';
import { AIChatCommand } from '@common/enums';
import { DocumentUtils } from '@common/utils';
import { CodeLensUtils } from '@common/utils/code-lens.utils';
import config from '@config/constants';
import { AuthService } from '@core/services';
import { AICodeLens, IAIFeaturesCodeLensProvider } from '@models/code-lens';
import {
   IAILensSyncService,
   IOutputChannelService,
   IVSCodeService,
} from '@models/service';
import { IGlobalStateStore } from '@models/store';
import { Command } from '@zods/core';

import BaseAbstractLensCodeProvider from './base-code-lens.provider';

export class AIFeaturesCodeLensProvider
   extends BaseAbstractLensCodeProvider
   implements IAIFeaturesCodeLensProvider
{
   languages = [
      'javascript',
      'typescript',
      'javascriptreact',
      'typescriptreact',
      'csharp',
      'c',
      'cpp',
      'objective-c',
      'objective-cpp',
      'css',
      'scss',
      'less',
      'html',
      'python',
      'java',
      'php',
      'ruby',
      'go',
      'swift',
      'kotlin',
      'rust',
      'scala',
      'r',
      'dart',
      'lua',
   ];

   loadingLensMessage = 'ZODs: Loading AI Lenses';

   private get enabledAiLenses(): AICodeLens[] {
      return this.aiLenses.filter((aiLens: AICodeLens) => aiLens.isEnabled);
   }

   constructor(
      outputChannelService: IOutputChannelService,
      vscodeService: IVSCodeService,
      private aiLensSyncService: IAILensSyncService,
      private globalStateStore: IGlobalStateStore
   ) {
      super(outputChannelService, vscodeService);
      this.setAuthEventListeners();
      this.setGlobalStateListeners();
   }

   loadLenses(): void {
      const storedLenses = this.vscodeService.context.globalState.get<
         AICodeLens[]
      >(config.AI_LENSES_STORAGE_KEY);

      const builtInLensesDisabled =
         this.vscodeService.context.globalState.get<boolean>(
            config.AI_LENSES_BUILT_IN_DISABLED_STORAGE_KEY
         );

      this.aiLenses = storedLenses ?? [];

      if (builtInLensesDisabled) {
         this.aiLenses = this.aiLenses.filter(
            (aiLens: AICodeLens) => !aiLens.isBuiltIn
         );
      }
   }

   refreshCodeLenses(): Promise<void> {
      return this.aiLensSyncService.manualSync().then(() => {
         this.loadLenses();
         this.onDidChangeCodeLensesEmitter.fire();
      });
   }

   async createCodeLenses(document: TextDocument): Promise<CodeLens[]> {
      const enabledAiLenses = this.enabledAiLenses;

      const aiCodeLensSymbolKinds = enabledAiLenses.flatMap(
         (aiLens: AICodeLens) =>
            aiLensTargetKindMapToSymbolKinds[aiLens.targetKind]
      );
      const uniqueSymbolKinds = [...new Set(aiCodeLensSymbolKinds)];

      return DocumentUtils.findAllMatchingSymbols(document, uniqueSymbolKinds)
         .then(
            (methodSymbols: DocumentSymbol[] | undefined) =>
               methodSymbols?.flatMap((symbol: DocumentSymbol) =>
                  this.getSymbolKindAICodeLenses(
                     enabledAiLenses,
                     symbol.kind
                  ).map(
                     (aiLens: AICodeLens) =>
                        new CodeLens(symbol.range, {
                           title: aiLens.name,
                           tooltip: aiLens.tooltip,
                           command: Command.AIChatCommand,
                           arguments: [
                              AIChatCommand.AICodeLens,
                              document.uri,
                              symbol.range,
                              {
                                 lensId: aiLens.id,
                                 lensName: aiLens.name,
                              },
                           ],
                        })
                  )
               ) ?? []
         )
         .catch((e) => {
            this.logOutputMessage(
               'Failed to retrieve method symbols for document to provide AI CodeLens'
            );
            this.logOutputMessage(JSON.stringify(e));

            return [];
         });
   }

   private getSymbolKindAICodeLenses(
      aiCodeLenses: AICodeLens[],
      symbolKind: SymbolKind
   ): AICodeLens[] {
      return aiCodeLenses.filter((aiLens: AICodeLens) =>
         CodeLensUtils.isSymbolKindIncludedInAiCodeLensTargetKind(
            symbolKind,
            aiLens.targetKind
         )
      );
   }

   private setAuthEventListeners(): void {
      AuthService.SuccessfulAuthenticationEventEmitter.event(() => {
         this.refreshCodeLenses();
      });
   }

   private setGlobalStateListeners(): void {
      this.globalStateStore.onDidChange(
         config.AI_LENSES_BUILT_IN_DISABLED_STORAGE_KEY,
         () => {
            this.refreshCodeLenses();
         }
      );
   }
}
