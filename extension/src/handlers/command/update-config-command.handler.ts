/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ConfigurationTarget } from 'vscode';

import { Command } from '@zods/core';
import { VsCodeConfigKeys } from '@config/vscode-config.constants';
import { EncryptionUtils } from '@core/encryption';
import { IUpdateConfigCommandHandler } from '@models/handlers';
import { IOutputChannelService, IVSCodeService } from '@models/service';

export class UpdateConfigCommandHandler implements IUpdateConfigCommandHandler {
   id: string;

   constructor(
      private vscodeService: IVSCodeService,
      private outputChannelService: IOutputChannelService
   ) {
      this.id = Command.UpdateConfig;
   }

   public async handle(config: { [key: string]: any }): Promise<void> {
      try {
         const configuration = this.vscodeService.workspace.getConfiguration();
         for (let [key, value] of Object.entries(config)) {
            if (!key) {
               continue;
            }

            if (key === VsCodeConfigKeys.OpenAIAPIKey) {
               value = EncryptionUtils.encrypt(value);
            }

            await configuration.update(key, value, ConfigurationTarget.Global);
         }
      } catch (error) {
         this.outputChannelService.appendLine(
            `[ZODs][UpdateConfigCommand] Failed to update configuration: ${JSON.stringify(
               error
            )}`
         );
      }
   }
}
