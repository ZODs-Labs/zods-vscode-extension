/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

export abstract class CodeUtils {
   /**
    * Removes Markdown code block syntax (```), retaining the code content.
    * This function assumes that code blocks may optionally start with a language identifier.
    * @param text The string containing Markdown code blocks.
    * @return A new string with Markdown code block syntax removed, but code content preserved.
    */
   static removeMarkdownCodeBlockSyntax(text: string): string {
      return text
         .replace(/```[\w\W]*?\n([\w\W]*?)```/g, '$1') // Capture and retain the content between code block syntax
         .trim(); // Trim leading and trailing whitespace
   }
}
