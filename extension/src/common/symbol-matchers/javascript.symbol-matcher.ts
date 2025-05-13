/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DocumentSymbol, SymbolKind, TextDocument } from 'vscode';

import { ILanguageSymbolMatcher } from './symbol-matcher.types';

/**
 * JavaScript-specific implementation of the ILanguageSymbolMatcher interface.
 * Provides methods to identify various JavaScript symbol types.
 */
export class JavaScriptSymbolMatcher implements ILanguageSymbolMatcher {
   isFunctionSymbol(
      symbol: DocumentSymbol,
      symbolKinds: SymbolKind[],
      document: TextDocument
   ): boolean {
      if (symbol.name.endsWith(' callback') || '<function>' === symbol.name) {
         return false;
      }

      if (symbol.kind === SymbolKind.Variable) {
         const asyncFunctionRegex =
            /(?:async\s*)?(?:(?:function\s*\([\s\S]*?\)\s*(?::\s*[A-Za-z_$][A-Za-z0-9_$]*\s*)?{[\s\S]*?})|(?:\([\s\S]*?\)\s*(?::\s*[<?A-Za-z_>?$][<?A-Za-z0-9_>?$]*\s*)?=>\s*{[\s\S]*?})|(?:\([\s\S]*?\)\s*(?::\s*[<?A-Za-z_>?$][<?A-Za-z0-9_>?$]*\s*)?=>[\s\S]*))/;
         const regex = new RegExp(
            `${symbol.name}\\s*=\\s*${asyncFunctionRegex.source}`
         );
         const symbolText = document.getText(symbol.range);

         return regex.test(symbolText);
      }

      return symbolKinds.includes(symbol.kind);
   }
}
