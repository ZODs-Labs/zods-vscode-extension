import { ILanguageSymbolMatcher } from '@common/symbol-matchers';

export interface ISymbolMatcherFactory {
   getSymbolMatcherForLanguage(languageId: string): ILanguageSymbolMatcher;
}
