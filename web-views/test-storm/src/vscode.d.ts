interface VsCodeApi {
   postMessage(message: any): void;
}

declare const vscode: VsCodeApi;
