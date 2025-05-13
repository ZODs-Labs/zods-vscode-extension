/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

export const IocSymbols = {
   // Services
   IHttpService: Symbol.for('IHttpService'),
   IAuthService: Symbol.for('IAuthService'),
   INotificationService: Symbol.for('INotificationService'),
   ICompletionItemService: Symbol.for('ICompletionItemService'),
   IOutputChannelService: Symbol.for('IOutputChannelService'),
   ISnippetSyncService: Symbol.for('ISnippetSyncService'),
   IAILensSyncService: Symbol.for('IAILensSyncService'),
   IAITestStormService: Symbol.for('IAITestStormService'),

   // Stores
   IGlobalStateStore: Symbol.for('IGlobalStateStore'),

   // Data Services
   ISnippetsDataService: Symbol.for('ISnippetsDataService'),
   IAILensDataService: Symbol.for('IAILensDataService'),

   // Managers
   IExtensionManager: Symbol.for('IExtensionManager'),
   IUriManager: Symbol.for('IUriManager'),
   ITestStormWebViewManager: Symbol.for('ITestStormWebViewManager'),

   // Handlers
   IAuthenticationUriHandler: Symbol.for('IAuthenticationUriHandler'),
   ILoginCommandHandler: Symbol.for('ILoginCommandHandler'),
   ILogoutCommandHandler: Symbol.for('ILogoutCommandHandler'),
   ISyncSnippetsCommandHandler: Symbol.for('ISyncSnippetsCommandHandler'),
   ISetCodeAIChatContextCommandHandler: Symbol.for(
      'ISetSelectedCodeAsAIChatContextCommandHandler'
   ),
   IUpdateConfigCommandHandler: Symbol.for('IUpdateConfigCommandHandler'),
   IAIChatCommandHandler: Symbol.for('IAIChatCommandHandler'),
   ISetIsAILensEnabledCommandHandler: Symbol.for(
      'ISetIsAILensEnabledCommandHandler'
   ),
   ISyncAILensesCommandHandler: Symbol.for('ISyncAILensesCommandHandler'),
   IShowTestStormViewCommandHandler: Symbol.for(
      'IShowTestStormViewCommandHandler'
   ),

   // VSCode-related
   IVSCodeService: Symbol.for('IVSCodeService'),
   IVSCode: Symbol.for('IVSCode'),
   IVSCodeExtensionContext: Symbol.for('IVSCodeExtensionContext'),
   IWorkspaceService: Symbol.for('IWorkspaceService'),
   IFileService: Symbol.for('IFileService'),

   // Factories
   ICommandRegistrationFactory: Symbol.for('ICommandRegistrationFactory'),
   IWebViewRegistrationFactory: Symbol.for('IWebViewRegistrationFactory'),
   ICodeLensRegistrationFactory: Symbol.for('ICodeLensRegistrationFactory'),
   ISymbolMatcherFactory: Symbol.for('ISymbolMatcherFactory'),

   // Containers
   IIocContainer: Symbol.for('IIocContainer'),

   // View Providers
   IAIChatWebViewProvider: Symbol.for('IAIChatWebViewProvider'),

   // Code Lens Providers
   IAIFeaturesCodeLensProvider: Symbol.for('IAIFeaturesCodeLensProvider'),
   ICommonCodeLensProvider: Symbol.for('ICommonCodeLensProvider'),
};
