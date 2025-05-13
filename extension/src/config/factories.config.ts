/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { interfaces } from 'inversify';

import { CommandRegistrationFactory } from '@factory';
import { IocSymbols } from '@ioc/symbols';
import { Class } from '@models/common';

import { CodeLensRegistrationFactory } from 'src/factory/code-lens-registration.factory';
import { SymbolMatcherFactory } from 'src/factory/symbol-macher.factory';
import { WebViewRegistrationFactory } from 'src/factory/web-view-registration.factory';

export const factoryInjectables: ReadonlyArray<
   [Class, interfaces.ServiceIdentifier<any>[]]
> = [
   [
      CommandRegistrationFactory,
      [IocSymbols.IVSCodeService, IocSymbols.IIocContainer],
   ],
   [
      WebViewRegistrationFactory,
      [IocSymbols.IVSCodeService, IocSymbols.IIocContainer],
   ],
   [
      CodeLensRegistrationFactory,
      [IocSymbols.IVSCodeService, IocSymbols.IIocContainer],
   ],
   [SymbolMatcherFactory, []],
];
