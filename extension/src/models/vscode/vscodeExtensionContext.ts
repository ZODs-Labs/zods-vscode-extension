import { Memento, Uri } from 'vscode';

export interface IVSCodeExtensionContext {
   extensionPath: string;
   extensionUri: Uri;
   globalState: Memento;
   storagePath: string | undefined;
   subscriptions: Array<{ dispose: any }>;
   workspaceState: Memento;
}
