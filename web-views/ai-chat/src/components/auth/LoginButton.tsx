import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, ButtonProps } from '@chakra-ui/react';

import { Command } from '@zods/core';

const LoginButton = (props: ButtonProps) => {
   const handleLoginButtonClick = () => {
      vscode.postMessage({
         command: Command.Login,
         type: 'command',
      });
   };

   return (
      <Button
         {...props}
         colorScheme='fineGreen'
         onClick={handleLoginButtonClick}
         size='md'
         rightIcon={<ExternalLinkIcon boxSize='20px' />}
      >
         Log In
      </Button>
   );
};

export default LoginButton;
