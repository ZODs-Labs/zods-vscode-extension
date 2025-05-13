import { WorkspaceConfiguration } from 'vscode';

import { IVSCodeWorkspace } from '@models/vscode';
import { FileTreeItem } from '@zods/core';

export interface IWorkspaceService extends IVSCodeWorkspace {
   getExtensionWorkspaceConfiguration(): WorkspaceConfiguration;

   getWorkspaceFileTree(): Promise<FileTreeItem[]>;
}
