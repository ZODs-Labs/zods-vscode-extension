import { AILensTargetKind } from '@common/enums/code-lens-target-kind.enum';

export interface AILensInfoDto {
   id: string;
   name: string;
   tooltip: string;
   targetKind: AILensTargetKind;
   isEnabled: boolean;
}
