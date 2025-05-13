/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProgressLocation } from 'vscode';

import { AILensSyncResult } from '@common/enums';
import config from '@config/constants';
import { AILensInfoDto } from '@models/api/ai-lens.model';
import { IAILensDataService } from '@models/data-services';
import {
   IAILensSyncService,
   IAuthService,
   INotificationService,
   IOutputChannelService,
   IVSCodeService,
} from '@models/service';
import { IGlobalStateStore } from '@models/store';

export class AILensSyncService implements IAILensSyncService {
   constructor(
      private authService: IAuthService,
      private aiLensDataService: IAILensDataService,
      private vscodeService: IVSCodeService,
      private outputChannelService: IOutputChannelService,
      private globalStateStore: IGlobalStateStore,
      private notificationService: INotificationService
   ) {}

   public async manualSync(): Promise<void> {
      if (this.authService.isAuthenticated()) {
         return this.syncAILenses();
      } else {
         this.authService.promptForSignIn();
      }
   }

   public async triggerSync(): Promise<void> {
      return this.syncAILenses(true);
   }

   private async syncAILenses(notifyOnCompleted?: boolean): Promise<void> {
      return this.vscodeService.window.withProgress(
         {
            location: ProgressLocation.Window,
            cancellable: false,
            title: 'ZODs: Syncing AI Lenses...',
         },
         async (progress) => {
            progress.report({ increment: 0 });
            this.aiLensDataService
               .getAILenses()
               .then((aiLensesInfo: AILensInfoDto[]) => {
                  progress.report({ increment: 70 });

                  this.globalStateStore.update(
                     config.AI_LENSES_STORAGE_KEY,
                     aiLensesInfo
                  );

                  progress.report({ increment: 100 });

                  this.logChannel('AI Lenses synced successfully.');

                  if (notifyOnCompleted) {
                     this.notificationService.showInfo(
                        'AI Lenses synced successfully.'
                     );
                  }

                  return AILensSyncResult.FetchedLatestVersion;
               })
               .catch((e) => {
                  progress.report({ increment: 100 });

                  this.logChannel(`Snippets sync failed.`);
                  this.logChannel(`Error: ${JSON.stringify(e)}`);

                  if (notifyOnCompleted) {
                     this.notificationService.showError(
                        'AI Lenses sync failed.'
                     );
                  }

                  return AILensSyncResult.ErrorOccurred;
               });
         }
      );
   }

   private logChannel(message: string): void {
      this.outputChannelService.appendLine(
         `[ZODs][AI Lens Sync] ${message}`
      );
   }
}
