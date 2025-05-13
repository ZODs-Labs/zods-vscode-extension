import { AILensInfoDto } from '@models/api/ai-lens.model';

export interface IAILensDataService {
   getAILenses(): Promise<AILensInfoDto[]>;
   setIsAILensEnabled(aiLensId: string, isEnabled: boolean): Promise<void>;
}
