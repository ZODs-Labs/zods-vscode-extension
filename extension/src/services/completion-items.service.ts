/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
   TextDocument,
   Position,
   CancellationToken,
   CompletionContext,
   CompletionItem,
   CompletionItemKind,
   SnippetString,
   MarkdownString,
   Disposable,
} from 'vscode';

import { ISnippet } from '@models/api';
import { ICompletionItemService, IVSCodeService } from '@models/service';

export class CompletionItemsService implements ICompletionItemService {
   private readonly registeredProviders: Disposable[] = [];

   constructor(private vscodeService: IVSCodeService) {}

   registerCompletionItems(snippets: ISnippet[]): void {
      // Clear any existing providers
      this.clearProviders();

      const languageSnippets = this.groupSnippetsByLanguage(snippets);
      const getSnippetCompletionItem = this.getSnippetCompletionItem;

      for (const language in languageSnippets) {
         const langs = language.split(', ');

         const provider = this.vscodeService.languages.registerCompletionItemProvider(
            langs,
            {
               provideCompletionItems(
                  document: TextDocument,
                  position: Position,
                  token: CancellationToken,
                  context: CompletionContext
               ) {
                  const completionItems = languageSnippets[language].map(
                     getSnippetCompletionItem
                  );

                  // return all completion items as array
                  return completionItems;
               },
            },
            ''
         );

         this.vscodeService.context.subscriptions.push(provider);
         this.registeredProviders.push(provider);
      }
   }

   private groupSnippetsByLanguage(snippets: ISnippet[]) {
      const snippetsByLanguage: { [language: string]: ISnippet[] } = {};
      snippets.forEach((snippet) => {
         if (!snippetsByLanguage[snippet.language]) {
            snippetsByLanguage[snippet.language] = [];
         }

         snippetsByLanguage[snippet.language].push(snippet);
      });

      return snippetsByLanguage;
   }

   private getSnippetCompletionItem(snippet: ISnippet): CompletionItem {
      const snippetCompletion = new CompletionItem(snippet.trigger);
      snippetCompletion.kind = CompletionItemKind.Snippet;
      snippetCompletion.insertText = new SnippetString(snippet.codeSnippet);
      snippetCompletion.detail = snippet.name;
      snippetCompletion.documentation = new MarkdownString(snippet.description);
      return snippetCompletion;
   }

   private clearProviders(): void {
      this.registeredProviders.forEach((provider) => provider.dispose());
      this.registeredProviders.length = 0;
   }
}

export default CompletionItemsService;
