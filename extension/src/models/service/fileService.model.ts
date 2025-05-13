import { Uri } from 'vscode';

export interface IFileService {
   /**
    * Writes a file to the workspace.
    * If the file already exists, it will be overwritten.
    *
    * @param fileName The name of the file to be created.
    * @param fullPath The full path of the file to be created.
    * @param content The content to be written to the file.
    * @returns A promise that resolves to the path of the created file or rejects with an error message.
    */
   writeFile(
      fileUri: Uri,
      content: string,
      options?: {
         openFile: boolean;
      }
   ): Promise<void>;

   /**
    * Appends content to an existing file and optionally opens the file.
    * @param uri The URI of the file to append to.
    * @param content The content to append.
    * @param options Optional parameters for additional actions.
    * @returns A promise that resolves when the content has been appended.
    */
   appendToFile(
      uri: Uri,
      content: string,
      options?: { openFile: boolean; selectAppendedContent: boolean }
   ): Promise<void>;

   /**
    * Opens a file in the VS Code editor.
    *
    * @param filePath The path of the file to be opened.
    * @returns A promise that resolves when the file is opened, or rejects with an error message.
    */
   openFile(filePath: string): Promise<void>;

   /**
    * Reads the entire content of a file from a given URI.
    * @param uri The URI of the file to read.
    * @returns A promise that resolves to the content of the file as a string.
    */
   readFileContent(uri: Uri): Promise<string>;
}
