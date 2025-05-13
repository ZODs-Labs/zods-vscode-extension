/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
   WorkspaceFolder,
   FileSystem,
   ConfigurationChangeEvent,
   Uri,
   WorkspaceConfiguration,
   CancellationToken,
   FileType,
   TextDocument,
} from 'vscode';

import ignore, { Ignore } from 'ignore';

import config from '@config/constants';
import { IWorkspaceService } from '@models/service';
import { IVSCode } from '@models/vscode';
import {
   IVSCodeEvent,
   IVSCodeRelativePattern,
   IVSCodeWorkspace,
} from '@models/vscode/vscodeWorkspace';
import { FileTreeItem } from '@zods/core';

export class WorkspaceService implements IWorkspaceService {
   constructor(private vscode: IVSCode) {}

   private get workspace(): IVSCodeWorkspace {
      return this.vscode.workspace;
   }

   get rootPath(): string | undefined {
      return this.workspace.rootPath;
   }

   get workspaceFolders(): readonly WorkspaceFolder[] | undefined {
      return this.workspace.workspaceFolders;
   }

   get fs(): FileSystem {
      return this.workspace.fs;
   }

   get onDidChangeConfiguration(): IVSCodeEvent<ConfigurationChangeEvent> {
      return this.workspace.onDidChangeConfiguration;
   }

   get createFileSystemWatcher() {
      return this.workspace.createFileSystemWatcher;
   }

   openTextDocument(uri: Uri): Thenable<TextDocument> {
      return this.workspace.openTextDocument(uri);
   }

   getConfiguration(
      section?: string | undefined,
      resource?: Uri | undefined
   ): WorkspaceConfiguration {
      return this.workspace.getConfiguration(section, resource);
   }
   findFiles(
      include: string | IVSCodeRelativePattern,
      exclude?: (string | IVSCodeRelativePattern) | undefined,
      maxResults?: number | undefined,
      token?: CancellationToken | undefined
   ): Thenable<Uri[]> {
      return this.workspace.findFiles(include, exclude, maxResults, token);
   }

   public getExtensionWorkspaceConfiguration(): WorkspaceConfiguration {
      const settings = this.workspace.getConfiguration(config.EXTENSION_ID);
      return settings;
   }

   public async getWorkspaceFileTree(): Promise<FileTreeItem[]> {
      const folderUri = this.workspace.workspaceFolders?.[0].uri;
      if (!folderUri) {
         return [];
      }

      return await this.readDirectoryIterative(folderUri);
   }

   private async readDirectoryIterative(uri: Uri): Promise<FileTreeItem[]> {
      const ig = await this.getGitIgnorePatterns(uri);
      const queue: { uri: Uri; parent?: FileTreeItem }[] = [{ uri }];
      const root: FileTreeItem = {
         label: uri.path.split('/').pop() || uri.path, // Get the last segment of the path
         type: FileType.Directory,
         children: [],
         path: uri.path, // Set the root path
         relativePath: '/', // Set the root relative path
      };

      while (queue.length > 0) {
         const { uri, parent } = queue.shift()!;
         const entries = await this.workspace.fs.readDirectory(uri);
         const currentDirectory: FileTreeItem = parent || root;

         for (const [name, type] of entries) {
            if (ig.ignores(name) || this.isNonCodeFile(name)) {
               continue; // Skip files/folders as per .gitignore and non-code files
            }

            const childUri = Uri.joinPath(uri, name);
            const childPath = childUri.path; // Get full path for the child
            const childItem: FileTreeItem = {
               label: name,
               type,
               path: childPath, // Set the path for the child
               relativePath: childPath.replace(root.path, ''), // Set the relative path for the child
            };

            if (type === FileType.Directory) {
               childItem.children = [];
               queue.push({ uri: childUri, parent: childItem });
            }

            if (currentDirectory.children) {
               currentDirectory.children.push(childItem);
            }
         }

         // Sort the current directory's children
         if (currentDirectory.children) {
            currentDirectory.children.sort((a, b) => {
               if (
                  a.type === FileType.Directory &&
                  b.type !== FileType.Directory
               ) {
                  return -1;
               }
               if (
                  a.type !== FileType.Directory &&
                  b.type === FileType.Directory
               ) {
                  return 1;
               }
               return a.label.localeCompare(b.label);
            });
         }
      }

      return root.children || [];
   }

   private isNonCodeFile(fileName: string): boolean {
      // Define logic to determine if a file is a non-code file (e.g., based on file extensions)
      const nonCodeExtensions = [
         '.png',
         '.jpg',
         '.gif',
         '.jpeg',
         '.svg',
         '.pdf',
         '.md',
         '.txt',
         '.json',
         '.yml',
         '.yaml',
         '.gitignore',
         '.gitkeep',
         '.git',
         '.lock',
         '.lock.json',
         '.lock.yaml',
      ];
      return nonCodeExtensions.some((ext) => fileName.endsWith(ext));
   }

   private async getGitIgnorePatterns(uri: Uri): Promise<Ignore> {
      const gitIgnoreUri = Uri.joinPath(uri, '.gitignore');
      let ig = ignore();
      try {
         const gitIgnoreContent = await this.workspace.fs.readFile(
            gitIgnoreUri
         );
         ig = ignore().add(gitIgnoreContent.toString());
      } catch {}
      return ig;
   }
}
