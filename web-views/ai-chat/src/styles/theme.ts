import { extendTheme } from '@chakra-ui/react';

import { coreStyles } from '@zods/webview-core';

export const theme: any = extendTheme(coreStyles, {
   initialColorMode: 'dark',
   useSystemColorMode: false,
});
