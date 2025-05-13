import { Disposable, Webview, WebviewPanel } from 'vscode';

export interface IWebViewPanelDetails {
   panel: WebviewPanel;
   webviewId: string;
   metadata: IWebViewPanelMetadata;
   disposables: Disposable[];
}

export type WebviewPanelMap = Map<string, IWebViewPanelDetails>;

export interface IWebViewPanelMetadata {}

export interface IAbstractWebViewManager {
   createWebviewPanel(
      webviewId: string,
      metadata: IWebViewPanelMetadata
   ): Webview;

   disposeWebviewPanel(webviewId: string): void;
}
