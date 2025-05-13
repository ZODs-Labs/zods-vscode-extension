import React from 'react';

import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
   Accordion,
   AccordionButton,
   AccordionItem,
   AccordionPanel,
   Divider,
   Flex,
   Icon,
   Text,
   Tooltip,
} from '@chakra-ui/react';

import { ClipboardList } from 'lucide-react';

import { ShScaleFade } from '@zods/webview-core';

import { ENV } from '../../env';
import AITestStormControls from './AITestStormControls';
import AITestStormHeader from './AITestStormHeader';
import AITestStormList from './AITestStormList';
import AITestStormTestCases from './cases/AITestStormTestCases';

const AITestContainerAccordionItem = ({
   title,
   icon,
   accordionPanel,
}: {
   title: string | React.ReactNode;
   icon: React.ReactNode;
   accordionPanel: React.ReactNode;
}) => {
   return (
      <ShScaleFade>
         <AccordionItem
            borderTop='transparent'
            borderTopWidth={0}
            borderBottom='none'
            mt='70px'
         >
            <AccordionButton p={0} pt={5}>
               <Flex direction='column' flex={1}>
                  <Flex gap={2}>
                     {icon}
                     <Text as='h3' fontSize='2xl' fontWeight='bold'>
                        {title}
                     </Text>
                  </Flex>
                  <Divider w='full' mb={6} pt={6} />
               </Flex>
            </AccordionButton>
            <AccordionPanel border='none' p={0} pb={5} overflow='visible'>
               {accordionPanel}
            </AccordionPanel>
         </AccordionItem>
      </ShScaleFade>
   );
};

const AITestStormContainer = () => {
   return (
      <Flex direction='column' py='15px' px='10px'>
         <AITestStormHeader />

         <Accordion defaultIndex={[0, 1, 2]} allowMultiple={true}>
            <AITestContainerAccordionItem
               title={
                  <Flex gap={2} alignItems='center'>
                     <Text as='h4' fontSize='2xl' fontWeight='bold'>
                        Controls
                     </Text>

                     <Tooltip
                        label='Define settings for the test storm.'
                        placement='right'
                     >
                        <QuestionOutlineIcon
                           cursor='pointer'
                           opacity={0.6}
                           w='15px'
                           h='15px'
                           aria-label='Note'
                        />
                     </Tooltip>
                  </Flex>
               }
               icon={
                  <img
                     src={ENV.StormIconUrl}
                     alt='Test'
                     width={20}
                     height={20}
                  />
               }
               accordionPanel={<AITestStormControls />}
            />

            <AITestContainerAccordionItem
               title='Test Cases'
               icon={
                  <Icon
                     as={ClipboardList}
                     strokeWidth={1.5}
                     boxSize='25px'
                     mt='6px'
                     color='stormBlue.300'
                  />
               }
               accordionPanel={<AITestStormTestCases />}
            />

            <AITestContainerAccordionItem
               title='Tests'
               icon={
                  <img
                     src={ENV.TestIconUrl}
                     alt='Test'
                     width={25}
                     height={25}
                  />
               }
               accordionPanel={<AITestStormList />}
            />
         </Accordion>
      </Flex>
   );
};

export default AITestStormContainer;
