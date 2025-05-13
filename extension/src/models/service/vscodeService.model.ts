import { Uri } from 'vscode';

import {
   IVSCodeAuthentication,
   IVSCodeEnv,
   IVSCodeExtensionContext,
   IVSCodeLanguages,
   IVSCodeWorkspace,
} from '@models/vscode';
import { IVSCodeCommands } from '@models/vscode/vscodeCommands';
import { IVSCodeWindow } from '@models/vscode/vscodeWindow';

export interface IVSCodeService {
   context: IVSCodeExtensionContext;
   env: IVSCodeEnv;
   commands: IVSCodeCommands;
   version: string;
   window: IVSCodeWindow;
   languages: IVSCodeLanguages;
   authentication: IVSCodeAuthentication;
   workspace: IVSCodeWorkspace;

   getTextFromDocumentRange(documentUri: Uri, range: any): string;
}
