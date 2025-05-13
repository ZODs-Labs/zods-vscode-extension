import {
   Box,
   Divider,
   Flex,
   IconButton,
   Text,
   Tooltip,
} from '@chakra-ui/react';

import { TrashIcon } from 'lucide-react';

import { AITestCaseDto } from '@zods/core';

import AITestStormItemAttributes from '../AITestStormItemAttributes';
import TestCaseTypeBadge from '../TestCaseTypeBadge';

interface AITestStormTestCaseItemProps {
   index: number;
   testCase: AITestCaseDto;
   onRemove: (index: number) => void;
}

const AITestStormTestCaseItem = ({
   index,
   testCase,
   onRemove,
}: AITestStormTestCaseItemProps) => {
   const handleRemoveTestCase = () => {
      onRemove(index);
   };

   return (
      <Flex direction='column' alignItems='start' gap={1} flex={1}>
         <Flex w='full' justifyContent='space-between'>
            <Flex gap={2} alignItems='center'>
               <TestCaseTypeBadge type={testCase.type} />
               <Text fontSize='lg'>{testCase.title}</Text>
            </Flex>

            <Box>
               <Tooltip label='Remove test case' placement='top' hasArrow>
                  <IconButton
                     variant='outline'
                     _hover={{
                        border: '1px solid',
                        borderColor: 'red.300',
                        color: 'red.300',
                     }}
                     icon={<TrashIcon width='18px' />}
                     aria-label='Delete test case'
                     onClick={handleRemoveTestCase}
                  />
               </Tooltip>
            </Box>
         </Flex>

         <AITestStormItemAttributes
            when={testCase.when}
            given={testCase.given}
            then={testCase.then}
            px={0}
         />

         <Divider w='full' />
      </Flex>
   );
};

export default AITestStormTestCaseItem;
