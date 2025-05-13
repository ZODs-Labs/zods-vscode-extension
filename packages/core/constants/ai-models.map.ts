import { AIModel } from '../enums/ai-models.enum';

export const AIModelsMap: {
   [key: string]: string;
} = {
   [AIModel.GPT41]: 'gpt-4.1',
   [AIModel.O3]: 'o3',
   [AIModel.O4Mini]: 'o4-mini',
};
