/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { TextDocument, CodeLens, DocumentSymbol } from 'vscode';

import aiLensTargetKindMapToSymbolKinds from '@common/constants/ai-lens-target-kind.map';
import { DocumentUtils } from '@common/utils';
import { ICommonCodeLensProvider } from '@models/code-lens';
import { AILensTargetKind, Command } from '@zods/core';

import BaseAbstractLensCodeProvider from './base-code-lens.provider';

export class CommonCodeLensProvider
   extends BaseAbstractLensCodeProvider
   implements ICommonCodeLensProvider
{
   languages = [
      'javascript',
      'typescript',
      'javascriptreact',
      'typescriptreact',
      'csharp',
      'python',
      'java',
      'go',
      'php',
      'ruby',
      'swift',
      'rust',
      'kotlin',
   ];

   loadLenses(): void {}

   async createCodeLenses(document: TextDocument): Promise<CodeLens[]> {
      const matchingSymbols =
         aiLensTargetKindMapToSymbolKinds[AILensTargetKind.Method];

      return DocumentUtils.findAllMatchingSymbols(document, matchingSymbols)
         .then((symbols: DocumentSymbol[] | undefined) =>
            (symbols || []).map(
               (symbol: DocumentSymbol) =>
                  new CodeLens(symbol.range, {
                     title: 'AI Test Storm',
                     tooltip:
                        'Generate tests for this method using AI Test Storm.',
                     command: Command.ShowTestStormView,
                     arguments: [document.uri, symbol],
                  })
            )
         )
         .catch((e) => {
            this.logOutputMessage(
               'Failed to retrieve method symbols for document to provide common CodeLens.'
            );
            this.logOutputMessage(JSON.stringify(e));

            return [];
         });
   }

   refreshCodeLenses(): Promise<void> {
      throw new Error('Method not implemented.');
   }
}
