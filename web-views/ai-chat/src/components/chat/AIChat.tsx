/* eslint-disable no-loop-func */
import { useEffect, useMemo, useRef, useState } from 'react';

import { SettingsIcon } from '@chakra-ui/icons';
import {
   Flex,
   VStack,
   Button,
   Textarea,
   useToast,
   IconButton,
   Tooltip,
   Text,
   Box,
   Badge,
} from '@chakra-ui/react';

import { MessageCommand, generateGuid } from '@zods/core';
import {
   FlexCentered,
   StateKeys,
   useTempState,
   useVSCodeMessageSubscriber,
} from '@zods/webview-core';

import { GptApi } from '../../api/ai.api';
import { ENV } from '../../env';
import { AIChatCommand } from '../../shared/enums/ai-chat-command.enum';
import { ChatMessageType } from '../../shared/enums/chat-message-type.enum';
import { Message } from '../../shared/types/chat.types';
import BrandLogo from '../BrandLogo';
import CenteredContainer from '../CenteredContainer';
import LoginButton from '../auth/LoginButton';
import CodeSnippetModalButton from '../code/CodeSnippetModalButton';
import ChatWelcomePanel from '../welcome-panel/ChatWelcomePanel';
import ChatMessage from './ChatMessage';
import UserChatCommandBox from './UserChatCommandBox';

// Debounce function to limit the rate at which a function can fire
const debounce = (func: any, wait: any) => {
   let timeout: any;
   return function executedFunction(...args: any) {
      const later = () => {
         clearTimeout(timeout);
         func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
   };
};

// Thresholds
const scrollUpThreshold = 100;
const bottomThreshold = 10;
const initialTextAreaHeight = 40;

export const AIChat = () => {
   const textareaRef = useRef<HTMLTextAreaElement | null>(null);
   const messagesContainerRef = useRef<HTMLDivElement | null>(null);
   const [textareaValue, setTextareaValue] = useState<string>('');
   const [textareaHeight, setTextareaHeight] = useState<number>(
      initialTextAreaHeight
   );
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   // Auto scroll to bottom of messages container is enabled by default
   // if the user scrolls up, auto scroll will be disabled for that session.
   const [isAutoScrollEnabled, setIsAutoScrollEnabled] =
      useState<boolean>(true);
   const lastScrollTopRef = useRef<number>(0);

   // AbortController to abort the current prompt request
   const promptRequestControllerAbort = useRef<AbortController>(
      new AbortController()
   );

   const { isAuthenticated, getTempStateValue, setTempStateValue } =
      useTempState();
   const authToken = getTempStateValue(StateKeys.AuthToken);
   const aiModel = getTempStateValue(StateKeys.AIModel);
   const chatCodeContext = getTempStateValue(StateKeys.AIChatCodeContext);
   const fileExtension = getTempStateValue(StateKeys.FileExtension);
   const maxTokens = getTempStateValue(StateKeys.MaxAIChatTokens) || 500;
   const openAIApiKey = getTempStateValue(StateKeys.OpenAIApiKey);

   const toast = useToast();
   const chatId = useRef<string>(generateGuid());

   useEffect(() => {
      if (isAutoScrollEnabled && messagesContainerRef.current) {
         messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
      }
   }, [messages]);

   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setTextareaValue(value);
   };

   const resizeTextarea = (reset?: boolean) => {
      if (textareaRef.current) {
         // Reset height to 'auto' to shrink the textarea first.
         textareaRef.current.style.height = 'auto';

         const textareaHeight = reset
            ? initialTextAreaHeight
            : textareaRef.current.scrollHeight;

         // Set height to match the scrollHeight.
         textareaRef.current.style.height = `${textareaHeight}px`;
         setTextareaHeight(textareaHeight);

         // Optionally, add scrolling after a certain height.
         if (textareaHeight > 200) {
            textareaRef.current.style.overflowY = 'scroll';
         } else {
            textareaRef.current.style.overflowY = 'hidden';
         }
      }
   };

   const addMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      // Scroll to bottom of messages container
      if (messagesContainerRef.current && isAutoScrollEnabled) {
         messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
      }
   };

   const addUserMessage = (message: string | React.ReactNode) => {
      addMessage({
         type: ChatMessageType.User,
         content: message,
      });

      setTextareaValue('');
      resizeTextarea(true);
   };

   const replaceLastSystemMessage = (message: Message) => {
      setMessages((prev: Message[]) => {
         const msgType = prev[prev.length - 1]?.type;
         if (msgType === ChatMessageType.System) {
            return [...prev.slice(0, -1), message];
         }

         return prev;
      });
   };

   const removeLastEmptySystemMessage = () => {
      setMessages((prevMessages) => {
         if (prevMessages.length === 0) {
            return prevMessages;
         }

         const lastMessage = prevMessages[prevMessages.length - 1];
         if (
            lastMessage?.type === ChatMessageType.System &&
            lastMessage?.content === ''
         ) {
            return prevMessages.slice(0, -1);
         }
         return prevMessages;
      });
   };

   const handleTextareaKeyDown = (
      e: React.KeyboardEvent<HTMLTextAreaElement>
   ) => {
      if (e.key === 'Enter') {
         if (e.shiftKey) {
            // Shift + Enter - Add new line
            return;
         }

         e.preventDefault();

         sendPrompt();
      }
   };

   const handleSendMessageButtonClick = () => {
      sendPrompt();
   };

   const handleStopResponseButtonClick = () => {
      promptRequestControllerAbort.current.abort();
      promptRequestControllerAbort.current = new AbortController();

      setIsLoading(false);
   };

   const sendPrompt = (prompt?: string) => {
      prompt ??= textareaValue;

      addUserMessage(prompt);
      promptChatCompletionAPI(prompt);
   };

   const promptChatCompletionAPI = async (
      prompt?: string,
      codeContext?: string
   ) => {
      prompt ??= textareaValue;
      codeContext ??= chatCodeContext;

      const req = () =>
         GptApi.getCodeCompletion(
            chatId.current,
            prompt!,
            chatCodeContext,
            fileExtension,
            aiModel,
            maxTokens,
            openAIApiKey,
            authToken,
            promptRequestControllerAbort.current.signal
         );

      await processCompletionApiRequest(req);
   };

   const promptAILensAPI = async (lensId: string, codeContext?: string) => {
      codeContext ??= chatCodeContext;

      const req = () =>
         GptApi.getAILensCompletion(
            chatId.current,
            lensId,
            codeContext || '',
            fileExtension,
            aiModel,
            maxTokens,
            openAIApiKey,
            authToken,
            promptRequestControllerAbort.current.signal
         );

      await processCompletionApiRequest(req);
   };

   const processCompletionApiRequest = async (req: () => Promise<Response>) => {
      setIsAutoScrollEnabled(true);
      setIsLoading(true);

      // Set empty message that will show typing indicator
      setMessages((prev: Message[]) => [
         ...prev,
         { type: ChatMessageType.System, content: '' },
      ]);

      let errorMessage = '';

      try {
         const response = await req();

         if (response.ok && response.body) {
            await handleStreamedResponse(response.body.getReader());
         } else if (response.status === 402) {
            errorMessage = 'Insufficient credits';
         } else if (response.status === 400 || response.status === 403) {
            const res = await response.json();

            if (res?.message) {
               errorMessage = res.message;
            } else {
               errorMessage =
                  'Oops! Something went wrong. Please try again later.';
            }
         } else if (response.status === 429) {
            const res = await response.json();
            errorMessage =
               res.message || 'Too many requests. Please try again later.';
         } else {
            errorMessage = 'Something went wrong. Please try again later.';
         }

         if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            setTextareaHeight(40);
         }
      } catch (error: any) {
         // Remove the last empty system message
         // that was added to show typing indicator
         removeLastEmptySystemMessage();

         if (error?.response?.status) {
            toast({
               description: 'Try again later.',
               status: 'error',
               duration: 4000,
            });
         }
         console.error(error);
      } finally {
         if (errorMessage) {
            replaceLastSystemMessage({
               type: ChatMessageType.System,
               content: errorMessage,
               isError: true,
               key: `error-${Date.now()}`,
            });
         }
         setIsLoading(false);
      }
   };

   const handleStreamedResponse = async (
      reader: ReadableStreamDefaultReader<Uint8Array>
   ) => {
      const decoder = new TextDecoder();
      let buffer = '';
      let done, value;
      while (true) {
         ({ done, value } = await reader.read());
         if (done) break;
         const chunk = decoder.decode(value, { stream: true });
         buffer += chunk;

         if (buffer) {
            setMessages((prev: Message[]) => {
               const msgType = prev[prev.length - 1]?.type;
               if (msgType === ChatMessageType.System) {
                  return [
                     ...prev.slice(0, -1),
                     { type: ChatMessageType.System, content: buffer },
                  ];
               }
               return [
                  ...prev,
                  { type: ChatMessageType.System, content: buffer },
               ];
            });
         }
      }
   };

   const handleSettingsIconClick = () => {
      setTempStateValue(StateKeys.IsSettingsPanelOpened, true);
   };

   const handleAIChatCommandMessage = (payload: any) => {
      const { data: code, chatCommand, chatCommandMetadata } = payload || {};

      if (!chatCommand) {
         return;
      }

      if (!isAuthenticated) {
         toast({
            description: 'Please log in to access AI chat features',
            status: 'warning',
            duration: 4000,
         });
         return;
      }

      if (!code) {
         toast({
            description: 'No code found to refactor',
            status: 'warning',
            duration: 4000,
         });
         return;
      }

      if (isLoading) {
         toast({
            description: 'Please wait for the current request to complete',
            status: 'warning',
            duration: 4000,
         });
         return;
      }

      const { lensName, lensId } = chatCommandMetadata || {};
      if (chatCommand === AIChatCommand.AICodeLens && !lensId) {
         toast({
            description: 'No lens found',
            status: 'warning',
            duration: 4000,
         });
         return;
      }

      addUserMessage(
         <UserChatCommandBox
            chatCommand={chatCommand}
            lensName={lensName}
            code={code}
         />
      );
      switch (chatCommand) {
         case AIChatCommand.AICodeLens:
            promptAILensAPI(lensId, code);
            break;
      }
   };

   useVSCodeMessageSubscriber({
      messageCommand: MessageCommand.AIChatCommand,
      callback: handleAIChatCommandMessage,
   });

   // Handle scroll with debounce
   const handleMessageContainerScroll = debounce(() => {
      if (messagesContainerRef.current) {
         const { scrollTop, scrollHeight, clientHeight } =
            messagesContainerRef.current;
         const currentScrollTop = scrollTop;

         // Check if we have scrolled up more than the threshold
         if (currentScrollTop < lastScrollTopRef.current - scrollUpThreshold) {
            setIsAutoScrollEnabled(false);
         } else if (
            currentScrollTop >=
            scrollHeight - clientHeight - bottomThreshold
         ) {
            // Check if user is near the bottom, not necessarily exactly at the bottom
            setIsAutoScrollEnabled(true);
         }

         // Update lastScrollTop for the next scroll event
         lastScrollTopRef.current =
            currentScrollTop <= 0 ? 0 : currentScrollTop;
      }
   }, 100); // Debounce time in milliseconds, adjust as needed

   const messagesRendered = useMemo(
      () =>
         messages.map((message: Message, index: number) => (
            <ChatMessage
               key={message.key || `message-${index}`}
               type={message.type}
               content={message.content}
               isError={message.isError}
            />
         )),
      [messages]
   );

   const handleChatClearButtonClick = () => {
      setMessages([]);
      chatId.current = generateGuid();
   };

   return (
      <>
         <Flex
            direction='column'
            justify='space-between'
            alignItems='center'
            gap={4}
            h='100%'
            w='100%'
            overflowX='hidden'
         >
            <VStack
               position='relative'
               onScroll={handleMessageContainerScroll}
               ref={messagesContainerRef}
               spacing={4}
               width='100%'
               pb='40px'
               overflowY='auto'
               maxH={`calc(100% - ${
                  (textareaHeight > 200 ? 200 : textareaHeight) + 30
               }px)`}
            >
               <Flex position='absolute' right={6} top={3}>
                  <Tooltip label='Settings' placement='bottom'>
                     <IconButton
                        icon={<SettingsIcon boxSize='23px' />}
                        aria-label='Settings'
                        onClick={handleSettingsIconClick}
                     />
                  </Tooltip>
               </Flex>
               {messages?.length > 0 || !!chatCodeContext ? (
                  <>
                     <CenteredContainer
                        pb={5}
                        pt='30px'
                        gap={6}
                        direction='column'
                     >
                        <BrandLogo />
                        <FlexCentered gap={1}>
                           <Text
                              fontWeight='500'
                              opacity={0.7}
                              fontSize='small'
                           >
                              {' '}
                              Model:
                           </Text>
                           <Badge
                              maxW={200}
                              textTransform='none'
                              px='8px'
                              py={1}
                              borderRadius='3px'
                              fontSize='small'
                           >
                              {aiModel}
                           </Badge>
                        </FlexCentered>
                        <Flex
                           direction='column'
                           gap={5}
                           justify='center'
                           align='center'
                        >
                           {!!chatCodeContext && (
                              <Flex
                                 position='relative'
                                 _hover={{ '.hover-button': { opacity: 1 } }}
                              >
                                 <CodeSnippetModalButton
                                    modalTitle='Chat Code Context'
                                    code={chatCodeContext}
                                 >
                                    Code Context
                                 </CodeSnippetModalButton>

                                 <Flex
                                    className='hover-button'
                                    position='absolute'
                                    right='-70px'
                                    opacity='0'
                                    _hover={{ opacity: 1 }}
                                    transition='opacity 0.2s ease-in-out'
                                 >
                                    <Tooltip
                                       label='Clear context'
                                       placement='right'
                                    >
                                       <Button
                                          colorScheme='red'
                                          variant='outline'
                                          onClick={() => {
                                             setTempStateValue(
                                                StateKeys.AIChatCodeContext,
                                                ''
                                             );
                                          }}
                                       >
                                          <svg
                                             xmlns='http://www.w3.org/2000/svg'
                                             width='24'
                                             height='24'
                                             viewBox='0 0 24 24'
                                             fill='none'
                                             stroke='currentColor'
                                             strokeWidth='2'
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                          >
                                             <path d='M18 6 6 18' />
                                             <path d='m6 6 12 12' />
                                          </svg>
                                       </Button>
                                    </Tooltip>
                                 </Flex>
                              </Flex>
                           )}
                           <Flex pt={2}>
                              {!isAuthenticated && <LoginButton />}
                           </Flex>
                        </Flex>
                     </CenteredContainer>

                     <Flex w='full' direction='column' justify='start'>
                        {messagesRendered}
                     </Flex>
                  </>
               ) : (
                  <ChatWelcomePanel />
               )}
            </VStack>
            <CenteredContainer position='fixed' bottom={5}>
               <Flex direction='row' align='center' gap={3} width='100%'>
                  <Flex justify='center' w='25px' h='full' mr={2}>
                     <Tooltip label='Clear chat'>
                        <Button
                           display='flex'
                           variant='outline'
                           w='full'
                           h='full'
                           p={0}
                           onClick={handleChatClearButtonClick}
                        >
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='19'
                              height='19'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='1'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                           >
                              <path d='m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21' />
                              <path d='M22 21H7' />
                              <path d='m5 11 9 9' />
                           </svg>
                        </Button>
                     </Tooltip>
                  </Flex>
                  <Textarea
                     bg='#717171'
                     placeholder={
                        !isAuthenticated
                           ? 'Log in to start chatting'
                           : 'Ask AI anything...'
                     }
                     maxH='200px'
                     minH='44px'
                     overflow='hidden'
                     resize='none'
                     rows={1}
                     border='none'
                     fontSize={{
                        base: '14px',
                        sm: '15px',
                        md: '16px',
                        lg: '17px',
                     }}
                     sx={{
                        boxShadow:
                           '0 0 transparent,0 0 transparent,0 0 15px rgba(0,0,0,.4)',
                     }}
                     _placeholder={{
                        color: 'whiteAlpha.600',
                     }}
                     _focus={{
                        outline: 'none',
                     }}
                     _focusVisible={{
                        outline: 'none',
                     }}
                     ref={textareaRef}
                     value={textareaValue}
                     isDisabled={!isAuthenticated}
                     onInput={() => resizeTextarea()}
                     onChange={handleTextareaChange}
                     onKeyDown={handleTextareaKeyDown}
                  />
                  {isLoading ? (
                     <Box>
                        <Tooltip label='Stop'>
                           <Button
                              h='44px'
                              colorScheme='red'
                              onClick={handleStopResponseButtonClick}
                           >
                              <img
                                 src={ENV.StopCircleIconUrl}
                                 alt='Stop'
                                 width='27px'
                                 height='27px'
                              />
                           </Button>
                        </Tooltip>
                     </Box>
                  ) : (
                     <Button
                        h='44px'
                        colorScheme='fineGreen'
                        color='whiteAlpha.800'
                        isDisabled={textareaValue === '' || !isAuthenticated}
                        onClick={handleSendMessageButtonClick}
                        isLoading={isLoading}
                     >
                        <img
                           src={ENV.SendIconUrl}
                           alt='Send'
                           width='27px'
                           height='27px'
                        />
                     </Button>
                  )}
               </Flex>
            </CenteredContainer>
         </Flex>
      </>
   );
};
