/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { interfaces } from 'inversify';

import AuthenticationUriHandler from '@handlers/uri/authentication-uri.handler';
import { IocSymbols } from '@ioc/symbols';
import { Class } from '@models/common';

export const uriHandlersInjectables: ReadonlyArray<[
   Class,
   interfaces.ServiceIdentifier<any>[]
]> = [
   [
      AuthenticationUriHandler,
      [
         IocSymbols.IVSCodeService,
         IocSymbols.IAuthService,
         IocSymbols.ISnippetsDataService,
      ],
   ],
];

export const uriHandlerSymbols: symbol[] = [
   IocSymbols.IAuthenticationUriHandler,
];

export default uriHandlersInjectables;
