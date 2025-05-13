/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { EventEmitter, Uri } from 'vscode';

import { Claims, PricingPlanType } from '@common/enums';
import { decodeJWTClaims } from '@common/utils/auth.utils';
import { safeCast } from '@common/utils/common.utils';
import config from '@config/constants';
import { AuthData } from '@models/auth';
import {
   IAuthService,
   IHttpService,
   INotificationService,
   IOutputChannelService,
   IVSCodeService,
} from '@models/service';

const AUTH_DATA_STORAGE_KEY = 'zods.authData';
const TOKEN_EXPIRATION_BUFFER = 60 * 1000; // 1 minute

export class AuthService implements IAuthService {
   private authData: AuthData | null = null;
   private claims: Record<string, any> | null = null;
   private scheduledTokenSync: NodeJS.Timeout | null = null;

   public static readonly TokenEventEmitter: EventEmitter<
      string
   > = new EventEmitter<string>();

   public static readonly SuccessfulAuthenticationEventEmitter: EventEmitter<
      void
   > = new EventEmitter<void>();

   constructor(
      private vscodeService: IVSCodeService,
      private httpService: IHttpService,
      private notificationService: INotificationService,
      private outputChannelService: IOutputChannelService
   ) {
      // :::::: Logic for testing refresh token ::::::::
      // const storageAuthData = this.getAuthDataFromStorage();
      // if (storageAuthData) {
      //    storageAuthData.expiresAt = Date.now()/1000 - 60;
      // }
      // this.vscodeService.context.globalState.update(
      //    AUTH_DATA_STORAGE_KEY,
      //    storageAuthData
      // );
      // :::::: Logic for testing refresh token ::::::::

      try {
         this.initializeAuthentication();
         this.setAuthEventHandlers();
      } catch (e: any) {
         this.logChannel(e.message);
      }
   }

   /**
    * Flag indicating whether the user is subscribed to any of the pricing plans.
    */
   public get isUserSubscribed(): boolean {
      return this.getClaim<boolean>(Claims.IsSubscribed) ?? false;
   }

   public get pricingPlanType(): PricingPlanType | null {
      return this.getClaim<PricingPlanType>(Claims.PricingPlanType);
   }

   /**
    * Flag indicating whether the user has a valid subscription to any of the pricing plans.
    */
   public get hasValidSubscription(): boolean {
      return this.getClaim<boolean>(Claims.HasValidSubscription) ?? false;
   }

   public get userId(): string {
      return this.getClaim<string>(Claims.Sub) ?? '';
   }

   public get email(): string {
      return this.getClaim<string>(Claims.Email) ?? '';
   }

   public async redirectToWebLoginPage(): Promise<void> {
      const redirectUrl = config.AUTH_URI;
      const loginUri: Uri = Uri.parse(`${config.LOGIN_WEB_URI}${redirectUrl}`);
      await this.vscodeService.env.openExternal(loginUri);
   }

   public async setTokenIfValid(
      token: string,
      refreshToken: string
   ): Promise<void> {
      // Set token to be able to validate it, temporarily
      AuthService.TokenEventEmitter.fire(token);

      const validAuthData = await this.isTokenValid();
      if (validAuthData) {
         this.authData = {
            idToken: token,
            refreshToken,
            ...(validAuthData as any),
         };

         this.vscodeService.context.globalState.update(
            AUTH_DATA_STORAGE_KEY,
            this.authData
         );

         AuthService.TokenEventEmitter.fire(this.getToken());
         AuthService.SuccessfulAuthenticationEventEmitter.fire();
      } else {
         // Make sure to clear token if it's invalid
         this.vscodeService.context.globalState.update(
            AUTH_DATA_STORAGE_KEY,
            null
         );
         this.promptForSignIn();
      }
   }

   public getToken(): string {
      return this.authData?.idToken ?? '';
   }

   public isAuthenticated(): boolean {
      const { idToken, expiresAt } = this.authData ?? {};
      if (!idToken || !expiresAt) {
         return false;
      }

      return !this.isTokenExpired(expiresAt);
   }

   public async isTokenValid(): Promise<AuthData | null> {
      return this.httpService
         .get<AuthData>('/auth/token/valid')
         .catch((error) => {
            this.logChannel(error);
            return null;
         });
   }

   public getAuthData(): AuthData | null {
      return this.authData;
   }

   public promptForSignIn(): void {
      this.notificationService
         .showInfo('Sign in to use ZODs Lens AI', 'Sign in')
         .then((selection: string | undefined) => {
            if (selection === 'Sign in') {
               this.redirectToWebLoginPage();
            }
         });
   }

   logout(): void {
      this.httpService
         .post('/auth/logout', null)
         .then(() => {
            this.vscodeService.context.globalState.update(
               AUTH_DATA_STORAGE_KEY,
               null
            );
            this.authData = null;
            AuthService.TokenEventEmitter.fire('');

            this.logChannel('Logged out successfully.');
         })
         .catch((error) => {
            this.logChannel(error);
         });
   }

   private initializeAuthentication(): void {
      const storageAuthData = this.getAuthDataFromStorage();

      if (storageAuthData) {
         this.processStoredAuthData(storageAuthData);
      } else {
         this.promptForSignIn();
      }
   }

   private processStoredAuthData(storageAuthData: AuthData): void {
      if (!this.isTokenExpired(storageAuthData.expiresAt)) {
         this.setTokenIfValid(
            storageAuthData.idToken,
            storageAuthData.refreshToken
         );
      } else if (storageAuthData.refreshToken) {
         this.refreshToken(storageAuthData.refreshToken);
      }
   }

   private getAuthDataFromStorage(): AuthData | undefined {
      const data = this.vscodeService.context.globalState.get<AuthData>(
         AUTH_DATA_STORAGE_KEY
      );

      return data;
   }

   private setAuthDataToStorage(authData: AuthData): void {
      this.vscodeService.context.globalState.update(
         AUTH_DATA_STORAGE_KEY,
         authData
      );
   }

   private isTokenExpired(expirationSeconds: number): boolean {
      return Date.now() > expirationSeconds * 1000 - TOKEN_EXPIRATION_BUFFER;
   }

   private async refreshToken(refreshToken: string): Promise<void> {
      this.logChannel('Refreshing token...');
      try {
         const response = await this.httpService.get<AuthData>(
            '/auth/token/refresh',
            {
               queryParams: {
                  refreshToken,
               },
            }
         );
         this.authData = {
            ...this.authData,
            ...response,
         };

         this.setAuthDataToStorage(this.authData);
         AuthService.TokenEventEmitter.fire(this.getToken());
         AuthService.SuccessfulAuthenticationEventEmitter.fire();

         this.logChannel('Token refreshed successfully.');
      } catch (error) {
         this.logChannel(
            'Failed to refresh token. Error: ' + JSON.stringify(error)
         );
         this.promptForSignIn();
      }
   }

   private async scheduleTokenRefresh(): Promise<void> {
      if (this.scheduledTokenSync) {
         clearTimeout(this.scheduledTokenSync);
      }

      if (!this.authData) {
         return;
      }

      const { expiresAt, refreshToken } = this.authData;
      if (!refreshToken) {
         return;
      }

      const expiresAtMs = (expiresAt ?? 0) * 1000;
      const now = Date.now();
      const timeToRefresh = expiresAtMs - now - TOKEN_EXPIRATION_BUFFER;
      // Immediate refresh if the token is already expired or expiring within the buffer time
      if (timeToRefresh < 0) {
         try {
            this.refreshToken(refreshToken);
            return;
         } catch (error) {
            console.error('Failed to refresh token:', error);
            return;
         }
      }
      // Schedule a future token refresh
      this.scheduledTokenSync = setTimeout(async () => {
         try {
            await this.refreshToken(refreshToken);
         } catch (error) {
            console.error('Failed to refresh token:', error);
         }
      }, timeToRefresh);
   }

   private getClaim = <T>(
      claim: string,
      type: 'string' | 'boolean' | 'number' = 'string'
   ): T | null => {
      const value = (this.claims || {})[claim];
      return safeCast<T>(value, type);
   };

   private logChannel(message: string): void {
      this.outputChannelService.appendLine(`[ZODs Auth] ${message}`);
   }

   private setAuthEventHandlers(): void {
      AuthService.TokenEventEmitter.event(() => {
         this.claims = decodeJWTClaims(this.getToken());
         this.scheduleTokenRefresh();
      });
   }
}

export default AuthService;
