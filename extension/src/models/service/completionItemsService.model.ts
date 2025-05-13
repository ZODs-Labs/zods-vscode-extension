import { ISnippet } from '@models/api/snippet.model';

export interface ICompletionItemService {
   /**
    * Register a completion item from a snippet.
    * @param snippets Snippets to register as completion items.
    */
   registerCompletionItems(snippets: ISnippet[]): void;
}
