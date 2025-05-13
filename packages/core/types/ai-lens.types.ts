import { AILensTargetKind } from '../enums';

export interface AICodeLens {
   id: string;
   name: string;
   tooltip: string;
   targetKind: AILensTargetKind;
   isEnabled: boolean;
   isBuiltIn: boolean;
   readonly?: boolean;
}
