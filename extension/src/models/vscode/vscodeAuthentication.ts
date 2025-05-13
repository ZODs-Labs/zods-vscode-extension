import {
   AuthenticationGetSessionOptions,
   AuthenticationProvider,
   AuthenticationProviderOptions,
   AuthenticationSession,
   Disposable,
} from 'vscode';

export interface IVSCodeAuthentication {
   registerAuthenticationProvider(
      id: string,
      label: string,
      provider: AuthenticationProvider,
      options?: AuthenticationProviderOptions
   ): Disposable;

   /**
    * Get an authentication session matching the desired scopes. Rejects if a provider with providerId is not
    * registered, or if the user does not consent to sharing authentication information with
    * the extension. If there are multiple sessions with the same scopes, the user will be shown a
    * quickpick to select which account they would like to use.
    *
    * Currently, there are only two authentication providers that are contributed from built in extensions
    * to the editor that implement GitHub and Microsoft authentication: their providerId's are 'github' and 'microsoft'.
    * @param providerId The id of the provider to use
    * @param scopes A list of scopes representing the permissions requested. These are dependent on the authentication provider
    * @param options The {@link AuthenticationGetSessionOptions} to use
    * @returns A thenable that resolves to an authentication session
    */
   getSession(
      providerId: string,
      scopes: readonly string[],
      options: AuthenticationGetSessionOptions & { createIfNone: true }
   ): Thenable<AuthenticationSession>;
}
