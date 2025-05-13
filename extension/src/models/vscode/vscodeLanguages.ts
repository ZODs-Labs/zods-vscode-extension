import {
   DocumentSelector,
   CompletionItemProvider,
   Disposable,
   languages,
   CodeLensProvider,
} from 'vscode';

export interface IVSCodeLanguages {
   /**
    * Register a completion provider.
    *
    * Multiple providers can be registered for a language. In that case providers are sorted
    * by their {@link languages.match score} and groups of equal score are sequentially asked for
    * completion items. The process stops when one or many providers of a group return a
    * result. A failing provider (rejected promise or exception) will not fail the whole
    * operation.
    *
    * A completion item provider can be associated with a set of `triggerCharacters`. When trigger
    * characters are being typed, completions are requested but only from providers that registered
    * the typed character. Because of that trigger characters should be different than {@link LanguageConfiguration.wordPattern word characters},
    * a common trigger character is `.` to trigger member completions.
    *
    * @param selector A selector that defines the documents this provider is applicable to.
    * @param provider A completion provider.
    * @param triggerCharacters Trigger completion when the user types one of the characters.
    * @return A {@link Disposable} that un-registers this provider when being disposed.
    */
   registerCompletionItemProvider(
      selector: DocumentSelector,
      provider: CompletionItemProvider,
      ...triggerCharacters: string[]
   ): Disposable;

   /**
    * Register a code lens provider.
    *
    * Multiple providers can be registered for a language. In that case providers are asked in
    * parallel and the results are merged. A failing provider (rejected promise or exception) will
    * not cause a failure of the whole operation.
    *
    * @param selector A selector that defines the documents this provider is applicable to.
    * @param provider A code lens provider.
    * @return A {@link Disposable} that unregisters this provider when being disposed.
    */
   registerCodeLensProvider(
      selector: DocumentSelector,
      provider: CodeLensProvider
   ): Disposable;
}
