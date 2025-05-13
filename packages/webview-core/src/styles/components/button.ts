import { defineStyleConfig } from '@chakra-ui/react';

export const Button: any = defineStyleConfig({
   variants: {
      'vscode-primary': {
         bg: 'var(--vscode-button-background)',
         color: 'var(--vscode-button-foreground)',
         _hover: {
            bg: 'var(--vscode-button-hoverBackground) !important',
            color: 'var(--vscode-button-hoverForeground) !important',
         },
      },
   },
});
