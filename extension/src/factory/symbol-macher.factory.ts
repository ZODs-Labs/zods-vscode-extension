/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
   CommonSymbolMatcher,
   ILanguageSymbolMatcher,
   JavaScriptSymbolMatcher,
} from '@common/symbol-matchers';
import { ISymbolMatcherFactory } from '@models/factory';

export class SymbolMatcherFactory implements ISymbolMatcherFactory {
   private readonly symbolMatchers: Map<string, ILanguageSymbolMatcher>;

   constructor() {
      this.symbolMatchers = new Map<string, ILanguageSymbolMatcher>();
   }

   getSymbolMatcherForLanguage(languageId: string): ILanguageSymbolMatcher {
      let symbolMatcher = this.symbolMatchers.get(languageId);
      if (symbolMatcher) {
         return symbolMatcher;
      }

      symbolMatcher = this.createSymbolMatcherForLanguage(languageId);
      this.symbolMatchers.set(languageId, symbolMatcher);

      return symbolMatcher;
   }

   private createSymbolMatcherForLanguage(
      languageId: string
   ): ILanguageSymbolMatcher {
      switch (languageId) {
         case 'javascriptreact':
         case 'typescriptreact':
         case 'javascript':
         case 'typescript':
            return new JavaScriptSymbolMatcher();
         default:
            return new CommonSymbolMatcher();
      }
   }
}
