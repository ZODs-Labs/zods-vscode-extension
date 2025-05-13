import { Flex, Text } from '@chakra-ui/react';

import { ENV } from '../env';

const BrandLogo = () => {
   return (
      <Flex flexDirection='column' align='center' gap={3}>
         <img
            src={ENV.RawLogoUrl}
            width='90px'
            height='90px'
            alt='ZODs AI'
         />
         <Flex direction='column' align='center'>
            <Text fontSize='12px' color='gray.400'>
               Powered by
            </Text>
            <Text fontWeight='bold' fontSize='xl'>
               ZODs AI
            </Text>
         </Flex>
      </Flex>
   );
};

export default BrandLogo;
