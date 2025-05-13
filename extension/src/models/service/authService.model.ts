import { PricingPlanType } from '@common/enums';
import { AuthData } from '@models/auth';

export interface IAuthService {
   /**
    * User id claim from the token.
    */
   userId: string;

   /**
    * User email claim from the token.
    */
   email: string;

   /**
    * Pricing plan type claim from the token.
    */
   pricingPlanType: PricingPlanType | null;

   /**
    * Flag indicating whether the user is subscribed to any of the pricing plans.
    */
   hasValidSubscription: boolean;

   /**
    * Redirects to the web login page.
    */
   redirectToWebLoginPage(): Promise<void>;

   /**
    * Set auth token.
    * @param token Auth token.
    */
   setTokenIfValid(token: string, refreshToken: string): Promise<void>;

   /**
    * Gets auth token.
    */
   getToken(): string;

   /**
    * Returns true if the user is authenticated, false otherwise.
    */
   isAuthenticated(): boolean;

   /**
    * Validate the auth token with the server.
    * Returns true if the token is valid, false otherwise.
    * Note: `Token` must be set before calling this method.
    */
   isTokenValid(): Promise<AuthData | null>;

   /**
    * Returns the auth data.
    */
   getAuthData(): AuthData | null;

   /**
    * Prompt the user to sign in.
    */
   promptForSignIn(): void;

   /**
    * Log the user out.
    */
   logout(): void;
}
