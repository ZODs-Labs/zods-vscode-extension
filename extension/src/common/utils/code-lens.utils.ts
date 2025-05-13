/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { SymbolKind } from 'vscode';

import aiLensTargetKindMapToSymbolKinds from '@common/constants/ai-lens-target-kind.map';
import { AILensTargetKind } from '@common/enums/code-lens-target-kind.enum';

export abstract class CodeLensUtils {
   /**
    * Checks if the provided symbol kind matches the target AI code lens kind.
    *
    * @param {SymbolKind} symbolKind - The symbol kind to check.
    * @param {AILensTargetKind} aiCodeLensTargetKind - The AI code lens target kind for comparison.
    * @returns {boolean} True if the symbol kind is a match for the AI code lens target kind, otherwise false.
    */
   static isSymbolKindIncludedInAiCodeLensTargetKind(
      symbolKind: SymbolKind,
      aiCodeLensTargetKind: AILensTargetKind
   ): boolean {
      // If the target kind does not exist in the map, we consider it a non-match by default.
      if (!(aiCodeLensTargetKind in aiLensTargetKindMapToSymbolKinds)) {
         return false;
      }

      // Retrieve the list of symbol kinds associated with the target kind and check for inclusion.
      const associatedSymbolKinds =
         aiLensTargetKindMapToSymbolKinds[aiCodeLensTargetKind] || [];
      return associatedSymbolKinds.includes(symbolKind);
   }
}
