/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DocumentSymbol, SymbolKind, TextDocument } from 'vscode';

export interface ILanguageSymbolMatcher {
   isFunctionSymbol(
      symbol: DocumentSymbol,
      symbolKinds: SymbolKind[],
      document: TextDocument
   ): boolean;
}
