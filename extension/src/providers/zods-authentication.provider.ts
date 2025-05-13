/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
   AuthenticationProvider,
   AuthenticationProviderAuthenticationSessionsChangeEvent,
   AuthenticationSession,
   Event,
   EventEmitter,
   window,
   AuthenticationProviderSessionOptions,
} from 'vscode';

import config from '@config/constants';
import { AuthService } from '@core/services';
import {
   IAuthService,
   IOutputChannelService,
   IVSCodeService,
} from '@models/service';

export class ZodsAuthenticationProvider implements AuthenticationProvider {
   private onDidChangeSessionsEmitter: EventEmitter<
      AuthenticationProviderAuthenticationSessionsChangeEvent
   > = new EventEmitter<
      AuthenticationProviderAuthenticationSessionsChangeEvent
   >();

   constructor(
      private authService: IAuthService,
      private outputChannelService: IOutputChannelService,
      private vscodeService: IVSCodeService
   ) {
      // Listen to token processed event
      AuthService.SuccessfulAuthenticationEventEmitter.event(() => {
         this.log('Authentication successful');
         this.onDidChangeSessionsEmitter.fire({
            added: [this.currentSession()],
            removed: [],
            changed: [],
         });

         // IMPORTANT: Calling getSession we'll register this extension uses the registered
         // auth provider
         this.vscodeService.authentication.getSession(
            config.ZODS_X_AUTH_PROVIDER_ID,
            config.ZODS_X_AUTH_SCOPES,
            {
               createIfNone: true,
            }
         );
      });
   }

   async createSession(): Promise<AuthenticationSession> {
      try {
         this.log('Created a new session');
         return this.currentSession();
      } catch (error) {
         this.log('Failed to create a new session: ' + JSON.stringify(error));
         this.notifyUser('Failed to create a new session', 'error');
         throw new Error(
            'Failed to create a new session: ' + JSON.stringify(error)
         );
      }
   }

   async removeSession(sessionId: string): Promise<void> {
      try {
         this.authService.logout();
         this.log('Session removed');
         this.onDidChangeSessionsEmitter.fire({
            added: [],
            removed: [this.currentSession()],
            changed: [],
         });
      } catch (error) {
         this.log('Failed to log out: ' + JSON.stringify(error));
         this.notifyUser('Failed to log out', 'error');
      }
   }

   getSessions(
      scopes?: readonly string[] | undefined,
      options?: AuthenticationProviderSessionOptions
   ): Thenable<AuthenticationSession[]> {
      if (this.authService.isAuthenticated()) {
         return Promise.resolve([this.currentSession()]);
      }
      return Promise.resolve([]);
   }

   get onDidChangeSessions(): Event<
      AuthenticationProviderAuthenticationSessionsChangeEvent
   > {
      return this.onDidChangeSessionsEmitter.event;
   }

   private currentSession(): AuthenticationSession {
      const sessionId = `${this.authService.email}-${Date.now()}`; // Ensure uniqueness by appending timestamp
      return {
         id: sessionId,
         accessToken: this.authService.getToken(),
         account: {
            label: this.authService.email,
            id: this.authService.email,
         },
         scopes: config.ZODS_X_AUTH_SCOPES,
      };
   }

   private log(message: string): void {
      this.outputChannelService.appendLine(`[ZODs Auth] ${message}`);
   }

   private notifyUser(message: string, type: 'info' | 'error' | 'warn'): void {
      switch (type) {
         case 'info':
            window.showInformationMessage(message);
            break;
         case 'error':
            window.showErrorMessage(message);
            break;
         case 'warn':
            window.showWarningMessage(message);
            break;
      }
   }
}
