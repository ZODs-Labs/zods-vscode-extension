import { Uri } from 'vscode';

export interface IVSCodeEnv {
   appName: string;
   language: string;
   uriScheme: string;
   openExternal(target: Uri): Thenable<boolean>;
}
