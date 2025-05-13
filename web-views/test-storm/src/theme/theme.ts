import { extendTheme } from '@chakra-ui/react';

import { globalStyles } from './styles';

const breakpoints = {
   base: '0px',
   sm: '400px',
   md: '768px',
   lg: '1024px',
   xl: '1440px',
};

export default extendTheme(globalStyles, breakpoints, {
   initialColorMode: 'dark',
   useSystemColorMode: false,
});
