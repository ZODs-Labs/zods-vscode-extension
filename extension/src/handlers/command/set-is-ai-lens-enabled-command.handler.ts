/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Command } from '@zods/core';
import config from '@config/constants';
import { AILensInfoDto } from '@models/api/ai-lens.model';
import { IAILensDataService } from '@models/data-services';
import { ISetIsAILensEnabledCommandHandler } from '@models/handlers';
import { IAuthService, IOutputChannelService } from '@models/service';
import { IGlobalStateStore } from '@models/store';

export class SetIsAILensEnabledCommandHandler
   implements ISetIsAILensEnabledCommandHandler {
   id: string;

   constructor(
      private globalStateStore: IGlobalStateStore,
      private outputChannelService: IOutputChannelService,
      private aiLensDataService: IAILensDataService,
      private authService: IAuthService
   ) {
      this.id = Command.SetIsAILensEnabled;
   }

   async handle({
      aiLensId,
      isEnabled,
   }: {
      aiLensId: string;
      isEnabled: boolean;
   }) {
      if (!aiLensId) {
         return;
      }

      if (!this.authService.isAuthenticated()) {
         // Do not allow the user to enable/disable AI Lenses if not authenticated
         this.authService.promptForSignIn();
         return;
      }

      const aiLenses = this.globalStateStore.get<AILensInfoDto[]>(
         config.AI_LENSES_STORAGE_KEY,
         []
      );

      const aiLens = aiLenses.find(
         (lens: AILensInfoDto) => lens.id === aiLensId
      );
      if (!aiLens) {
         this.logOutputMessage(`AI Lens with id ${aiLensId} not found.`);
         return;
      }

      aiLens.isEnabled = isEnabled;
      this.globalStateStore.update(config.AI_LENSES_STORAGE_KEY, aiLenses);

      // Update the API with the new AI Lens state
      this.aiLensDataService
         .setIsAILensEnabled(aiLensId, isEnabled)
         .then(() => {
            this.logOutputMessage(
               `AI Lens ${isEnabled ? 'enabled' : 'disabled'} successfully.`
            );
         });
   }

   private logOutputMessage(error: any) {
      this.outputChannelService.appendLine(
         `[ZODs][AI Lens Config] ${error}`
      );
   }
}
