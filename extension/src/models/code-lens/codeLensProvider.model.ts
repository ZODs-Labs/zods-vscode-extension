import { CodeLens, CodeLensProvider, TextDocument } from 'vscode';

import { AICodeLens } from './code-lens.types';

export interface ICodeLensProvider extends CodeLensProvider {
   /**
    * List of languages that the provider supports.
    */
   languages: string[];

   /**
    * Collection of AI CodeLens that will be provided by the provider.
    */
   aiLenses: AICodeLens[];

   /**
    * Message to be displayed within the status bar when loading the CodeLens.
    */
   loadingLensMessage: string;

   /**
    * Loads the CodeLenses that will be provided by the provider.
    */
   loadLenses(): void;

   /**
    * Refreshes the CodeLenses that will be provided by the provider.
    */
   refreshCodeLenses(): Promise<void>;

   /**
    * Returns a list of created code lenses for the given document.
    * @param document The document in which the command was invoked.
    */
   createCodeLenses(document: TextDocument): Promise<CodeLens[]>;
}
