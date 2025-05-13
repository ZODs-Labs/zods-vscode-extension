import { useState } from 'react';

import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Text, Flex, IconButton, useClipboard, Box } from '@chakra-ui/react';

import { HighLightedCode } from './HighlightedCode';

const CodeBlock = ({ language, value }: any) => {
   const [copied, setCopied] = useState(false);
   const { onCopy } = useClipboard(value);

   const handleCopy = () => {
      onCopy();

      setCopied(true);
      setTimeout(() => {
         setCopied(false);
      }, 1500);
   };

   return (
      <Flex
         direction='column'
         minW='360px'
         minH='120px'
         rounded='md'
         overflow='hidden'
      >
         <Flex
            className='code-header'
            justify='space-between'
            align='center'
            pl={3}
            bg='var(--vscode-dropdown-background)'
            h='40px'
         >
            <Text fontSize='xs' fontWeight={500}>
               {language}
            </Text>
            <Box pr={2}>
               {copied ? (
                  <Flex gap={1} alignItems='center'>
                     <CheckIcon
                        color='var(--vscode-foreground)'
                        boxSize='14px'
                     />
                     <Text fontSize='xs' color='var(--vscode-foreground)'>
                        Copied!
                     </Text>
                  </Flex>
               ) : (
                  <IconButton
                     bg='transparent'
                     onClick={handleCopy}
                     minW='auto'
                     icon={
                        <CopyIcon
                           boxSize='18px'
                           color='var(--vscode-foreground)'
                           opacity={0.7}
                           _hover={{ opacity: 1 }}
                        />
                     }
                     _hover={{ bg: 'transparent' }}
                     aria-label='Copy'
                     rounded='none'
                  />
               )}
            </Box>
         </Flex>
         <HighLightedCode language={language} code={value || ''} />
      </Flex>
   );
};

export default CodeBlock;
