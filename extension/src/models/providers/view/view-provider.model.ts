import { WebviewViewProvider } from 'vscode';

import { AIChatCommand } from '@common/enums/ai-chat-command.enum';

import { WebViewConfig } from './web-view.config';

export interface IWebViewProvider extends WebviewViewProvider {
   id: string;
   getConfiguration(): WebViewConfig;
   postMessageToView(
      command: string,
      data: any,
      chatCommand?: AIChatCommand,
      chatCommandMetadata?: any
   ): void;
   ensureWebViewIsOpen(): Promise<void>;
}
