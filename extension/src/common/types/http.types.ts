/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { KeyValueMap } from './common.types';

export interface HttpRequestParams {
   queryParams?: KeyValueMap;
   routeParams?: KeyValueMap;
}
