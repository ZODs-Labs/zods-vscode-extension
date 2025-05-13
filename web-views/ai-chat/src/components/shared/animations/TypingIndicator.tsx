import { Flex } from '@chakra-ui/react';

export const TypingIndicator = () => {
   return (
      <Flex justifyContent='end'>
         <div className='typingIndicatorContainer'>
            <div className='typingIndicatorBubble'>
               <div className='typingIndicatorBubbleDot'></div>
               <div className='typingIndicatorBubbleDot'></div>
               <div className='typingIndicatorBubbleDot'></div>
            </div>
         </div>
      </Flex>
   );
};
