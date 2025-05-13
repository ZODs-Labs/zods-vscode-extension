interface VsCodeApi {
   postMessage({
      command,
      data,
      type,
   }: {
      command: string;
      data?: any;
      type?: 'command';
   }): void;
}

declare const vscode: VsCodeApi;
