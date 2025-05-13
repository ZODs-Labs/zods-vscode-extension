/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { interfaces } from 'inversify';

import { IocSymbols } from '@ioc/symbols';
import { Class } from '@models/common';
import {
   AIFeaturesCodeLensProvider,
   CommonCodeLensProvider,
} from '@providers/code-lens';
import BaseAbstractLensCodeProvider from '@providers/code-lens/base-code-lens.provider';

/**
 * Collection of all code lens providers in the extension.
 * This collection is used as a source of truth for the code lens registration factory.
 */
export const codeLensProviderSymbols = [
   IocSymbols.IAIFeaturesCodeLensProvider,
   IocSymbols.ICommonCodeLensProvider,
];

const codeLensProvidersInjectables: ReadonlyArray<
   [Class, interfaces.ServiceIdentifier<any>[]]
> = [
   [BaseAbstractLensCodeProvider as any, []],
   [
      AIFeaturesCodeLensProvider,
      [
         IocSymbols.IOutputChannelService,
         IocSymbols.IVSCodeService,
         IocSymbols.IAILensSyncService,
         IocSymbols.IGlobalStateStore,
      ],
   ],
   [
      CommonCodeLensProvider,
      [IocSymbols.IOutputChannelService, IocSymbols.IVSCodeService],
   ],
];

export default codeLensProvidersInjectables;
