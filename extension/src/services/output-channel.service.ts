/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { OutputChannel } from 'vscode';

import config from '@config/constants';
import { IOutputChannelService, IVSCodeService } from '@models/service';

export class OutputChannelService implements IOutputChannelService {
   private outputChannel: OutputChannel;

   constructor(private vscodeService: IVSCodeService) {
      this.outputChannel = this.vscodeService.window.createOutputChannel(
         config.EXTENSION_NAME
      );
   }

   public appendLine(value: string): void {
      const timestamp = `[${new Date().toLocaleTimeString()}]`;
      this.outputChannel.appendLine(`${timestamp} ${value}`);
   }

   public show(): void {
      this.outputChannel.show();
   }

   public dispose(): void {
      this.outputChannel.dispose();
   }
}

export default OutputChannelService;
