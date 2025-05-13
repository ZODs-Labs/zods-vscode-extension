/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DocumentSymbol, SymbolKind } from 'vscode';

import { ILanguageSymbolMatcher } from './symbol-matcher.types';

/**
 * Common-specific implementation of the ILanguageSymbolMatcher interface.
 * Provides methods to identify common symbol types for testability.
 */
export class CommonSymbolMatcher implements ILanguageSymbolMatcher {
   /**
    * Determines if a symbol is testable.
    * @param {DocumentSymbol} symbol - The symbol to check.
    * @param {SymbolKind[]} symbolKinds - Array of symbol kinds considered testable.
    * @return {boolean} - True if the symbol is testable, false otherwise.
    */
   isFunctionSymbol(
      symbol: DocumentSymbol,
      symbolKinds: SymbolKind[]
   ): boolean {
      return symbolKinds.includes(symbol.kind);
   }
}
