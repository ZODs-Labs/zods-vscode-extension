/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
   Disposable,
   FileSystemWatcher,
   TextEditor,
   Uri,
   ViewColumn,
   Webview,
   WebviewPanel,
} from 'vscode';

import { CancelTokenSource } from 'axios';

import { WebViewUtils } from '@common/utils';
import config from '@config/constants';
import {
   ITestStormWebViewManager,
   IWebViewPanelMetadata,
   TestStormWebViewPanelMetadata,
   WebviewPanelMap,
} from '@models/managers';
import { WebViewConfig } from '@models/providers/view';
import {
   IAITestStormService,
   IFileService,
   IHttpService,
   IOutputChannelService,
   IVSCodeService,
   IWorkspaceService,
} from '@models/service';
import { CodeUtils, UriUtils } from '@shared/utils';
import {
   AITestCaseDto,
   AITestDto,
   AITestStormViewInternalCommand,
   AddUnitTestsInternalCommandDto,
   ApiRequestWebviewMessage,
   CommandWebviewMessage,
   CreateUnitTestsFileInternalCommandDto,
   FileTreeItem,
   GenerateUnitTestCasesInputDto,
   GenerateUnitTestInputDto,
   InternalCommandWebviewMessage,
   TestStormWebViewMessageCommand,
   WebviewMessageType,
} from '@zods/core';

import { AbstractWebViewManager } from './abstract-view.manager';

export class TestStormWebViewManager
   extends AbstractWebViewManager
   implements ITestStormWebViewManager
{
   protected readonly webviewPanels: WebviewPanelMap = new Map();

   protected readonly webviewName: string = 'AI Test Storm';

   private readonly unitTestsGenerationCancellationTokens: Map<
      string,
      CancelTokenSource
   > = new Map();

   private readonly unitTestCasesGenerationCancellationTokens: Map<
      string,
      CancelTokenSource
   > = new Map();

   private readonly workspaceFileSystemWatcher: FileSystemWatcher;

   constructor(
      private workspaceService: IWorkspaceService,
      private aiTestStormService: IAITestStormService,
      private fileService: IFileService,
      vscodeService: IVSCodeService,
      outputChannelService: IOutputChannelService,
      httpService: IHttpService
   ) {
      super(vscodeService, outputChannelService, httpService);

      this.workspaceFileSystemWatcher = this.createWorkspaceFileSystemWatcher();

      // Observe workspace changes and push file tree to all webviews
      this.workspaceFileSystemWatcher.onDidCreate(() => {
         this.pushFileTreeToAllWebviews();
      });
      this.workspaceFileSystemWatcher.onDidDelete(() => {
         this.pushFileTreeToAllWebviews();
      });
   }

   public createWebviewPanel(
      webviewId: string,
      metadata: IWebViewPanelMetadata
   ): Webview {
      if (this.webviewPanels.has(webviewId)) {
         // Focus existing panel
         const existingPanel = this.webviewPanels.get(webviewId)?.panel;
         existingPanel!.reveal(ViewColumn.Beside);
         return existingPanel!.webview;
      }

      const panel = this.vscodeService.window.createWebviewPanel(
         'testStorm',
         `AI Test Storm - ${webviewId}`,
         ViewColumn.Beside,
         {
            enableScripts: true,
            enableCommandUris: true,
            retainContextWhenHidden: true, // Optimize for performance
            localResourceRoots: [
               Uri.file(this.vscodeService.context.extensionPath),
            ],
         }
      );

      this.setupWebviewPanel(webviewId, panel, metadata);

      return panel.webview;
   }

   private setupWebviewPanel(
      webviewId: string,
      panel: WebviewPanel,
      metadata: IWebViewPanelMetadata
   ): void {
      const disposables: Disposable[] = [];

      panel.iconPath = Uri.joinPath(
         this.extensionUri,
         'resources/icons/ai-test-storm.svg'
      );
      // Set the webview's initial content
      panel.webview.html = this.getHtmlForWebview(panel.webview);

      // Handle messages from the webview
      const messageListener = panel.webview.onDidReceiveMessage(
         (message) => this.handleWebviewMessage(webviewId, message),
         null,
         disposables
      );

      // Clean up when the webview is closed
      const disposeListener = panel.onDidDispose(
         () => this.disposeWebviewPanel(webviewId),
         null,
         disposables
      );

      const listenerDisposables = this.registerHostListeners(panel.webview);

      this.webviewPanels.set(webviewId, {
         panel,
         webviewId,
         metadata,
         disposables: [
            messageListener,
            disposeListener,
            ...listenerDisposables,
         ],
      });

      panel.webview.postMessage({
         command: TestStormWebViewMessageCommand.SetFileExtension,
         data: '',
      });
   }

   private getHtmlForWebview(webview: Webview) {
      const config = this.getConfiguration(webview);
      const rawHtml = WebViewUtils.getRootHtml(config);

      return rawHtml;
   }

   private handleWebviewMessage(
      methodId: string,
      message:
         | CommandWebviewMessage
         | ApiRequestWebviewMessage
         | InternalCommandWebviewMessage
   ): void {
      const messageType = message.type;

      switch (messageType) {
         case WebviewMessageType.Command:
            const commandMessage = message as CommandWebviewMessage;
            this.vscodeService.commands.executeCommand(
               commandMessage.command,
               message.data
            );
            break;
         case WebviewMessageType.InternalCommand:
            const internalCommandMessage =
               message as InternalCommandWebviewMessage;
            this.handleInternalCommand(methodId, internalCommandMessage);
            break;
         case WebviewMessageType.ApiRequest:
            this.handleWebviewApiRequest(
               message as ApiRequestWebviewMessage
            ).then(() => {});
            break;
         default:
            break;
      }
   }

   private async handleInternalCommand(
      webviewPanelId: string,
      internalCommand: InternalCommandWebviewMessage
   ): Promise<void> {
      const webviewPanelData = this.webviewPanels.get(webviewPanelId);
      const webviewPanelMetadata =
         webviewPanelData?.metadata as TestStormWebViewPanelMetadata;

      switch (internalCommand.internalCommand) {
         case AITestStormViewInternalCommand.GetFileTree:
            this.pushFileTreeToWebview(webviewPanelId);
            break;
         case AITestStormViewInternalCommand.GenerateTestCases:
            const casesCancelTokenSource =
               this.httpService.generateCancelTokenSource();
            this.unitTestCasesGenerationCancellationTokens.set(
               webviewPanelId,
               casesCancelTokenSource
            );

            const casesInputDto: GenerateUnitTestCasesInputDto =
               internalCommand.data;
            if (casesInputDto.testsFileUri) {
               const testsFileUri = Uri.parse(casesInputDto.testsFileUri);
               casesInputDto.testsCode = await this.fileService.readFileContent(
                  testsFileUri
               );
            }

            this.aiTestStormService
               .generateTestCasesWithAI(
                  internalCommand.data,
                  casesCancelTokenSource.token
               )
               .then((testCases: AITestCaseDto[]) => {
                  this.postWebviewPanelMessage(webviewPanelId, {
                     command: TestStormWebViewMessageCommand.SetTestCases,
                     data: testCases,
                  });
               })
               .catch((errResponse: any) => {
                  if (!errResponse) {
                     // Send error state to revert loading state
                     this.showErrorMessageInWebview(webviewPanelId, null);
                  }
                  if (errResponse.code === 'ERR_CANCELED') {
                     return;
                  }

                  const errorMessage = errResponse?.data?.message;
                  if (errorMessage) {
                     this.postWebviewPanelMessage(webviewPanelId, {
                        command:
                           TestStormWebViewMessageCommand.SetTestCasesErrorMessage,
                        data: errorMessage,
                     });
                  } else {
                     this.showErrorMessageInWebview(
                        webviewPanelId,
                        'Try again later'
                     );
                  }
               });
            break;
         case AITestStormViewInternalCommand.GenerateUnitTest:
            const unitTestsCancelTokenSource =
               this.httpService.generateCancelTokenSource();
            this.unitTestsGenerationCancellationTokens.set(
               webviewPanelId,
               unitTestsCancelTokenSource
            );

            const testsInputDto: GenerateUnitTestInputDto =
               internalCommand.data;
            if (testsInputDto.testsFileUri) {
               const testsFileUri = Uri.parse(testsInputDto.testsFileUri);
               testsInputDto.testsCode = await this.fileService.readFileContent(
                  testsFileUri
               );
            }

            this.aiTestStormService
               .generateUnitTestWithAI(
                  internalCommand.data,
                  unitTestsCancelTokenSource.token
               )
               .then((test: AITestCaseDto) => {
                  this.postWebviewPanelMessage(webviewPanelId, {
                     command: TestStormWebViewMessageCommand.UpsertUnitTests,
                     data: test,
                  });
               })
               .catch((errResponse: any) => {
                  if (!errResponse) {
                     // Send error state to revert loading state
                     this.showErrorMessageInWebview(webviewPanelId, null);
                  }

                  if (errResponse.code === 'ERR_CANCELED') {
                     return;
                  }

                  const errorMessage = errResponse?.data?.message;
                  if (errorMessage) {
                     this.postWebviewPanelMessage(webviewPanelId, {
                        command:
                           TestStormWebViewMessageCommand.SetUnitTestsErrorMessage,
                        data: {
                           id: testsInputDto.id,
                           message: errorMessage,
                        },
                     });
                  } else {
                     this.showErrorMessageInWebview(
                        webviewPanelId,
                        'Try again later'
                     );
                  }
               });
            break;
         case AITestStormViewInternalCommand.AddUnitTestsToExistingFile:
            const addUnitTestsDto =
               internalCommand.data as AddUnitTestsInternalCommandDto;
            const existingUnitTestsFileUri = Uri.parse(
               addUnitTestsDto.testFilePath
            );
            const testCode = this.concatenateUnitTestsCode(
               addUnitTestsDto.unitTests
            );

            this.fileService.appendToFile(existingUnitTestsFileUri, testCode, {
               openFile: true,
               selectAppendedContent: true,
            });
            break;
         case AITestStormViewInternalCommand.CreateNewFileWithUnitTests:
            const dto =
               internalCommand.data as CreateUnitTestsFileInternalCommandDto;
            const unitTestsCode = this.concatenateUnitTestsCode(dto.unitTests);
            const testMethodUri = webviewPanelMetadata.testMethodFileUri;
            const unitTestsFileUri = UriUtils.prependExtensionWith(
               testMethodUri,
               '.tests'
            );

            this.fileService.writeFile(unitTestsFileUri, unitTestsCode, {
               openFile: true,
            });

            break;
         case AITestStormViewInternalCommand.StopUnitTestCasesGeneration:
            this.stopUnitTestCasesGeneration(webviewPanelId);
            break;
         case AITestStormViewInternalCommand.StopUnitTestsGeneration:
            this.stopUnitTestsGeneration(webviewPanelId);
            break;
      }
   }

   private getWebviewResourceUri(
      path: string,
      webview: Webview
   ): Uri | string | undefined {
      let uri;

      if (IS_DEV) {
         uri = 'http://localhost:3000/' + path;
         return uri;
      } else {
         uri = Uri.joinPath(this.extensionUri, 'resources', path);
         return webview.asWebviewUri(uri);
      }
   }

   private getConfiguration(webview: Webview): WebViewConfig {
      if (!webview) {
         throw new Error('Webview is not initialized');
      }

      const webviewConfig: WebViewConfig = {
         id: 'test-storm',
         title: 'ZODs: AI Test Storm',
         scriptUri: IS_DEV
            ? 'http://localhost:3000/static/js/bundle.js'
            : webview.asWebviewUri(
                 Uri.joinPath(
                    this.extensionUri,
                    'out/views/web/test-storm',
                    'index.js'
                 )
              ),
         styleUris: [
            webview.asWebviewUri(
               Uri.joinPath(
                  this.extensionUri,
                  'out/views/web/test-storm',
                  'index.css'
               )
            ),
         ],
         env: {
            IS_PROD: true,
            ApiUrl: config.API_URL,
            WebUrl: config.WEB_URL,
            RawLogoUrl: this.getWebviewResourceUri(
               'contrast-logo.png',
               webview
            ),
            AITestStormIconUrl: this.getWebviewResourceUri(
               'icons/ai-test-storm.svg',
               webview
            ),
            TestIconUrl: this.getWebviewResourceUri(
               'icons/test-icon.svg',
               webview
            ),
            StormIconUrl: this.getWebviewResourceUri(
               'icons/storm-icon.svg',
               webview
            ),
         },
      };

      return webviewConfig;
   }

   private registerHostListeners(webview: Webview): Disposable[] {
      const textEditorListenerDisposable =
         this.vscodeService.window.onDidChangeActiveTextEditor(
            (editor?: TextEditor) => {
               if (editor) {
                  const fileExtension =
                     editor.document.fileName?.split('.').pop() || '';

                  // Send file extension to webview
                  webview.postMessage({
                     command: TestStormWebViewMessageCommand.SetFileExtension,
                     data: fileExtension,
                  });
               }
            }
         );

      return [textEditorListenerDisposable];
   }

   private showErrorMessageInWebview(
      webviewPanelId: string,
      message: string | null
   ): void {
      this.postWebviewPanelMessage(webviewPanelId, {
         command: TestStormWebViewMessageCommand.ShowErrorMessage,
         data: message,
      });
   }

   private stopUnitTestCasesGeneration(webviewPanelId: string): void {
      const cancelTokenSource =
         this.unitTestCasesGenerationCancellationTokens.get(webviewPanelId);
      if (cancelTokenSource) {
         cancelTokenSource.cancel();
      }
   }

   private stopUnitTestsGeneration(webviewPanelId: string): void {
      const cancelTokenSource =
         this.unitTestsGenerationCancellationTokens.get(webviewPanelId);
      if (cancelTokenSource) {
         cancelTokenSource.cancel();
      }
   }

   private concatenateUnitTestsCode(unitTests: AITestDto[]): string {
      const concatenatedCode = unitTests.reduce(
         (acc: string, unitTest: AITestDto) =>
            acc +
            CodeUtils.removeMarkdownCodeBlockSyntax(unitTest.code) +
            '\n\n',
         ''
      );

      return concatenatedCode;
   }

   private createWorkspaceFileSystemWatcher(): FileSystemWatcher {
      const watcher = this.workspaceService.createFileSystemWatcher('**/**');
      return watcher;
   }

   private pushFileTreeToWebview(webviewPanelId: string): void {
      this.workspaceService
         .getWorkspaceFileTree()
         .then((fileTree: FileTreeItem[]) => {
            this.postWebviewPanelMessage(webviewPanelId, {
               command: TestStormWebViewMessageCommand.SetFileTree,
               data: fileTree,
            });
         });
   }

   private pushFileTreeToAllWebviews(): void {
      this.webviewPanels.forEach((webviewPanelData) => {
         this.pushFileTreeToWebview(webviewPanelData.webviewId);
      });
   }
}
