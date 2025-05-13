/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ResponsePayload } from '@models/api';
import { AILensInfoDto } from '@models/api/ai-lens.model';
import { IAILensDataService } from '@models/data-services';
import { IHttpService, IOutputChannelService } from '@models/service';

export class AILensDataService implements IAILensDataService {
   constructor(
      private httpService: IHttpService,
      private outputChannelService: IOutputChannelService
   ) {}

   public getAILenses(): Promise<AILensInfoDto[]> {
      return this.httpService
         .get<ResponsePayload<AILensInfoDto[]>>('/ailens/me/all')
         .then((payload: ResponsePayload<AILensInfoDto[]>) => payload.data)
         .catch((error) => {
            this.outputChannelService.appendLine(error);
            return Promise.reject(error);
         });
   }

   public getAILensVersion(): Promise<number> {
      return this.httpService.get<number>('/ailens/version');
   }

   public setIsAILensEnabled(
      aiLensId: string,
      isEnabled: boolean
   ): Promise<void> {
      return this.httpService
         .put<void>(`/ailens/me/${aiLensId}/enabled`, { isEnabled })
         .catch((error) => {
            this.outputChannelService.appendLine(error);
            return Promise.reject(error);
         });
   }
}
