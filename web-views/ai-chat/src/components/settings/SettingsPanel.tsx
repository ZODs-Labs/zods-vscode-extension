import { useState } from 'react';

import { CloseIcon } from '@chakra-ui/icons';
import {
   Button,
   Flex,
   IconButton,
   Text,
   Select,
   Tooltip,
   useToast,
   Input,
} from '@chakra-ui/react';

import { AIModel, Command, VsCodeConfigKeys } from '@zods/core';
import { StateKeys, useTempState } from '@zods/webview-core';

import BrandLogo from '../BrandLogo';
import CenteredContainer from '../CenteredContainer';
import AILensSettings from './AILensSettings';

const SettingsPanel = () => {
   const { getTempStateValue, setTempStateValue } = useTempState();
   const aiModelFromState = getTempStateValue(StateKeys.AIModel);
   const aiChatMaxTokensFromState = getTempStateValue(
      StateKeys.MaxAIChatTokens
   );
   const openAIApiKeyState = getTempStateValue(StateKeys.OpenAIApiKey);
   const toast = useToast();

   const [aiModel, setAiModel] = useState<string>(aiModelFromState);
   const [aiChatMaxTokens, setAiChatMaxTokens] = useState<number>(
      isNaN(aiChatMaxTokensFromState) ? 1500 : +aiChatMaxTokensFromState
   );
   const [openAIApiKey, setOpenAIApiKey] = useState<string>(openAIApiKeyState);

   const handleCloseIconButtonClick = () => {
      setTempStateValue(StateKeys.IsSettingsPanelOpened, false);
   };

   const handleAIChatMaxTokensChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = +e.target.value;
      if (value < 0) {
         setAiChatMaxTokens(1);
      } else if (value > 4_000) {
         setAiChatMaxTokens(4_000);
      } else {
         setAiChatMaxTokens(value);
      }
   };

   const handleOpenAIApiKeyChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setOpenAIApiKey(e.target.value);
   };

   const handleSaveSettingsButtonClick = () => {
      vscode.postMessage({
         type: 'command',
         command: Command.UpdateConfig,
         data: {
            [VsCodeConfigKeys.AIModel]: aiModel,
            [VsCodeConfigKeys.MaxAIChatTokens]: aiChatMaxTokens,
            [VsCodeConfigKeys.OpenAIAPIKey]: openAIApiKey,
         },
      });

      toast({
         title: 'Settings saved.',
         status: 'success',
         duration: 3000,
         isClosable: true,
      });
   };

   return (
      <Flex
         position='fixed'
         top={0}
         left={0}
         zIndex={2}
         h='100vh'
         w='100vw'
         pt='30px'
         overflowY='auto'
         bg='var(--vscode-activityBar-background)'
      >
         <Flex position='absolute' right={6} top={3}>
            <Tooltip label='Close' placement='bottom'>
               <IconButton
                  icon={<CloseIcon boxSize='18px' />}
                  aria-label='Close'
                  onClick={handleCloseIconButtonClick}
                  color='white'
               />
            </Tooltip>
         </Flex>
         <CenteredContainer
            direction='column'
            gap='50px'
            justify='start'
            align='center'
         >
            <BrandLogo />
            {/* Config items */}

            <Flex
               direction='column'
               gap={7}
               w={{
                  base: '95%',
                  sm: '90%',
                  md: '70%',
                  lg: '60%',
               }}
               pb='50px'
            >
               {/* AI Model Selector */}
               <Flex gap={3}>
                  <Flex align='center'>
                     <Text fontSize='md'>AI Model:</Text>
                  </Flex>
                  <Select
                     value={aiModel}
                     onChange={(e) => setAiModel(e.target.value)}
                     w='220px'
                     fontSize='md'
                  >
                     <option
                        style={{
                           fontSize: '14px',
                        }}
                        value={AIModel.GPT4oMini}
                     >
                        {AIModel.GPT4oMini}
                     </option>
                     <option
                        style={{
                           fontSize: '14px',
                        }}
                        value={AIModel.GPT4o}
                     >
                        {AIModel.GPT4o}
                     </option>
                  </Select>
               </Flex>
               {/* /AI Model Selector */}

               {/* AI Chat - Max Tokens */}
               <Flex gap={3}>
                  <Flex align='center'>
                     <Text fontSize='md'>Max Tokens:</Text>
                  </Flex>
                  <Input
                     w='220px'
                     fontSize='md'
                     value={aiChatMaxTokens}
                     onChange={handleAIChatMaxTokensChange}
                  />
               </Flex>
               {/* /AI Chat - Max Tokens */}

               {/* AI Chat - OpenAI API Key */}
               <Flex gap={3}>
                  <Flex align='center'>
                     <Text fontSize='md'>OpenAI API Key:</Text>
                  </Flex>
                  <Input
                     w='220px'
                     fontSize='md'
                     value={openAIApiKey}
                     onChange={handleOpenAIApiKeyChange}
                  />
               </Flex>
               {/* /AI Chat - OpenAI API Key */}

               {/* AI Lenses */}
               <AILensSettings openAIApiKey={openAIApiKey} />
               {/* /AI Lenses */}

               <Button onClick={handleSaveSettingsButtonClick}>Save</Button>
            </Flex>
            {/* /Config items */}
         </CenteredContainer>
      </Flex>
   );
};

export default SettingsPanel;
