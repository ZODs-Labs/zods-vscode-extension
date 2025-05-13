import { Uri } from 'vscode';

export interface ICommandHandler {
   id: string; // A unique identifier for the command, e.g., "zods.login"
   handle(...args: any[]): void | Promise<void>;
}

export interface IUriHandler {
   canHandle(uri: Uri): boolean;
   handle(uri: Uri): void | Promise<void>;
}
