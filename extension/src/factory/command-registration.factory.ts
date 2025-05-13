/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import commandHandlersConfig from '@config/commands.config';
import { ICommandRegistrationFactory } from '@models/factory';
import { ICommandHandler } from '@models/handlers';
import { IIocContainer } from '@models/ioc';
import { IVSCodeService } from '@models/service';

export class CommandRegistrationFactory implements ICommandRegistrationFactory {
   constructor(
      private vscodeService: IVSCodeService,
      private container: IIocContainer
   ) {}

   public registerCommands(): void {
      const subscriptions = [];

      for (const [commandId, handlerSymbol] of commandHandlersConfig) {
         const handler = this.container.get<ICommandHandler>(handlerSymbol);

         if (handler.id !== commandId) {
            throw new Error(
               `Command ID mismatch for ${handlerSymbol.toString()}`
            );
         }

         const command = this.vscodeService.commands.registerCommand(
            commandId,
            (...args: any[]) => handler.handle(...args)
         );

         subscriptions.push(command);
      }

      this.vscodeService.context.subscriptions.push(...subscriptions);
   }
}
