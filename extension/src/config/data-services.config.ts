/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { interfaces } from 'inversify';
import { AILensDataService } from 'src/data-services/ai-lens.dataservice';

import { SnippetsDataService } from '@data-services';
import { IocSymbols } from '@ioc/symbols';
import { Class } from '@models/common';

export const dataServiceInjectables: ReadonlyArray<[
   Class,
   interfaces.ServiceIdentifier<any>[]
]> = [
   [
      SnippetsDataService,
      [IocSymbols.IHttpService, IocSymbols.IOutputChannelService],
   ],
   [
      AILensDataService,
      [IocSymbols.IHttpService, IocSymbols.IOutputChannelService],
   ],
];
