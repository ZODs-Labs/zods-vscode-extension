import { Disposable } from 'vscode';

export interface IGlobalStateStore {
   get<T>(key: string, defaultValue: T): T;

   update<T>(key: string, value: T): Promise<void>;

   onDidChange<T>(key: string, listener: (value: T) => any): Disposable;
}
