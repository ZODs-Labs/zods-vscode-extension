/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DocumentSymbol, SymbolKind } from 'vscode';

import { ILanguageSymbolMatcher } from './symbol-matcher.types';

/**
 * Go-specific implementation of the ILanguageSymbolMatcher interface.
 * This class will handle the identification of Go language symbols that are testable.
 */
export class GoSymbolMatcher implements ILanguageSymbolMatcher {
   name: string = 'go';

   /**
    * Determines if a Go language symbol is testable.
    * @param {DocumentSymbol} symbol - The symbol to check for testability.
    * @param {SymbolKind[]} symbolKinds - Array of symbol kinds considered testable.
    * @return {boolean} - True if the symbol is testable, false otherwise.
    */
   isTestableSymbol(
      symbol: DocumentSymbol,
      symbolKinds: SymbolKind[]
   ): boolean {
      // In Go, methods (functions with receivers) are not considered testable for this matcher.
      return (
         symbolKinds.includes(symbol.kind) && symbol.kind !== SymbolKind.Method
      );
   }

   /**
    * Checks if a symbol is a test function in Go.
    * Currently, this functionality is not implemented for Go.
    * @param {DocumentSymbol} symbol - The symbol to check.
    * @return {boolean} - Always returns false, as Go test functions are not identified by this class.
    */
   isFunctionSymbol(): boolean {
      return false;
   }
}
