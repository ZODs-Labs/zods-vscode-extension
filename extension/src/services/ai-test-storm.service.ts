/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { AxiosError, CancelToken } from 'axios';

import { ResponsePayload } from '@models/api';
import {
   IAITestStormService,
   IAuthService,
   IHttpService,
   IOutputChannelService,
} from '@models/service';
import {
   AIModel,
   AITestCaseDto,
   AITestDto,
   GenerateUnitTestCasesInputDto,
   GenerateUnitTestInputDto,
} from '@zods/core';

export class AITestStormService implements IAITestStormService {
   constructor(
      private authService: IAuthService,
      private httpService: IHttpService,
      private outputChannelService: IOutputChannelService
   ) {}

   public generateTestCasesWithAI(
      inputDto: GenerateUnitTestCasesInputDto,
      cancelToken?: CancelToken
   ): Promise<AITestCaseDto[]> {
      if (!this.authService.isAuthenticated()) {
         this.authService.promptForSignIn();
         return Promise.reject();
      }

      const aiModel = inputDto.aiModel;
      const endpoint = this.getTestCasesEndpoint(aiModel);

      return this.httpService
         .post<ResponsePayload<AITestCaseDto[]>>(
            endpoint,
            inputDto,
            {},
            cancelToken
         )
         .then((response: ResponsePayload<AITestCaseDto[]>) => {
            return response.data;
         })
         .catch((errRes: AxiosError) => {
            const error = errRes.response || errRes;

            this.logChannel('Failed to generate test cases with AI');
            this.logChannel(error as any);
            return Promise.reject(error);
         });
   }

   public generateUnitTestWithAI(
      inputDto: GenerateUnitTestInputDto,
      cancelToken?: CancelToken
   ): Promise<AITestDto> {
      if (!this.authService.isAuthenticated()) {
         this.authService.promptForSignIn();
         return Promise.reject();
      }

      const aiModel = inputDto.aiModel;
      const endpoint = this.getUnitTestEndpoint(aiModel);

      return this.httpService
         .post<ResponsePayload<AITestDto>>(endpoint, inputDto, {}, cancelToken)
         .then((response: ResponsePayload<AITestDto>) => {
            return response.data;
         })
         .catch((errRes: AxiosError) => {
            const error = errRes.response || errRes;

            this.logChannel('Failed to generate unit tests.');
            this.logChannel(error as any);
            return Promise.reject(error);
         });
   }

   private getTestCasesEndpoint(aiModel: string): string {
      switch (aiModel) {
         case AIModel.GPT4oMini:
            return '/gpt/4-mini/code/test/cases';
         case AIModel.GPT4o:
            return '/gpt/4/code/test/cases';
         default:
            throw new Error(`Invalid AI model: ${aiModel}`);
      }
   }

   private getUnitTestEndpoint(aiModel: string): string {
      switch (aiModel) {
         case AIModel.GPT4oMini:
            return '/gpt/4-mini/code/test';
         case AIModel.GPT4o:
            return '/gpt/4/code/test';
         default:
            throw new Error(`Invalid AI model: ${aiModel}`);
      }
   }

   private logChannel(message: string): void {
      const formattedMessage = `[ZODs][AI Test Storm]: ${message}`;
      this.outputChannelService.appendLine(formattedMessage);
   }
}
