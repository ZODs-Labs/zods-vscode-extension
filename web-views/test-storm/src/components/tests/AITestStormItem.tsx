import { useEffect, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
   Flex,
   Collapse,
   Text,
   IconButton,
   Tooltip,
   Box,
} from '@chakra-ui/react';

import { ChevronsDown, RefreshCw } from 'lucide-react';

import { AITestDto } from '@zods/core';
import {
   FlexCentered,
   MarkdownRenderer,
   ShScaleFade,
   TypingIndicator,
} from '@zods/webview-core';

import { useGenerateUnitTestsApi } from '../../hooks/useGenerateUnitTestsApi';
import AITestStormItemAttributes from './AITestStormItemAttributes';
import TestCaseTypeBadge from './TestCaseTypeBadge';

interface AITestItemProps {
   test: AITestDto;
}
const AITestItem = ({ test }: AITestItemProps) => {
   const [isExpanded, setIsExpanded] = useState(true);
   const [isLoadingCode, setIsLoadingCode] = useState(false);
   const rotateIcon = isExpanded ? '180deg' : '0deg';

   const { title, type, when, then, given, code, errorMessage } = test;

   const { generateUnitTests } = useGenerateUnitTestsApi();

   useEffect(() => {
      setIsLoadingCode(!code);
   }, [code]);

   useEffect(() => {
      if (errorMessage) {
         setIsLoadingCode(false);
      }
   }, [errorMessage]);

   const handleRegenerateButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      setIsLoadingCode(true);

      // Generate test again and upsert the test list
      generateUnitTests([test]);
   };

   return (
      <ShScaleFade
         style={{
            width: '100%',
         }}
      >
         <Flex
            flex={1}
            direction='column'
            gap={3}
            borderWidth={1}
            borderColor='var(--vscode-editorWidget-border)'
            rounded='lg'
            overflow='hidden'
            w='full'
         >
            <Flex
               direction='column'
               p={4}
               cursor='pointer'
               onClick={() =>
                  setIsExpanded((val) => (isLoadingCode ? val : !val))
               }
            >
               <Flex justify='space-between'>
                  <Flex
                     flex={1}
                     pb={2}
                     direction='column'
                     gap={3}
                     alignItems='start'
                  >
                     <Flex alignItems='center' gap={2}>
                        <TestCaseTypeBadge type={type} />
                        <Text as='h3' fontSize='lg'>
                           {title}
                        </Text>
                        <ChevronDownIcon
                           w='20px'
                           h='20px'
                           color='stormBlue.500'
                           transition='transform 0.2s'
                           transform={`rotate(${rotateIcon})`}
                        />
                     </Flex>

                     <AITestStormItemAttributes
                        when={when}
                        then={then}
                        given={given}
                     />
                  </Flex>

                  <Box>
                     <Tooltip
                        label={
                           isLoadingCode
                              ? 'Generating test...'
                              : 'Regenerate test'
                        }
                        placement='top'
                     >
                        <IconButton
                           icon={<RefreshCw strokeWidth={1.2} />}
                           aria-label='Regenerate'
                           onClick={handleRegenerateButtonClick}
                           isDisabled={isLoadingCode}
                        />
                     </Tooltip>
                  </Box>
               </Flex>

               {!isExpanded && (
                  <FlexCentered
                     w='full'
                     gap={1}
                     alignItems='center'
                     opacity={0.8}
                  >
                     <Flex
                        w='210px'
                        gap={1}
                        justify='center'
                        rounded='lg'
                        bg='var(--vscode-inputOption-hoverBackground)'
                        px={5}
                        py={2}
                     >
                        <ChevronsDown strokeWidth={1.5} size={22} />
                        <Text fontSize='sm'>Expand to see code</Text>
                     </Flex>
                  </FlexCentered>
               )}
            </Flex>
            <Collapse in={isExpanded} animateOpacity>
               <Flex bg='#2b2b2b' roundedBottom='lg' p={1.5}>
                  {isLoadingCode && !errorMessage ? (
                     <FlexCentered
                        direction='column'
                        gap={1}
                        w='full'
                        h='100px'
                     >
                        <TypingIndicator />
                        <Text
                           fontSize='sm'
                           color='var(--vscode-disabledForeground)'
                        >
                           Generating test...
                        </Text>
                     </FlexCentered>
                  ) : (
                     <MarkdownRenderer
                        className='markdown-error'
                        content={errorMessage || code}
                        isError={!!errorMessage}
                     />
                  )}
               </Flex>
            </Collapse>
         </Flex>
      </ShScaleFade>
   );
};

export default AITestItem;
