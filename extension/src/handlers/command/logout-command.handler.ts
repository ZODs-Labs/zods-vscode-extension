/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Command } from '@zods/core';
import { ILogoutCommandHandler } from '@models/handlers';
import { IAuthService } from '@models/service';

export class LogoutCommandHandler implements ILogoutCommandHandler {
   id: string;

   constructor(private authService: IAuthService) {
      this.id = Command.Logout;
   }

   public handle(...args: any[]): void | Promise<void> {
      this.authService.logout();
   }
}
