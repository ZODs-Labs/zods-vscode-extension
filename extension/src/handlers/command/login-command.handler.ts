/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Uri } from 'vscode';

import { Command } from '@zods/core';
import config from '@config/constants';
import { ILoginCommandHandler } from '@models/handlers';
import { IVSCodeService } from '@models/service';

export class LoginCommandHandler implements ILoginCommandHandler {
   id: string;
   constructor(private vscodeService: IVSCodeService) {
      this.id = Command.Login;
   }

   public handle(...args: any[]): void | Promise<void> {
      const redirectUrl = config.AUTH_URI;
      const loginUri: Uri = Uri.parse(`${config.LOGIN_WEB_URI}${redirectUrl}`);

      this.vscodeService.env.openExternal(loginUri);
   }
}
