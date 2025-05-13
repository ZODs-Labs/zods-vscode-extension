import { AIChatCommand } from '@common/enums';
import { AILensTargetKind } from '@common/enums/code-lens-target-kind.enum';
import { Command } from '@zods/core';

export interface AICodeLens {
   id: string;
   name: string;
   tooltip: string;
   targetKind: AILensTargetKind;
   isEnabled: boolean;
   isBuiltIn: boolean;
   command?: Command;
   chatCommand?: AIChatCommand;
}
