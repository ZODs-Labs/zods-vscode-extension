/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { interfaces } from 'inversify';
import { GlobalStateStore } from 'src/stores/global.store';

import { IocSymbols } from '@ioc/symbols';
import { Class } from '@models/common';

export const storeInjectables: ReadonlyArray<[
   Class,
   interfaces.ServiceIdentifier<any>[]
]> = [[GlobalStateStore, [IocSymbols.IVSCodeService]]];
