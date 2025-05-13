/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { SymbolKind } from 'vscode';

import { AILensTargetKind } from '@common/enums/code-lens-target-kind.enum';

const aiLensTargetKindMapToSymbolKinds = {
   [AILensTargetKind.File]: [SymbolKind.File],
   [AILensTargetKind.Class]: [SymbolKind.Class],
   [AILensTargetKind.Property]: [SymbolKind.Property],
   [AILensTargetKind.Variable]: [SymbolKind.Variable],
   [AILensTargetKind.Method]: [
      SymbolKind.Method,
      SymbolKind.Function,
      SymbolKind.Constructor,
   ],
};

export default aiLensTargetKindMapToSymbolKinds;
