import { Disposable, WebviewView } from 'vscode';

export interface IWebViewListener {
   register(view: WebviewView): Disposable;
}
