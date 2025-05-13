/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ExtensionContext } from 'vscode';

import { RootService } from '@core/services';
import { IExtensionManager } from '@models/managers';

import { IocSymbols } from './ioc';

export async function activate(context: ExtensionContext) {
   try {
      const rootService = new RootService(context);
      const extensionManager: IExtensionManager =
         rootService.get<IExtensionManager>(IocSymbols.IExtensionManager);
      await extensionManager.activate();
   } catch (error) {
      console.error(error);
   }
}

export function deactivate() {}
