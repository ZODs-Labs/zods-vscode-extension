import { Uri } from 'vscode';

export interface IUriManager {
   handleUri(uri: Uri): void;
}
