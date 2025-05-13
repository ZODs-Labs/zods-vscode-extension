/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProgressLocation } from 'vscode';

import { PricingPlanType, SnippetsSyncResult } from '@common/enums';
import config from '@config/constants';
import { AuthService } from '@core/services';
import { UserSnippetsDto } from '@models/api';
import { ISnippetsDataService } from '@models/data-services';
import {
   IAuthService,
   ICompletionItemService,
   IOutputChannelService,
   ISnippetSyncService,
   IVSCodeService,
} from '@models/service';
import { IGlobalStateStore } from '@models/store';

const SNIPPETS_SYNC_FAILED_MESSAGE = 'ZODs: Syncing snippets failed!';
const SNIPPETS_SYNC_PROGRESS_MESSAGE = 'ZODs: Syncing snippets...';

export class SnippetSyncService implements ISnippetSyncService {
   private timer?: NodeJS.Timeout;

   constructor(
      private authService: IAuthService,
      private snippetDataService: ISnippetsDataService,
      private vscodeService: IVSCodeService,
      private completionItemsService: ICompletionItemService,
      private outputChannelService: IOutputChannelService,
      private globalStateStore: IGlobalStateStore
   ) {
      this.resetSnippetsVersionInStorage();
      this.setAuthEventListeners();
   }

   public async manualSync(): Promise<SnippetsSyncResult> {
      if (this.authService.isAuthenticated()) {
         return this.syncSnippets();
      } else {
         this.authService.promptForSignIn();

         return SnippetsSyncResult.ErrorOccurred;
      }
   }

   private async syncSnippets(): Promise<SnippetsSyncResult> {
      if (!this.authService.hasValidSubscription) {
         this.logChannel('User does not have a valid subscription.');
         return SnippetsSyncResult.ErrorOccurred;
      }

      try {
         const userSnippetsVersion = await this.snippetDataService.getUserSnippetsVersion();
         const lastSyncedSnippetsVersion = this.getSnippetsVersionFromStorage();

         this.logChannel('Checking for new snippets version...');
         this.logChannel(
            `Last synced snippets version: ${lastSyncedSnippetsVersion || 0}`
         );
         this.logChannel(`Current snippets version: ${userSnippetsVersion}`);

         if (userSnippetsVersion !== lastSyncedSnippetsVersion) {
            // There are new snippets version on the server
            await this.processLatestSnippets();
            this.scheduleNextSyncIfEnabled();
            return SnippetsSyncResult.FetchedLatestVersion;
         } else {
            this.logChannel('Snippets are up to date.');
            this.scheduleNextSyncIfEnabled();
         }

         return SnippetsSyncResult.HasLatestVersion;
      } catch (error) {
         this.logChannel('Error during sync:' + JSON.stringify(error));
         this.scheduleNextSyncIfEnabled(); // Ensure the next sync is scheduled even if there's an error
         return SnippetsSyncResult.ErrorOccurred;
      }
   }

   private scheduleNextSyncIfEnabled(): void {
      if (
         this.authService.pricingPlanType === PricingPlanType.Standard ||
         this.authService.pricingPlanType === PricingPlanType.Premium
      ) {
         this.scheduleNextSync();
      }
   }

   private scheduleNextSync(): void {
      this.rejectScheduledSync(); // Clear any existing timer

      const syncSnippetsEveryNMinutes =
         config.SNIPPETS_SYNC_INTERVAL_IN_MINUTES * 60 * 1000;
      this.timer = setTimeout(
         this.syncSnippets.bind(this),
         syncSnippetsEveryNMinutes
      );
   }

   private rejectScheduledSync(): void {
      if (this.timer) {
         clearInterval(this.timer);
         this.timer = undefined;
      }
   }

   private async processLatestSnippets(): Promise<void> {
      return this.vscodeService.window.withProgress(
         {
            location: ProgressLocation.Window,
            cancellable: false,
            title: SNIPPETS_SYNC_PROGRESS_MESSAGE,
         },
         async (progress) => {
            progress.report({ increment: 0 });
            this.snippetDataService
               .getUserSnippets()
               .then((snippetsDto: UserSnippetsDto) => {
                  progress.report({ increment: 70 });

                  const { snippets, snippetsVersion } = snippetsDto;

                  this.globalStateStore.update(
                     config.SNIPPETS_VERSION_STORAGE_KEY,
                     snippetsVersion
                  );

                  this.completionItemsService.registerCompletionItems(snippets);
                  progress.report({ increment: 100 });

                  this.logChannel('Snippets synced successfully.');

                  return SnippetsSyncResult.FetchedLatestVersion;
               })
               .catch((e) => {
                  this.vscodeService.window.showErrorMessage(
                     SNIPPETS_SYNC_FAILED_MESSAGE
                  );
                  progress.report({ increment: 100 });

                  this.logChannel(
                     `Snippets sync failed. Error: ${JSON.stringify(e)}`
                  );

                  return Promise.reject();
               });
         }
      );
   }

   private setAuthEventListeners(): void {
      AuthService.SuccessfulAuthenticationEventEmitter.event(() => {
         this.syncSnippets();
      });
   }

   private getSnippetsVersionFromStorage(): number | undefined {
      return this.vscodeService.context.globalState.get<number>(
         config.SNIPPETS_VERSION_STORAGE_KEY
      );
   }

   private resetSnippetsVersionInStorage(): void {
      this.vscodeService.context.globalState.update(
         config.SNIPPETS_VERSION_STORAGE_KEY,
         undefined
      );
   }

   private logChannel(message: string): void {
      this.outputChannelService.appendLine(
         `[ZODs SnippetsSync] ${message}`
      );
   }
}

export default SnippetSyncService;
