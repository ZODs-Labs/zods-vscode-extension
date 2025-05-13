import { Disposable } from 'vscode';

export interface IVSCodeCommands {
   executeCommand<T>(command: string, ...rest: any[]): Thenable<T | undefined>;
   registerCommand(
      command: string,
      callback: (args: any[]) => any,
      thisArg?: any
   ): Disposable;
}
