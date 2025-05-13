import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Flex, Button } from '@chakra-ui/react';

import { ENV } from '../../env';
import AILensesSelector from './AILensesSelector';
import { Command } from '@zods/core';

interface Props {
   openAIApiKey: string;
}

export default function AILensSettings({ openAIApiKey }: Props) {
   const handleAddAILensButtonClick = () => {
      vscode.postMessage({
         command: 'openUrl',
         data: `${ENV.WebUrl}/lens/create`,
      });
   };

   const handleSyncAILensesButtonClick = () => {
      vscode.postMessage({
         type: 'command',
         command: Command.SyncAILensesCommand,
      });
   };

   return (
      <Flex direction='column' gap={10}>
         <AILensesSelector builtInDisabled={!!openAIApiKey} />

         <Flex gap={2} wrap='wrap'>
            <Button
               className='vscode-button'
               rightIcon={
                  <ExternalLinkIcon
                     width='22px'
                     height='22px'
                     aria-label='Link'
                  />
               }
               width='200px'
               onClick={handleAddAILensButtonClick}
            >
               Add AI Lens
            </Button>

            <Button
               className='vscode-button'
               onClick={handleSyncAILensesButtonClick}
               w='200px'
            >
               Sync AI Lenses
            </Button>
         </Flex>
      </Flex>
   );
}
