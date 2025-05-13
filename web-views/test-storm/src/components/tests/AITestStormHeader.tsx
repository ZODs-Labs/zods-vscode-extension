import { Box, Divider, Flex, Text } from '@chakra-ui/react';

import { BrandLogo } from '@zods/webview-core';

import { ENV } from '../../env';

const AITestStormHeader = () => {
   return (
      <Flex justify='space-between' userSelect='none'>
         <Flex direction='column' gap={6}>
            <Flex gap={3}>
               <img
                  src={ENV.AITestStormIconUrl}
                  alt='AI Test Storm Icon'
                  height={50}
                  width={50}
               />
               <Text as='h1' fontSize='2xl'>
                  AI Test Storm
               </Text>
            </Flex>
            <Divider w='100%' />
         </Flex>

         <Box transform='scale(0.7)' mr={-4} mt={-4}>
            <BrandLogo url={ENV.RawLogoUrl} />
         </Box>
      </Flex>
   );
};

export default AITestStormHeader;
