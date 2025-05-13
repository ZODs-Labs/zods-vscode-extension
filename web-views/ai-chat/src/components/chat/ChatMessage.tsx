import { Box, Flex, Text } from '@chakra-ui/react';

import { MarkdownRenderer } from '@zods/webview-core';

import { ENV } from '../../env';
import { ChatMessageType } from '../../shared/enums/chat-message-type.enum';
import { Message } from '../../shared/types/chat.types';
import CenteredContainer from '../CenteredContainer';
import { TypingIndicator } from '../shared/animations/TypingIndicator';

const ChatMessage = ({ content, type, isError }: Message) => {
   const isUser = type === ChatMessageType.User;

   return (
      <Flex
         w='full'
         justify='start'
         py='24px'
         px='16px'
         bg={isUser ? 'transparent' : 'var(--vscode-editor-background)'}
         color={isUser ? '' : 'var(--vscode-editor-foreground)'}
      >
         <CenteredContainer>
            <Flex justify='start' gap={7} w='full'>
               <Flex
                  h='40px'
                  w='40px'
                  minW='40px'
                  rounded={10}
                  bg={isUser ? 'gray.600' : '#6f6f6f'}
                  justify='center'
                  align='center'
                  fontWeight='bold'
               >
                  {isUser ? (
                     'U'
                  ) : (
                     <img
                        src={ENV.RawLogoUrl}
                        width='26px'
                        height='26px'
                        alt='ZODs AI'
                     />
                  )}
               </Flex>
               <Box
                  fontSize={{
                     base: '14px',
                     sm: '15px',
                     md: '16px',
                     lg: '17px',
                  }}
                  maxW='calc(100% - 60px)'
               >
                  {type === ChatMessageType.User ? (
                     <pre>
                        <Text className='user-message'>{content}</Text>
                     </pre>
                  ) : content ? (
                     <MarkdownRenderer
                        className={isError ? 'vscode-error-foreground' : ''}
                        content={content as string}
                        isError={isError}
                     />
                  ) : (
                     <TypingIndicator />
                  )}
               </Box>
            </Flex>
         </CenteredContainer>
      </Flex>
   );
};

export default ChatMessage;
