import { Button } from './components/button';
import { Link } from './components/link';

export const coreStyles: any = {
   initialColorMode: 'dark',
   colors: {
      gray: {
         700: '#1f2733',
      },
      vscodeDark: {
         100: '#8a8a8a',
         200: '#7a7a7a',
         300: '#6a6a6a',
         400: '#5a5a5a',
         500: '#4a4a4a',
         600: '#3a3a3a',
         700: '#2a2a2a',
         800: '#1f1f1f',
         900: '#1e1e1e',
      },
      fineGreen: {
         50: '#e0f4f4',
         100: '#b3e4e5',
         200: '#80d3d5',
         300: '#4dc2c5',
         400: '#26b4b7',
         500: '#12978a',
         600: '#0e7c70',
         700: '#0a6157',
         800: '#07473f',
         900: '#032d28',
      },
      stormBlue: {
         50: '#e6f3ff', // much lighter than the base color
         100: '#b3dbff', // lighter than the base color
         200: '#80c2ff', // slightly lighter than the base color
         300: '#4daaff', // even lighter than the base color
         400: '#1a91ff', // a little lighter than the base color
         500: '#38B6FF', // the base color
         600: '#339fd6', // slightly darker than the base color
         700: '#2e89ae', // darker than the base color
         800: '#276e85', // even darker than the base color
         900: '#21575d', // much darker than the base color
      },
   },
   styles: {
      global: () => ({
         body: {
            bg: 'var(--vscode-activityBar-background)',
            color: 'var(--vscode-activityBar-foreground)',
            p: '0',
         },
         html: {
            fontFamily: 'var(--vscode-font-family)',
            fontWeight: 'var(--vscode-font-weight)',
         },
      }),
   },
   components: {
      Button,
      Link,
   },
};
