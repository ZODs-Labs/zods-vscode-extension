/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Uri } from 'vscode';

import { UriUtils } from '@common/utils';
import { IAuthenticationUriHandler } from '@models/handlers';
import { IAuthService, IVSCodeService } from '@models/service';

const AUTH_SUCCESS_MESSAGE = 'ZODs: Authentication successful!';
const AUTH_FAILED_MESSAGE = 'ZODs: Authentication failed.';

export class AuthenticationUriHandler implements IAuthenticationUriHandler {
   constructor(
      private vscodeService: IVSCodeService,
      private authService: IAuthService
) {}

   canHandle(uri: Uri): boolean {
      return uri.path === '/authentication';
   }

   async handle(uri: Uri): Promise<void> {
      await this.processTokenFromUri(uri);

      if (this.authService.isAuthenticated()) {
         this.vscodeService.window.showInformationMessage(AUTH_SUCCESS_MESSAGE);
      } else {
         this.vscodeService.window.showErrorMessage(AUTH_FAILED_MESSAGE);
      }
   }

   private async processTokenFromUri(uri: Uri): Promise<void> {
      const token = UriUtils.getRawQueryParam(uri, 'token');
      const refreshToken = UriUtils.getRawQueryParam(uri, 'refreshToken');

      if (token && refreshToken) {
         await this.authService.setTokenIfValid(token, refreshToken);
      }
   }
}

export default AuthenticationUriHandler;
