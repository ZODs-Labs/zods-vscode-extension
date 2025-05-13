/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Command } from '@zods/core';
import { ISyncAILensesCommandHandler } from '@models/handlers';
import { IAILensSyncService } from '@models/service';

export class SyncAILensesCommandHandler implements ISyncAILensesCommandHandler {
   id: string;

   constructor(private aiLensSyncService: IAILensSyncService) {
      this.id = Command.SyncAILensesCommand;
   }

   handle(): Promise<void> {
      return this.aiLensSyncService.triggerSync();
   }
}
