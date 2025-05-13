import { IVSCodeAuthentication } from './vscodeAuthentication';
import { IVSCodeCommands } from './vscodeCommands';
import { IVSCodeEnv } from './vscodeEnv';
import { IVSCodeLanguages } from './vscodeLanguages';
import { IVSCodeWindow } from './vscodeWindow';
import { IVSCodeWorkspace } from './vscodeWorkspace';

export interface IVSCode {
   window: IVSCodeWindow;
   commands: IVSCodeCommands;
   version: string;
   env: IVSCodeEnv;
   workspace: IVSCodeWorkspace;
   languages: IVSCodeLanguages;
   authentication: IVSCodeAuthentication;
}
