/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DocumentSymbol, SymbolKind, TextDocument } from 'vscode';
import * as vscode from 'vscode';

export abstract class DocumentUtils {
   /**
    * Flattens a hierarchy of DocumentSymbols into an array of symbols.
    * It only includes symbols that are methods, functions, or constructors.
    *
    * @param {DocumentSymbol[]} symbols - The array of DocumentSymbols to flatten.
    * @returns {DocumentSymbol[]} A flattened array of DocumentSymbols representing methods.
    */
   static flattenDocumentSymbols(
      symbols: DocumentSymbol[],
      symbolKinds: SymbolKind[]
   ): DocumentSymbol[] {
      const flattenedSymbols: DocumentSymbol[] = [];
      const stack: DocumentSymbol[] = [...symbols];

      while (stack.length > 0) {
         const currentSymbol = stack.pop()!;
         if (symbolKinds.includes(currentSymbol.kind)) {
            flattenedSymbols.push(currentSymbol);
         }
         if (currentSymbol.children && currentSymbol.children.length > 0) {
            // Add children to the stack for further processing.
            stack.push(...currentSymbol.children);
         }
      }

      return flattenedSymbols;
   }

   /**
    * Finds all symbols in the currently active document that match the provided symbol kinds.
    *
    * @param {TextDocument} document - The document to find symbols in.
    * @param {SymbolKind[]} symbolKinds - The kinds of symbols to find.
    * @returns {Promise<DocumentSymbol[] | undefined>} A Promise that resolves to an array of DocumentSymbols or undefined.
    */
   static async findAllMatchingSymbols(
      document: TextDocument,
      symbolKinds: SymbolKind[]
   ): Promise<DocumentSymbol[] | undefined> {
      if (vscode.window.activeTextEditor) {
         const symbols = (await vscode.commands.executeCommand(
            'vscode.executeDocumentSymbolProvider',
            document.uri
         )) as DocumentSymbol[];

         if (!symbols) {
            console.error('Could not obtain document symbols.');
            return undefined;
         }

         return DocumentUtils.flattenDocumentSymbols(symbols, symbolKinds);
      }

      console.error('No active text editor found.');
      return undefined;
   }
}
