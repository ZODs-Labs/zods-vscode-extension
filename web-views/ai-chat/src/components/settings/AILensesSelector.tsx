import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Divider, Flex, Grid, Text, Tooltip, useToast } from '@chakra-ui/react';

import AILensesSelectorItem from './AILensesSelectorItem';
import { useTempState, StateKeys } from '@zods/webview-core';
import { AICodeLens, Command } from '@zods/core';

const AILensesGrid = ({ aiLenses }: { aiLenses: AICodeLens[] }) => {
   const toast = useToast();

   const handleSwitchChange = (id: string, enabled: boolean) => {
      vscode.postMessage({
         type: 'command',
         command: Command.SetIsAILensEnabled,
         data: {
            aiLensId: id,
            isEnabled: enabled,
         },
      });

      toast({
         title: `AI Lens ${enabled ? 'enabled' : 'disabled'}.`,
         status: 'success',
         duration: 3000,
         isClosable: true,
      });
   };

   return (
      <Grid
         templateColumns={{
            base: '1fr',
            sm: 'minmax(auto, max-content) 1fr',
         }}
         gap={6}
         autoRows='auto'
      >
         {aiLenses.filter(Boolean).map((lens: AICodeLens) => (
            <AILensesSelectorItem
               id={lens.id}
               label={lens.name}
               enabled={lens.isEnabled}
               readonly={lens.readonly}
               onSwitchChange={handleSwitchChange}
            />
         ))}
      </Grid>
   );
};

interface Props {
   builtInDisabled: boolean;
}
const AILensesSelector = ({ builtInDisabled }: Props) => {
   const { getTempStateValue } = useTempState();
   const aiLenses =
      (getTempStateValue(StateKeys.AILenses) as AICodeLens[]) || [];
   // ([
   //    {
   //       id: 'a7a7270c-fa37-497d-8226-5c676a7dbc1b',
   //       name: 'Refactor Method',
   //       tooltip: 'Refactor this method using ZODs AI.',
   //       targetKind: AILensTargetKind.Method,
   //       isEnabled: true,
   //       isBuiltIn: true,
   //    },
   //    {
   //       id: 'e3daefd9-ab2b-4789-9eba-146bebfbdb57',
   //       name: 'Explain Code',
   //       tooltip: 'Explain this method code using ZODs AI.',
   //       targetKind: AILensTargetKind.Method,
   //       isEnabled: true,
   //       isBuiltIn: true,
   //    },
   //    {
   //       id: '35c83acc-bc23-4e6d-ae3a-dac86f2eda36',
   //       name: 'Scan Bugs',
   //       tooltip:
   //          'Scan this method for bugs using ZODs AI powered analysis.',
   //       targetKind: AILensTargetKind.Method,
   //       isEnabled: true,
   //       isBuiltIn: false,
   //    },
   // ] as AICodeLens[]);

   const builtInLenses = aiLenses
      .filter((lens) => lens.isBuiltIn)
      ?.map((lens: AICodeLens) => ({
         ...lens,
         readonly: !!builtInDisabled,
      }));
   const userDefinedLenses = aiLenses.filter((lens) => !lens.isBuiltIn);

   return (
      <Flex direction='column' gap={3}>
         <Flex gap={3} align='center'>
            <Text fontSize='2xl'>AI Lenses</Text>
            <Tooltip
               label='If you use own API key, intelligent built-in AI lenses will be disabled by default.'
               placement='right'
            >
               <QuestionOutlineIcon
                  cursor='pointer'
                  w='17px'
                  h='17px'
                  aria-label='Note'
               />
            </Tooltip>
         </Flex>
         <Divider w='100px' />
         <Flex direction='column' gap={10}>
            <Flex direction='column' gap={4}>
               <Text fontSize='xl'>Built-In</Text>
               {builtInLenses.length > 0 ? (
                  <AILensesGrid aiLenses={builtInLenses} />
               ) : (
                  <Text fontSize='sm' fontStyle='italic' opacity={0.6}>
                     No built-in AI lenses available.
                  </Text>
               )}
            </Flex>

            <Flex direction='column' gap={4}>
               <Text fontSize='xl'>User Defined</Text>
               {userDefinedLenses.length > 0 ? (
                  <AILensesGrid aiLenses={userDefinedLenses} />
               ) : (
                  <Text fontSize='sm' fontStyle='italic' opacity={0.6}>
                     No user defined AI lenses available.
                  </Text>
               )}
            </Flex>
         </Flex>
      </Flex>
   );
};

export default AILensesSelector;
