/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ResponsePayload } from '@models/api';
import { UserSnippetsDto } from '@models/api/snippet.model';
import { ISnippetsDataService } from '@models/data-services';
import { IHttpService, IOutputChannelService } from '@models/service';

export class SnippetsDataService implements ISnippetsDataService {
   constructor(
      private httpService: IHttpService,
      private outputChannelService: IOutputChannelService
   ) {}

   public getUserSnippets(): Promise<UserSnippetsDto> {
      return this.httpService
         .get<ResponsePayload<UserSnippetsDto>>('/snippets/me/full')
         .then((payload: ResponsePayload<UserSnippetsDto>) => payload.data)
         .catch((error) => {
            this.outputChannelService.appendLine(error);
            return Promise.reject(error);
         });
   }

   public getUserSnippetsVersion(): Promise<number> {
      return this.httpService.get<number>('/snippets/me/version');
   }
}
