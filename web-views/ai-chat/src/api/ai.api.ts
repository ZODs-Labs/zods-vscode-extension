import { AIModel, AIModelsMap } from '@zods/core';

import { ENV } from '../env';

export abstract class GptApi {
   static getCodeCompletion(
      chatId: string,
      prompt: string,
      contextCode: string,
      fileExtension: string,
      aiModel: string,
      maxTokens: number,
      apiKey: string,
      authToken: string,
      abortSignal: AbortSignal
   ): Promise<Response> {
      aiModel = aiModel ? AIModelsMap[aiModel] : AIModelsMap[AIModel.GPT4o];
      const gptVersion = this.getGptVersionFromModel(aiModel);

      return fetch(
         `${this.getBaseAiAPIUrl(apiKey, gptVersion)}/code/completion`,
         {
            method: 'POST',
            signal: abortSignal,
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
               chatId,
               prompt,
               contextCode,
               fileExtension,
               aiModel,
               maxTokens,
               apiKey,
               streamTokens: true,
            }),
         }
      );
   }

   static getAILensCompletion(
      chatId: string,
      lensId: string,
      contextCode: string,
      fileExtension: string,
      aiModel: string,
      maxTokens: number,
      apiKey: string,
      authToken: string,
      abortSignal: AbortSignal
   ): Promise<Response> {
      aiModel = aiModel ? AIModelsMap[aiModel] : AIModelsMap[AIModel.GPT4o];
      const gptVersion = this.getGptVersionFromModel(aiModel);

      return fetch(`${this.getBaseAiAPIUrl(apiKey, gptVersion)}/code/ai-lens`, {
         method: 'POST',
         signal: abortSignal,
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
         },
         body: JSON.stringify({
            chatId,
            aiLensId: lensId,
            contextCode,
            fileExtension,
            aiModel,
            maxTokens,
            apiKey,
         }),
      });
   }

   private static getGptVersionFromModel(aiModel: string): string | null {
      switch (true) {
         case aiModel.startsWith('gpt-4') && aiModel.includes('mini'):
            return '4-mini';
         case aiModel.startsWith('gpt-4'):
            return '4';
         default:
            return null;
      }
   }

   private static getBaseAiAPIUrl(
      apiKey: string,
      gptVersion: string | null
   ): string {
      let baseUrl = ENV.ApiUrl;

      if (gptVersion) {
         baseUrl += apiKey ? '/gpt/own' : `/gpt/${gptVersion}`;
      }

      return baseUrl;
   }
}
