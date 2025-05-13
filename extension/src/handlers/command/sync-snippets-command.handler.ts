/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { SnippetsSyncResult } from '@common/enums';
import { ISyncSnippetsCommandHandler } from '@models/handlers';
import { INotificationService, ISnippetSyncService } from '@models/service';
import { Command } from '@zods/core';

export class SyncSnippetsCommandHandler implements ISyncSnippetsCommandHandler {
   id: string;
   constructor(
      private snippetSyncService: ISnippetSyncService,
      private notificationService: INotificationService
   ) {
      this.id = Command.SyncSnippets;
   }

   public handle(...args: any[]): void | Promise<void> {
      this.snippetSyncService
         .manualSync()
         .then((syncResult: SnippetsSyncResult) => {
            if (syncResult === SnippetsSyncResult.HasLatestVersion) {
               this.notificationService.showInfo(
                  'Your snippets are up to date!'
               );
            } else if (syncResult === SnippetsSyncResult.FetchedLatestVersion) {
               this.notificationService.showInfo(
                  'Your snippets have been synced!'
               );
            }
         });
   }
}
